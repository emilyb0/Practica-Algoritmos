// Progreso guardado en localStorage.
window.Store = (() => {
  const CLAVE = "arena-ada:v1";
  const CLAVE_BORRADOR = "arena-ada:borrador:";

  function vacio() {
    return {
      problemas: {},      // slug -> {estado, intentos, resueltoEn, mejorSeg, pistas, vioSolucion, recuerdo, feynman}
      actividad: {},      // "AAAA-MM-DD" -> numero de acciones
      bitacora: [],       // {fecha, slug, veredicto, causas:[], nota, modo}
      repasos: [],        // {slug, fecha, hecho}
      simulacros: [],     // {inicio, fin, problemas:[{slug, resuelto, intentos, minuto}], resueltos, penalizacion}
      plan: { inicio: null, hecho: {} },  // hecho["d3:t1"] = true
      competencia: null,  // competencia en curso
    };
  }

  let estado;
  try {
    estado = Object.assign(vacio(), JSON.parse(localStorage.getItem(CLAVE) || "{}"));
  } catch (e) {
    estado = vacio();
  }

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch (e) {
      console.warn("No se pudo guardar el progreso", e);
    }
  }

  function hoy(d = new Date()) {
    const z = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  }

  function sumarDias(fecha, n) {
    const [a, m, d] = fecha.split("-").map(Number);
    return hoy(new Date(a, m - 1, d + n));
  }

  function diasEntre(a, b) {
    const f = (s) => { const [x, y, z] = s.split("-").map(Number); return new Date(x, y - 1, z); };
    return Math.round((f(b) - f(a)) / 86400000);
  }

  function marcarActividad() {
    const h = hoy();
    estado.actividad[h] = (estado.actividad[h] || 0) + 1;
  }

  function problema(slug) {
    if (!estado.problemas[slug]) {
      estado.problemas[slug] = { estado: "nuevo", intentos: 0, fallos: 0, pistas: 0, vioSolucion: false, recuerdo: "", feynman: "" };
    }
    return estado.problemas[slug];
  }

  // Registra un envio completo al juez.
  function registrarEnvio(slug, veredicto, segundos) {
    const p = problema(slug);
    p.intentos++;
    if (veredicto === "AC") {
      if (p.estado !== "resuelto") p.resueltoEn = new Date().toISOString();
      p.estado = "resuelto";
      if (segundos && (!p.mejorSeg || segundos < p.mejorSeg)) p.mejorSeg = segundos;
    } else {
      p.fallos++;
      if (p.estado !== "resuelto") p.estado = "intentado";
      programarRepasos(slug);
    }
    marcarActividad();
    guardar();
  }

  // Repeticion espaciada: volver a un problema fallado a los 1, 3 y 7 dias.
  function programarRepasos(slug) {
    const base = hoy();
    const yaHay = estado.repasos.some((r) => r.slug === slug && !r.hecho && r.creado === base);
    if (!yaHay) {
      for (const d of [1, 3, 7]) estado.repasos.push({ slug, fecha: sumarDias(base, d), hecho: false, creado: base });
    }
  }

  function repasosPendientes(fecha = hoy()) {
    // un problema aparece una sola vez aunque tenga varios repasos vencidos
    const vistos = new Set();
    return estado.repasos.filter((r) => !r.hecho && r.fecha <= fecha && !vistos.has(r.slug) && vistos.add(r.slug));
  }

  function completarRepaso(slug) {
    const h = hoy();
    estado.repasos.forEach((r) => { if (r.slug === slug && !r.hecho && r.fecha <= h) r.hecho = true; });
    marcarActividad();
    guardar();
  }

  function agregarBitacora(entrada) {
    estado.bitacora.unshift({ fecha: new Date().toISOString(), ...entrada });
    guardar();
  }

  function racha() {
    let n = 0;
    let d = hoy();
    if (!estado.actividad[d]) d = sumarDias(d, -1);  // la racha sigue viva si hoy aun no practicas
    while (estado.actividad[d]) {
      n++;
      d = sumarDias(d, -1);
    }
    return n;
  }

  function borrador(slug, codigo) {
    try {
      if (codigo === undefined) return localStorage.getItem(CLAVE_BORRADOR + slug);
      localStorage.setItem(CLAVE_BORRADOR + slug, codigo);
    } catch (e) {
      return null;
    }
    return null;
  }

  function exportar() {
    return JSON.stringify(estado, null, 1);
  }

  function importar(texto) {
    estado = Object.assign(vacio(), JSON.parse(texto));
    guardar();
  }

  function reiniciarTodo() {
    estado = vacio();
    guardar();
  }

  return {
    get estado() { return estado; },
    guardar, hoy, sumarDias, diasEntre, marcarActividad, problema, registrarEnvio,
    repasosPendientes, completarRepaso, agregarBitacora, racha, borrador, exportar, importar, reiniciarTodo,
  };
})();
