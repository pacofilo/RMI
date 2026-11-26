/* RMI · sincronización compartida.
   Las anotaciones se guardan en una hoja de cálculo de Google (a través de Apps Script),
   así todos los dispositivos (móvil, ordenador, app) ven y modifican lo mismo.
   El navegador conserva una copia local para abrir la web sin conexión; los cambios hechos
   sin conexión se envían solos en cuanto vuelve Internet. */
const RMI_SYNC_URL = "https://script.google.com/macros/s/AKfycbzNCLtsFVP-rzvOGSvqrGenNeyTafOheLfenSQ_hNNS_HG6_nlS_bPVAhMjzW-YSZJ6KQ/exec"; // ← URL de la aplicación web de Apps Script (termina en /exec)

const RMISync = (() => {
  const on = !!RMI_SYNC_URL;
  const clone = o => JSON.parse(JSON.stringify(o || {}));
  const lsGet = (k, def) => { try { const v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); } catch (e) { return def; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  /* ---------- Indicador de estado (esquina inferior) ---------- */
  let badge = null;
  function status(kind, text){
    if (!on) return;
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "rmiSync";
      badge.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:9999;padding:6px 12px;border-radius:999px;" +
        "font:600 12px/1.2 'DM Sans',system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.15);transition:opacity .4s;pointer-events:none";
      document.body.appendChild(badge);
    }
    const col = {ok: ["#e6f2e6", "#2d6a2d"], busy: ["#fff4d6", "#8a6a00"], off: ["#fbe3dc", "#8a3b1f"]}[kind];
    badge.style.background = col[0]; badge.style.color = col[1];
    badge.textContent = text; badge.style.opacity = "1";
    clearTimeout(badge._t);
    if (kind === "ok") badge._t = setTimeout(() => { badge.style.opacity = ".55"; }, 2500);
  }

  async function get(params){
    const r = await fetch(RMI_SYNC_URL + "?" + new URLSearchParams(params) + "&_=" + Date.now(), {cache: "no-store"});
    const j = await r.json(); if (!j.ok) throw new Error(j.error || "Error"); return j;
  }
  async function post(body){
    // text/plain evita la petición previa CORS, que Apps Script no admite
    const r = await fetch(RMI_SYNC_URL, {method: "POST", headers: {"Content-Type": "text/plain;charset=utf-8"}, body: JSON.stringify(body)});
    const j = await r.json(); if (!j.ok) throw new Error(j.error || "Error"); return j;
  }

  /* ---------- Página de un aula ---------- */
  function attach(KEY, getData, setData){
    const K_SHADOW = KEY + "__sync", K_PEND = KEY + "__pend";
    let shadow = lsGet(K_SHADOW, null);         // última versión que coincide con el servidor
    let pend = lsGet(K_PEND, {});               // cambios aún no enviados: {id: ficha | null}
    let busy = false, again = false;

    function push(){                            // se llama cada vez que la página guarda
      if (!on) return;
      const cur = getData(), base = shadow || {};
      new Set([...Object.keys(base), ...Object.keys(cur)]).forEach(id => {
        if (JSON.stringify(base[id]) !== JSON.stringify(cur[id])) pend[id] = cur[id] ? clone(cur[id]) : null;
      });
      shadow = clone(cur); lsSet(K_SHADOW, shadow); lsSet(K_PEND, pend);
      sync();
    }

    async function sync(){
      if (!on) return;
      if (busy) { again = true; return; }
      busy = true;
      try {
        const ids = Object.keys(pend);
        if (ids.length) {
          status("busy", "⏳ Guardando en la web…");
          const sent = clone(pend);
          await post({action: "batch", key: KEY, ops: ids.map(id => ({id, rec: sent[id]}))});
          ids.forEach(id => { if (JSON.stringify(pend[id]) === JSON.stringify(sent[id])) delete pend[id]; });
          lsSet(K_PEND, pend);
        }
        const remote = (await get({key: KEY})).data || {};
        if (shadow === null) {                  // primera vez en este dispositivo: sube lo que solo existe aquí
          const local = getData(); let up = false;
          Object.keys(local).forEach(id => { if (!remote[id]) { pend[id] = clone(local[id]); up = true; } });
          shadow = {}; lsSet(K_PEND, pend);
          if (up) { again = true; }
        }
        const merged = clone(remote);
        Object.entries(pend).forEach(([id, rec]) => { if (rec) merged[id] = rec; else delete merged[id]; });
        shadow = clone(merged); lsSet(K_SHADOW, shadow);
        if (JSON.stringify(merged) !== JSON.stringify(getData())) setData(merged);
        status("ok", Object.keys(pend).length ? "⏳ Pendiente de guardar" : "☁ Guardado en la web");
      } catch (e) {
        status("off", Object.keys(pend).length ? "⚠ Sin conexión: se guardará al volver Internet" : "⚠ Sin conexión: datos de este dispositivo");
      } finally {
        busy = false;
        if (again) { again = false; setTimeout(sync, 300); }
      }
    }

    if (on) {
      setTimeout(sync, 0);
      setInterval(() => { if (document.visibilityState === "visible") sync(); }, 20000);
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") sync(); });
      window.addEventListener("online", sync);
    }
    return {push, sync};
  }

  /* ---------- Portada: trae el estado de todas las aulas ---------- */
  async function pullAll(keys, onDone){
    if (!on) return;
    try {
      const all = (await get({all: 1})).all || {};
      keys.forEach(k => {
        const merged = clone(all[k]);
        Object.entries(lsGet(k + "__pend", {})).forEach(([id, rec]) => { if (rec) merged[id] = rec; else delete merged[id]; });
        lsSet(k, merged);
      });
      onDone(); status("ok", "☁ Datos actualizados");
    } catch (e) { status("off", "⚠ Sin conexión: datos de este dispositivo"); }
  }

  return {enabled: on, attach, pullAll};
})();
