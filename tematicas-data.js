/* RMI · Aulas temáticas: lista de aulas agrupadas por nivel (de menor a mayor).
   Cada aula tiene por defecto dos equipos que se revisan: el ordenador del profesorado y la pantalla SMART.
   Un aula puede llevar su propia lista de equipos con "equipos: [...]" (p. ej., AV1). */
const TEM_KEY = "tematicas-estado-v1";

const TEM_SECCIONES = [
  {nivel: "1º ESO", aulas: [
    {cod: "AG1", nombre: "Aula 1º A"},
    {cod: "AG2", nombre: "Aula 1º B"},
  ]},
  {nivel: "2º ESO", aulas: [
    {cod: "AG5", nombre: "Aula 2º A"},
    {cod: "AG6", nombre: "Aula 2º B"},
  ]},
  {nivel: "3º ESO", aulas: [
    {cod: "AG8",  nombre: "Aula 3º A"},
    {cod: "AG9",  nombre: "Aula 3º B"},
    {cod: "AG15", nombre: "Aula 3º DIVER"},
  ]},
  {nivel: "4º ESO", aulas: [
    {cod: "AG10", nombre: "Aula 4º A"},
    {cod: "AG11", nombre: "Aula 4º B"},
    {cod: "?",    nombre: "Aula 4º DIVER"},
  ]},
  {nivel: "1º Bachillerato", aulas: [
    {cod: "AG19", nombre: "Aula 1º CIT"},
    {cod: "AG13", nombre: "Aula 1º HCS"},
  ]},
  {nivel: "2º Bachillerato", aulas: [
    {cod: "AG14", nombre: "Aula 2º CIT"},
    {cod: "AG20", nombre: "Aula 2º HCS"},
  ]},
  {nivel: "Formación Profesional", aulas: [
    {cod: "AG18", nombre: "Aula de FPB"},
    {cod: "AG12", nombre: "Aula 2º Grado Superior"},
    {cod: "?3",   nombre: "Aula de Comercio"},
  ]},
  {nivel: "Otras aulas", aulas: [
    {cod: "AG21", nombre: "Aula de Apoyo"},
    {cod: "?4",   nombre: "Aula de Apoyo (Orientación)"},
    {cod: "ADA1", nombre: "Aula Convivencia"},
    {cod: "AV1",  nombre: "Audiovisuales · Tutoría", equipos: ["PROF", "PROYECTOR", "SONIDO"]},
    {cod: "?2",   nombre: "Aula Taller"},
  ]},
  {nivel: "Laboratorios", aulas: [
    {cod: "AB1", nombre: "Laboratorio de Ciencias Naturales"},
    {cod: "AB2", nombre: "Laboratorio de Física y Química"},
  ]},
];

const TEM_EQUIPOS = [
  {id: "PROF",  nombre: "Ordenador del profesorado", img: "img/pc-profesorado.png"},
  {id: "SMART", nombre: "Pantalla SMART",            img: "img/pizarra-smart.png"},
  {id: "PROYECTOR", nombre: "Proyector Optoma",       img: "img/proyector-optoma.png", corto: "Proyector"},
  {id: "SONIDO",    nombre: "Equipo de sonido",       img: "img/1795775270665_image.png", corto: "Sonido", mics: 6},
];
const TEM_BASE = ["PROF", "SMART"];
/* Equipos que tiene un aula concreta */
function temEquiposDe(a){ return (a && a.equipos ? a.equipos : TEM_BASE).map(id => TEM_EQUIPOS.find(e => e.id === id)).filter(Boolean); }

const TEM_AULAS = TEM_SECCIONES.flatMap(s => s.aulas.map(a => ({...a, nivel: s.nivel})));
