// Modulos de estudio: bloques de 40 a 60 minutos, sin fechas. El orden es una sugerencia: nada se bloquea.
// Bloque: {id, titulo, min, nucleo, que, terminado, pasos}
//   nucleo: true = parte del plan principal; false = bloque extra (opcional).
// Paso: {id, texto, tipo, ...}
//   manual      casilla que marcas tu
//   ruta        casilla + enlace a una guia (ruta)
//   anim        animacion de la tecnica (se marca sola al llegar al final)
//   recuerdo    texto escrito de memoria (se marca solo con 20 caracteres o mas)
//   problema    se marca solo al ser aceptado (o a mano si cumples el criterio del bloque)
//   quiz        se marca solo al llevar n preguntas del quiz respondidas
//   ciego       se marca solo al tener n problemas a ciegas aceptados
//   simulacro   se marca solo al terminar n simulacros
window.MODULOS = (() => {
  const P = (slug) => ({ id: slug, tipo: "problema", slug });
  const NOMBRE = { dyc: "dividir y conquistar", bt: "backtracking", dp: "programación dinámica", voraz: "voraces" };

  function repaso(tema) {
    return {
      id: `${tema}-1`, titulo: "Repaso de la técnica", min: 40, nucleo: true,
      que: `Mira la animación paso a paso (responde las predicciones antes de avanzar), lee la plantilla y el esqueleto de ${NOMBRE[tema]} y escribe de memoria cuándo usarla.`,
      terminado: "Los 3 pasos marcados.",
      pasos: [
        { id: "anim", tipo: "anim", tema, texto: "Recorre la animación hasta el final respondiendo las predicciones" },
        { id: "plantilla", tipo: "ruta", ruta: `guias/plantillas/${tema}`, texto: "Lee el esqueleto y una plantilla del tema; luego escribe en papel la estructura (main + función) sin mirar" },
        { id: "recuerdo", tipo: "recuerdo", texto: "Sin mirar: ¿cuándo usarías esta técnica y qué complejidad tiene? (2 líneas)" },
      ],
    };
  }
  const faciles = (id, a, b, nucleo = true) => ({
    id, titulo: nucleo ? "Problemas fáciles" : "Más fáciles (extra)", min: 50, nucleo,
    que: "Resuelve los dos problemas. Antes de codificar, escribe el recuerdo activo; al terminar, la explicación Feynman.",
    terminado: "Los 2 aceptados, o 25 minutos de intento en cada uno con la bitácora llena.",
    pasos: [P(a), P(b)],
  });
  const medio = (id, slug, nucleo) => ({
    id, titulo: nucleo ? "Problema medio" : "Otro medio (extra)", min: 50, nucleo,
    que: "Resuelve el problema. Si te atascas 20 minutos, sube un escalón en la escalera de pistas.",
    terminado: "Aceptado, o 50 minutos de intento con la pista 2 leída y la bitácora llena.",
    pasos: [P(slug), { id: "feynman", tipo: "manual", texto: "Explicación Feynman escrita (qué hace la solución y por qué funciona)" }],
  });
  const dificil = (id, slug, nucleo) => ({
    id, titulo: nucleo ? "Problema difícil" : "Otro difícil (extra)", min: 60, nucleo,
    que: "Intenta el problema completo. Usa la escalera de pistas hasta el esqueleto si hace falta; lo importante es entender la idea.",
    terminado: "Aceptado, o 60 minutos de intento llegando al esqueleto y con la bitácora llena.",
    pasos: [P(slug), { id: "feynman", tipo: "manual", texto: "Explicación Feynman escrita" }],
  });

  function tema(t, titulo, f, m, d) {
    const bloques = [repaso(t), faciles(`${t}-2`, f[0], f[1])];
    if (f.length > 2) bloques.push(faciles(`${t}-2x`, f[2], f[3], false));
    bloques.push(medio(`${t}-3`, m[0], true));
    m.slice(1).forEach((s, k) => bloques.push(medio(`${t}-3x${k + 1}`, s, false)));
    bloques.push(dificil(`${t}-4`, d[0], true));
    d.slice(1).forEach((s, k) => bloques.push(dificil(`${t}-4x${k + 1}`, s, false)));
    return { id: t, tema: t, titulo, descripcion: `Repaso corto de la técnica, plantilla, fáciles, medios y difíciles de ${NOMBRE[t]}.`, bloques };
  }

  const simulacro = (n, nucleo) => [
    { id: `sim-${n}`, titulo: `Simulacro ${n}`, min: 140, nucleo,
      que: "Simulacro completo: 4 problemas (uno por tema) en 2 horas 20 minutos, sin pistas. Es el único bloque largo: dura lo mismo que el examen.",
      terminado: "Simulacro terminado (por tiempo o porque lo cierras).",
      pasos: [{ id: "sim", tipo: "simulacro", n, texto: `Terminar el simulacro ${n}` }] },
    { id: `sim-${n}r`, titulo: `Análisis del simulacro ${n}`, min: 40, nucleo,
      que: "Revisa el reporte, completa la autoevaluación de cada problema y vuelve a intentar el que estuvo más cerca de pasar.",
      terminado: "Los 3 pasos marcados.",
      pasos: [
        { id: "reporte", tipo: "ruta", ruta: "competencia", texto: "Revisar el reporte: nota, tiempos, dificultad estimada contra real" },
        { id: "bitacora", tipo: "manual", texto: "Llenar la bitácora de cada problema fallado" },
        { id: "reintento", tipo: "manual", texto: "Reintentar en práctica (con pistas) el problema que más cerca estuvo" },
      ] },
  ];

  return [
    { id: "m0", titulo: "Lectura de entrada y formato de salida", descripcion: "Los patrones para leer la entrada y escribir la salida exacta. Un error aquí cuesta un problema entero.",
      bloques: [
        { id: "m0-1", titulo: "Patrones de lectura", min: 40, nucleo: true,
          que: "Lee los 7 patrones de lectura, escribe dos de memoria y resuelve un problema que termina en 0.",
          terminado: "Los 3 pasos marcados.",
          pasos: [
            { id: "guia", tipo: "ruta", ruta: "guias/lectura", texto: "Leer la guía «Lectura de entrada» (7 patrones)" },
            { id: "memoria", tipo: "manual", texto: "Sin mirar, escribir los patrones «hasta EOF» y «termina en 0» y compararlos con la guía" },
            P("uva-11332"),
          ] },
        { id: "m0-2", titulo: "Formato de salida", min: 40, nucleo: true,
          que: "Repasa los errores típicos de formato y resuelve un problema con T casos.",
          terminado: "Los 3 pasos marcados.",
          pasos: [
            { id: "errores", tipo: "ruta", ruta: "guias/lectura", texto: "Leer los errores típicos (formato «Case X:», líneas en blanco entre casos)" },
            P("uva-13190"),
            { id: "propia", tipo: "manual", texto: "Probar tu solución con «Mi propia entrada» usando un caso borde inventado por ti" },
          ] },
      ] },
    tema("dyc", "Dividir y conquistar", ["uva-12097", "uva-11876"], ["uva-1753", "uva-10606", "uva-10245"], ["uva-11402"]),
    tema("bt", "Backtracking", ["uva-10344", "uva-10776", "uva-10576", "uva-574"], ["uva-208", "uva-10624", "uva-193"], ["uva-10001"]),
    tema("dp", "Programación dinámica", ["uva-10912", "uva-10259"], ["uva-12563", "uva-10069", "uva-1350", "uva-10496"], ["uva-10688", "uva-11813"]),
    tema("voraz", "Algoritmos voraces", ["uva-12834", "uva-11240"], ["uva-10382", "uva-1153", "uva-10462"], ["uva-11890"]),
    { id: "rec", titulo: "Reconocimiento de técnica", descripcion: "Problemas mezclados sin ver el tema: practicar la parte más difícil del examen, saber qué técnica usar.",
      bloques: [
        { id: "rec-1", titulo: "Reconocer la técnica", min: 40, nucleo: true,
          que: "Lee las guías de reconocimiento y de dificultad, y haz el quiz con problemas mezclados.",
          terminado: "Los 3 pasos marcados (el quiz se marca solo al llegar a 15 respuestas).",
          pasos: [
            { id: "guia", tipo: "ruta", ruta: "guias/reconocer", texto: "Leer «Reconocer la técnica»" },
            { id: "dificultad", tipo: "ruta", ruta: "guias/dificultad", texto: "Leer «¿Fácil o difícil?»: las señales para ordenar los problemas en el examen" },
            { id: "quiz", tipo: "quiz", n: 15, texto: "Responder 15 preguntas del quiz de reconocimiento" },
          ] },
        { id: "rec-2", titulo: "Práctica a ciegas", min: 60, nucleo: true,
          que: "La Arena elige problemas sin mostrar el tema ni la dificultad. Decide tú la técnica.",
          terminado: "2 problemas a ciegas aceptados, o 30 minutos de intento en cada uno.",
          pasos: [
            { id: "c1", tipo: "ciego", n: 1, texto: "Primer problema a ciegas aceptado" },
            { id: "c2", tipo: "ciego", n: 2, texto: "Segundo problema a ciegas aceptado" },
          ] },
        { id: "rec-3", titulo: "Otra ronda a ciegas (extra)", min: 60, nucleo: false,
          que: "Dos problemas más sin ver el tema.",
          terminado: "2 problemas más aceptados a ciegas.",
          pasos: [
            { id: "c3", tipo: "ciego", n: 3, texto: "Tercer problema a ciegas aceptado" },
            { id: "c4", tipo: "ciego", n: 4, texto: "Cuarto problema a ciegas aceptado" },
          ] },
      ] },
    { id: "sim", titulo: "Simulacros completos", descripcion: "Exámenes completos de 2:20 con la calificación real (2 aceptados = 5.0) y un reporte al final.",
      bloques: [...simulacro(1, true), ...simulacro(2, false), ...simulacro(3, false)] },
  ];
})();
