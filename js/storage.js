// Progreso guardado en localStorage (version 2: sesiones y modulos, sin fechas ni rachas).
window.Store = (() => {
  const CLAVE = "arena-ada:v1";
  const CLAVE_BORRADOR = "arena-ada:borrador:";
  const CLAVE_SESION = "arena-ada:sesion";
  const HUECO_MS = 3 * 3600 * 1000;   // 3 horas sin usar la Arena = sesion nueva
  const PAUSA_MS = 45 * 60 * 1000;    // cerrar y volver a abrir tras 45 minutos = sesion nueva
  const ETAPAS = [1, 2, 4];           // un problema fallado vuelve 1, 2 y 4 sesiones despues

  function vacio() {
    return {
      version: 2,
      problemas: {},   // slug -> {estado, intentos, fallos, pistas, vioSolucion, recuerdo, feynman, resueltoEn, mejorSeg, mejor, rubrica}
      bitacora: [],    // {fecha, sesion, slug, veredicto, causas:[], nota, modo}
      repasos: [],     // {slug, vence (numero de sesion), etapa}
      sesion: { n: 0, ultima: 0 },
      modulos: { bloques: {}, activo: null },  // bloques[id] = {pasos:{}, hecho, seg, nota, recuerdo}; activo = {id, ruta}
      simulacros: [],  // competencias terminadas
      competencia: null,
      ciego: { actual: null, resueltos: [] },
      quiz: { respondidas: 0, aciertos: 0 },
    };
  }

  // Convierte el progreso de la version 1 (plan de 21 dias con fechas) a la version 2.
  function migrar(viejo) {
    const e = Object.assign(vacio(), viejo);
    if ((viejo.version || 1) < 2) {
      e.version = 2;
      const pendientes = [...new Set((viejo.repasos || []).filter((r) => !r.hecho).map((r) => r.slug))];
      e.repasos = pendientes.map((slug) => ({ slug, vence: 1, etapa: 0 }));
      e.simulacros = (viejo.simulacros || []).map((s) => ({ ...s, formato: "v1" }));
      if (viejo.competencia && !viejo.competencia.version) e.competencia = null;
      e.bitacora = (viejo.bitacora || []).map((b) => ({ sesion: 0, ...b }));
      delete e.actividad;
      delete e.plan;
    }
    for (const k of ["modulos", "ciego", "quiz", "sesion"]) e[k] = Object.assign(vacio()[k], e[k]);
    return e;
  }

  let estado;
  try {
    estado = migrar(JSON.parse(localStorage.getItem(CLAVE) || "{}"));
  } catch (err) {
    estado = vacio();
  }

  function guardar() {
    estado.sesion.ultima = Date.now();
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch (err) {
      console.warn("No se pudo guardar el progreso", err);
    }
  }

  // ---------------------------------------------------------------- sesiones
  // Una sesion nueva empieza al abrir la Arena en otra pestana despues de una pausa de 45 minutos,
  // o al volver despues de 3 horas aunque la pestana siguiera abierta.
  let nuevaSesion = false;
  function revisarSesion() {
    let marca = null;
    try { marca = sessionStorage.getItem(CLAVE_SESION); } catch (err) { marca = null; }
    const hueco = Date.now() - (estado.sesion.ultima || 0);
    if (estado.sesion.n === 0 || hueco > HUECO_MS || (marca === null && hueco > PAUSA_MS)) {
      estado.sesion.n++;
      nuevaSesion = true;
      try { sessionStorage.setItem(CLAVE_SESION, String(estado.sesion.n)); } catch (err) { /* sin sessionStorage */ }
      guardar();
      return true;
    }
    try { sessionStorage.setItem(CLAVE_SESION, String(estado.sesion.n)); } catch (err) { /* sin sessionStorage */ }
    return false;
  }
  revisarSesion();

  // ---------------------------------------------------------------- problemas
  function problema(slug) {
    if (!estado.problemas[slug]) {
      estado.problemas[slug] = { estado: "nuevo", intentos: 0, fallos: 0, pistas: 0, vioSolucion: false, recuerdo: "", feynman: "", mejor: null, rubrica: {} };
    }
    const p = estado.problemas[slug];
    if (!p.rubrica) p.rubrica = {};
    return p;
  }

  // Registra un envio completo al juez. res = Rubrica.resumir(...) = {v, pasados, total, ejemplo, lecturaOk}
  function registrarEnvio(slug, res, segundos, modo = "practica") {
    const p = problema(slug);
    p.intentos++;
    p.mejor = Rubrica.mejorEnvio(p.mejor, res);
    if (res.v === "AC") {
      if (p.estado !== "resuelto") p.resueltoEn = new Date().toISOString();
      p.estado = "resuelto";
      if (segundos && (!p.mejorSeg || segundos < p.mejorSeg)) p.mejorSeg = segundos;
      avanzarRepaso(slug);
    } else {
      p.fallos++;
      if (p.estado !== "resuelto") p.estado = "intentado";
      programarRepaso(slug);
    }
    guardar();
  }

  // ---------------------------------------------------------------- repeticion espaciada por sesiones
  function programarRepaso(slug) {
    const r = estado.repasos.find((x) => x.slug === slug);
    if (r) {
      r.etapa = 0;
      r.vence = estado.sesion.n + ETAPAS[0];
    } else {
      estado.repasos.push({ slug, vence: estado.sesion.n + ETAPAS[0], etapa: 0 });
    }
  }

  // Un repaso solo avanza si ya vencio (resolverlo en la misma sesion en que fallaste no cuenta como repaso espaciado).
  function avanzarRepaso(slug) {
    const r = estado.repasos.find((x) => x.slug === slug);
    if (!r || r.vence > estado.sesion.n) return false;
    r.etapa++;
    if (r.etapa >= ETAPAS.length) estado.repasos = estado.repasos.filter((x) => x !== r);
    else r.vence = estado.sesion.n + ETAPAS[r.etapa];
    return true;
  }

  function repasosPendientes() {
    return estado.repasos.filter((r) => r.vence <= estado.sesion.n).sort((a, b) => a.vence - b.vence);
  }

  // bien = true: lo resolviste o lo explicaste de memoria; false: todavia no sale (vuelve en la proxima sesion)
  function calificarRepaso(slug, bien) {
    if (bien) avanzarRepaso(slug);
    else programarRepaso(slug);
    guardar();
  }

  function agregarBitacora(entrada) {
    estado.bitacora.unshift({ fecha: new Date().toISOString(), sesion: estado.sesion.n, ...entrada });
    guardar();
  }

  // ---------------------------------------------------------------- modulos
  function bloque(id) {
    if (!estado.modulos.bloques[id]) estado.modulos.bloques[id] = { pasos: {}, hecho: false, seg: 0, nota: "", recuerdo: "" };
    return estado.modulos.bloques[id];
  }

  function borrador(slug, codigo) {
    try {
      if (codigo === undefined) return localStorage.getItem(CLAVE_BORRADOR + slug);
      localStorage.setItem(CLAVE_BORRADOR + slug, codigo);
    } catch (err) {
      return null;
    }
    return null;
  }

  function exportar() {
    return JSON.stringify(estado, null, 1);
  }

  function importar(texto) {
    estado = migrar(JSON.parse(texto));
    guardar();
  }

  function reiniciarTodo() {
    const n = estado.sesion.n;
    estado = vacio();
    estado.sesion.n = n;
    guardar();
  }

  return {
    get estado() { return estado; },
    get nuevaSesion() { return nuevaSesion; },
    ETAPAS, guardar, revisarSesion, problema, registrarEnvio, programarRepaso, repasosPendientes, calificarRepaso,
    agregarBitacora, bloque, borrador, exportar, importar, reiniciarTodo, migrar,
  };
})();
