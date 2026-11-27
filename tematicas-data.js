/* RMI · Aulas temáticas: lista de aulas agrupadas por nivel (de menor a mayor).
   Cada aula tiene dos equipos que se revisan: el ordenador del profesorado y la pantalla SMART. */
const TEM_KEY = "tematicas-estado-v1";

const TEM_SECCIONES = [
  {nivel: "1º ESO", aulas: [
    {cod: "AG1", nombre: "Aula 1º A"},
    {cod: "AG2", nombre: "Aula 1º B"},
    {cod: "AG3", nombre: "Aula 1º C"},
  ]},
  {nivel: "2º ESO", aulas: [
    {cod: "AG5", nombre: "Aula 2º A"},
    {cod: "AG6", nombre: "Aula 2º B"},
    {cod: "AG4", nombre: "Aula 2º C"},
  ]},
  {nivel: "3º ESO", aulas: [
    {cod: "AG8",  nombre: "Aula 3º A"},
    {cod: "AG9",  nombre: "Aula 3º B"},
    {cod: "AG15", nombre: "Aula 3º DIVER"},
  ]},
  {nivel: "4º ESO", aulas: [
    {cod: "AG10", nombre: "Aula 4º A"},
    {cod: "AG11", nombre: "Aula 4º B"},
    {cod: "AG13", nombre: "Aula 1º HCS · 4º DIVER"},
  ]},
  {nivel: "1º Bachillerato", aulas: [
    {cod: "AG19", nombre: "Aula 1º CIT"},
  ]},
  {nivel: "2º Bachillerato", aulas: [
    {cod: "AG14", nombre: "Aula 2º CIT"},
    {cod: "AG20", nombre: "Aula 2º HCS"},
  ]},
  {nivel: "Formación Profesional", aulas: [
    {cod: "AG18", nombre: "Aula de FPB"},
    {cod: "AG16", nombre: "Aula de Ciclo Formativo G. M."},
    {cod: "AG17", nombre: "Aula Ciclo Formativo II"},
    {cod: "AG12", nombre: "Aula 2º Grado Superior"},
  ]},
  {nivel: "Otras aulas", aulas: [
    {cod: "AG7",  nombre: "Aula EDIT"},
    {cod: "AG21", nombre: "Aula de Apoyo"},
    {cod: "ADA1", nombre: "Aula Convivencia"},
    {cod: "AV1",  nombre: "Audiovisuales · Tutoría"},
  ]},
  {nivel: "Laboratorios", aulas: [
    {cod: "AB1", nombre: "Laboratorio de Ciencias Naturales"},
    {cod: "AB2", nombre: "Laboratorio de Física y Química"},
  ]},
];

const TEM_EQUIPOS = [
  {id: "PROF",  nombre: "Ordenador del profesorado", img: "img/pc-profesorado.png"},
  {id: "SMART", nombre: "Pantalla SMART",            img: "img/pizarra-smart.png"},
];

const TEM_AULAS = TEM_SECCIONES.flatMap(s => s.aulas.map(a => ({...a, nivel: s.nivel})));
