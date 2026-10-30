// Plan de 21 dias.
// Principios: practica intercalada (cada dia mezcla temas), repeticion espaciada (repasos a 1, 3 y 7 dias),
// recuerdo activo (2 lineas antes de codificar), Feynman (explicar al terminar), Pomodoro 50/10.
// Tareas: {t: "problema", slug} | {t: "guia", ruta, texto} | {t: "quiz", n} | {t: "simulacro"} | {t: "texto", texto}
window.PLAN = [
  // ---------------- Semana 1: lectura de entrada y faciles de cada tema ----------------
  { dia: 1, semana: 1, foco: "Lectura de entrada", tareas: [
    { t: "guia", ruta: "guias/lectura", texto: "Leer la guía de lectura rápida y escribir de memoria los 6 patrones" },
    { t: "problema", slug: "uva-11332" },
    { t: "problema", slug: "uva-13190" },
  ] },
  { dia: 2, semana: 1, foco: "Primer contacto: bisección y DP", tareas: [
    { t: "guia", ruta: "guias/reconocer", texto: "Leer la guía «Cómo reconocer la técnica» (15 min)" },
    { t: "problema", slug: "uva-12097" },
    { t: "problema", slug: "uva-10912" },
  ] },
  { dia: 3, semana: 1, foco: "Voraz y backtracking", tareas: [
    { t: "problema", slug: "uva-12834" },
    { t: "problema", slug: "uva-10344" },
    { t: "texto", texto: "Feynman: explicar con tus palabras uno de los problemas de hoy" },
  ] },
  { dia: 4, semana: 1, foco: "Precálculo y subset sum", tareas: [
    { t: "problema", slug: "uva-11876" },
    { t: "problema", slug: "uva-574" },
  ] },
  { dia: 5, semana: 1, foco: "DP en grilla y voraz de un recorrido", tareas: [
    { t: "problema", slug: "uva-10259" },
    { t: "problema", slug: "uva-11240" },
  ] },
  { dia: 6, semana: 1, foco: "Generar combinaciones", tareas: [
    { t: "problema", slug: "uva-10776" },
    { t: "texto", texto: "Recuerdo activo: rehacer de memoria (sin mirar) un problema resuelto el día 2 o 3" },
    { t: "guia", ruta: "guias/plantillas", texto: "Repasar las plantillas de dividir y conquistar y de DP" },
  ] },
  { dia: 7, semana: 1, foco: "Cierre de semana", tareas: [
    { t: "problema", slug: "uva-10576" },
    { t: "quiz", n: 15 },
    { t: "guia", ruta: "bitacora", texto: "Revisar la bitácora de errores de la semana" },
  ] },
  // ---------------- Semana 2: medios y reconocimiento rapido de tecnica ----------------
  { dia: 8, semana: 2, foco: "Búsqueda binaria entera y mochila", tareas: [
    { t: "quiz", n: 5 },
    { t: "problema", slug: "uva-10606" },
    { t: "problema", slug: "uva-12563" },
  ] },
  { dia: 9, semana: 2, foco: "Planificación voraz y caminos", tareas: [
    { t: "quiz", n: 5 },
    { t: "problema", slug: "uva-1153" },
    { t: "problema", slug: "uva-208" },
  ] },
  { dia: 10, semana: 2, foco: "Poda y par más cercano", tareas: [
    { t: "quiz", n: 5 },
    { t: "problema", slug: "uva-193" },
    { t: "problema", slug: "uva-10245" },
  ] },
  { dia: 11, semana: 2, foco: "Conteo con DP e intervalos", tareas: [
    { t: "quiz", n: 5 },
    { t: "problema", slug: "uva-10069" },
    { t: "problema", slug: "uva-10382" },
  ] },
  { dia: 12, semana: 2, foco: "Backtracking con poda y bisección real", tareas: [
    { t: "quiz", n: 5 },
    { t: "problema", slug: "uva-10624" },
    { t: "problema", slug: "uva-1753" },
  ] },
  { dia: 13, semana: 2, foco: "Recurrencias y árboles de expansión", tareas: [
    { t: "quiz", n: 5 },
    { t: "problema", slug: "uva-1350" },
    { t: "problema", slug: "uva-10462" },
  ] },
  { dia: 14, semana: 2, foco: "Máscaras de bits y cierre de semana", tareas: [
    { t: "problema", slug: "uva-10496" },
    { t: "quiz", n: 15 },
    { t: "guia", ruta: "bitacora", texto: "Revisar la bitácora: ¿cuál es tu error más frecuente?" },
  ] },
  // ---------------- Semana 3: dificiles y simulacros cada 2 dias ----------------
  { dia: 15, semana: 3, foco: "Simulacro 1", tareas: [
    { t: "simulacro" },
    { t: "texto", texto: "Anotar en la bitácora cada problema no resuelto del simulacro" },
  ] },
  { dia: 16, semana: 3, foco: "Difíciles: árbol de segmentos y DP de intervalos", tareas: [
    { t: "texto", texto: "Analizar el simulacro 1 (30 min): ¿qué te frenó?" },
    { t: "problema", slug: "uva-11402" },
    { t: "problema", slug: "uva-10688" },
  ] },
  { dia: 17, semana: 3, foco: "Simulacro 2", tareas: [
    { t: "simulacro" },
    { t: "texto", texto: "Anotar en la bitácora cada problema no resuelto del simulacro" },
  ] },
  { dia: 18, semana: 3, foco: "Difíciles: voraz con parseo y backtracking circular", tareas: [
    { t: "texto", texto: "Analizar el simulacro 2 (30 min)" },
    { t: "problema", slug: "uva-11890" },
    { t: "problema", slug: "uva-10001" },
  ] },
  { dia: 19, semana: 3, foco: "Simulacro 3", tareas: [
    { t: "simulacro" },
    { t: "texto", texto: "Anotar en la bitácora cada problema no resuelto del simulacro" },
  ] },
  { dia: 20, semana: 3, foco: "Difícil NP y repaso de plantillas", tareas: [
    { t: "texto", texto: "Analizar el simulacro 3 (30 min)" },
    { t: "problema", slug: "uva-11813" },
    { t: "guia", ruta: "guias/plantillas", texto: "Repasar todas las plantillas y la guía de reconocimiento" },
  ] },
  { dia: 21, semana: 3, foco: "Simulacro final", tareas: [
    { t: "simulacro" },
    { t: "texto", texto: "Cierre: leer tu bitácora completa y tus explicaciones Feynman" },
  ] },
];

window.PLAN_SEMANAS = {
  1: "Semana 1 · Lectura de entrada y fáciles de cada tema",
  2: "Semana 2 · Medios y reconocimiento rápido de técnica",
  3: "Semana 3 · Difíciles y un simulacro de 3 horas cada 2 días",
};
