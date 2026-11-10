// Rubrica de calificacion de cada problema y nota estimada del examen.
//  4.0 - 5.0  aceptado en el juez; dentro del rango cuentan tecnica, complejidad y codigo limpio.
//  3.0 - 4.0  no aceptado pero bien encaminado: tecnica correcta con un error (tiempo, un caso borde, se acabo el tiempo).
//  2.0 - 3.0  no correcto pero con codigo razonable y comprension del tema.
//  0.0 - 2.0  no muestra comprension del tema; la lectura de datos buena suma, la mala resta.
window.Rubrica = (() => {
  const CHECK_AC = [
    { id: "tecnica", texto: "La técnica es la adecuada para el problema" },
    { id: "complejidad", texto: "La complejidad es razonable para los límites" },
    { id: "limpio", texto: "El código es limpio: main lee, una función resuelve, buenos nombres" },
  ];
  const CHECK_NO = [
    { id: "tecnica", texto: "Usé la técnica adecuada para este problema" },
    { id: "lectura", texto: "Mi programa lee bien toda la entrada" },
    { id: "orden", texto: "El código está organizado: main lee, una función resuelve" },
    { id: "ubica", texto: "Sé qué falla (un caso borde, la eficiencia o me faltó tiempo)" },
  ];
  const NOMBRE_V = {
    AC: "aceptado", WA: "respuesta incorrecta", PE: "error de presentación", RTE: "error en ejecución",
    TLE: "tiempo excedido", CE: "error de sintaxis", BRK: "salida correcta pero con break",
  };

  // m = mejor envio {v, pasados, total, ejemplo, lecturaOk}; ch = checklist marcado por la estudiante.
  // Las casillas de un aceptado empiezan marcadas (el juez ya lo acepto); las de un no aceptado, sin marcar,
  // salvo "lectura", que se sugiere a partir del resultado del juez.
  function marcas(m, ch = {}) {
    if (m && m.v === "AC") {
      return { tecnica: ch.tecnica ?? true, complejidad: ch.complejidad ?? true, limpio: ch.limpio ?? true };
    }
    return { tecnica: !!ch.tecnica, lectura: ch.lectura ?? !!(m && m.lecturaOk), orden: !!ch.orden, ubica: !!ch.ubica };
  }

  function calcular(m, ch = {}) {
    if (!m) {
      return { nota: 0, nivel: 0, rango: "0 – 2.0", porque: ["No enviaste este problema: sin envío no hay nota."] };
    }
    const k = marcas(m, ch);
    const p = m.total ? m.pasados / m.total : 0;
    const casos = `pasa ${m.pasados} de ${m.total} casos`;
    if (m.v === "AC") {
      const n = [k.tecnica, k.complejidad, k.limpio].filter(Boolean).length;
      const porque = ["Aceptado en el juez: la nota parte de 4.0 y sube con la calidad del diseño y del código."];
      if (!k.tecnica) porque.push("Marcaste que la técnica no era la más adecuada.");
      if (!k.complejidad) porque.push("Marcaste que la complejidad no es razonable para los límites.");
      if (!k.limpio) porque.push("Marcaste que el código se puede ordenar mejor.");
      if (n === 3) porque.push("Técnica, complejidad y código cumplen: 5.0.");
      return { nota: 4 + n / 3, nivel: 4, rango: "4.0 – 5.0", porque };
    }
    const encaminado = m.v === "TLE" || m.v === "BRK" || p >= 0.5 || m.ejemplo;
    if (k.tecnica && encaminado) {
      const nota = Math.min(3.9, 3 + 0.6 * p + (k.ubica ? 0.2 : 0) + (k.orden ? 0.1 : 0) + (m.v === "TLE" ? 0.1 : 0) + (m.v === "BRK" ? 0.2 : 0));
      const porque = ["No fue aceptado, pero usaste la técnica adecuada y el programa va bien encaminado."];
      if (m.v === "TLE") porque.push(`Tiempo excedido: la idea funciona y ${casos}; le falta eficiencia.`);
      else if (m.v === "BRK") porque.push("La salida es correcta, pero usa break, que el curso no permite.");
      else porque.push(`${m.ejemplo ? "Pasa el ejemplo y " : ""}${casos}: probablemente falla un caso borde.`);
      if (k.ubica) porque.push("Sabes qué falla: eso indica comprensión.");
      return { nota, nivel: 3, rango: "3.0 – 4.0", porque };
    }
    if (k.tecnica || (p > 0 && k.orden && k.lectura)) {
      const nota = Math.min(2.9, 2 + 0.5 * p + (k.orden ? 0.2 : 0) + (k.lectura ? 0.2 : 0) + (k.ubica ? 0.1 : 0));
      const porque = [k.tecnica
        ? `La técnica es la adecuada, pero el programa todavía no va bien encaminado (${NOMBRE_V[m.v] || m.v}, ${casos}).`
        : `No usaste la técnica del tema, pero el código es razonable y lee bien la entrada (${casos}).`];
      if (k.orden) porque.push("El código está organizado (main + función): buen uso del lenguaje.");
      return { nota, nivel: 2, rango: "2.0 – 3.0", porque };
    }
    const nota = Math.min(1.9, 0.5 + (k.lectura ? 1.0 : 0.2) + (k.orden ? 0.3 : 0));
    const porque = [k.tecnica ? "" : "Todavía no se ve la técnica del tema en la solución.",
      k.lectura ? "La lectura de datos está bien: eso suma." : "La lectura de datos falla: eso resta."].filter(Boolean);
    if (m.v === "CE") porque.push("El código tiene un error de sintaxis y no llegó a ejecutarse.");
    return { nota, nivel: 1, rango: "0 – 2.0", porque };
  }

  // notas: lista con la nota de cada problema; acs: cuantos fueron aceptados.
  // Nota del examen = promedio de los 2 mejores problemas (2 aceptados = 5.0). Cada aceptado adicional es bono.
  function examen(notas, acs) {
    const orden = [...notas].sort((a, b) => b - a);
    const nota = ((orden[0] || 0) + (orden[1] || 0)) / 2;
    return { nota: Math.min(5, nota), bono: Math.max(0, acs - 2), acs };
  }

  // Mejor envio: aceptado gana; si no, el que pasa mas casos; a igualdad, el mas reciente.
  function mejorEnvio(anterior, nuevo) {
    if (!anterior) return nuevo;
    if (anterior.v === "AC") return anterior;
    if (nuevo.v === "AC") return nuevo;
    return nuevo.pasados >= anterior.pasados ? nuevo : anterior;
  }

  // Resume un resultado del juez en {v, pasados, total, ejemplo, lecturaOk}.
  function resumir(r, totalCasos) {
    const casos = r.casos || [];
    const pasados = casos.filter((c) => c.veredicto === "AC").length;
    const ejemplo = casos.some((c) => c.ejemplo) && casos.filter((c) => c.ejemplo).every((c) => c.veredicto === "AC");
    const errLectura = casos.some((c) => c.error && /IndexError|ValueError|EOFError|unpack/.test(c.error));
    return {
      v: r.veredicto, pasados, total: totalCasos, ejemplo,
      lecturaOk: r.veredicto !== "CE" && !errLectura && casos.some((c) => (c.obtenida || "").length > 0),
    };
  }

  const fmt = (x) => (Math.round(x * 10) / 10).toFixed(1);

  return { CHECK_AC, CHECK_NO, marcas, calcular, examen, mejorEnvio, resumir, fmt };
})();
