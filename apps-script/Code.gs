/**
 * RMI · Recursos informáticos IES Alquipir — almacén compartido de anotaciones.
 * Pega este código en Extensiones > Apps Script de una hoja de cálculo de Google
 * e impleméntalo como «Aplicación web» (Ejecutar como: yo · Acceso: cualquier usuario).
 * Cada fila de la pestaña «datos» es un equipo con anotaciones.
 */
const HOJA = "datos";
const CABECERA = ["aula", "puesto", "estado", "anotaciones", "anotado por", "fecha", "json"];
const ESTADOS = {ok: "Funciona bien", warn: "Con incidencias", bad: "No funciona", "": "Sin revisar"};

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(HOJA);
  if (!s) {
    s = ss.insertSheet(HOJA);
    s.appendRow(CABECERA);
    s.setFrozenRows(1);
    s.getRange("B:B").setNumberFormat("@");
  }
  return s;
}

function leerTodo_() {
  const v = hoja_().getDataRange().getValues();
  const out = {};
  for (let i = 1; i < v.length; i++) {
    const aula = String(v[i][0]), id = String(v[i][1]);
    if (!aula) continue;
    try { (out[aula] = out[aula] || {})[id] = JSON.parse(v[i][6]); } catch (e) {}
  }
  return out;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const todo = leerTodo_();
  return json_(p.key ? {ok: true, data: todo[p.key] || {}} : {ok: true, all: todo});
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.action !== "batch" || !b.key || !Array.isArray(b.ops)) return json_({ok: false, error: "Petición no válida"});
    const s = hoja_();
    const v = s.getDataRange().getValues();
    const fila = {};
    for (let i = 1; i < v.length; i++) fila[String(v[i][0]) + "|" + String(v[i][1])] = i + 1;
    const borrar = [];
    b.ops.forEach(op => {
      const id = String(op.id), r = fila[b.key + "|" + id];
      if (op.rec) {
        const x = op.rec;
        const datos = [b.key, id, ESTADOS[x.st || ""] || "", x.note || "", x.who || "", x.date || "", JSON.stringify(x)];
        if (r) s.getRange(r, 1, 1, datos.length).setValues([datos]);
        else { s.appendRow(datos); fila[b.key + "|" + id] = s.getLastRow(); }
      } else if (r) borrar.push(r);
    });
    borrar.sort((a, c) => c - a).forEach(r => s.deleteRow(r));
    return json_({ok: true});
  } catch (err) {
    return json_({ok: false, error: String(err)});
  } finally {
    lock.releaseLock();
  }
}
