// Juez local: ejecuta codigo Python en un Web Worker (Pyodide) y compara salidas.
window.Juez = (() => {
  let worker = null;
  let listoPromesa = null;
  let siguienteId = 1;
  const pendientes = new Map();

  function crearWorker() {
    worker = new Worker("js/pyworker.js");
    listoPromesa = new Promise((resolve, reject) => {
      worker.onmessage = (ev) => {
        const m = ev.data;
        if (m.tipo === "listo") {
          worker.onmessage = recibir;
          resolve();
        } else if (m.tipo === "fallo") {
          reject(new Error(m.error));
        }
      };
      worker.onerror = (e) => reject(new Error("No se pudo cargar Pyodide: " + (e.message || "revisa tu conexion a internet")));
    });
    worker.postMessage({ tipo: "iniciar" });
    return listoPromesa;
  }

  function recibir(ev) {
    const m = ev.data;
    const p = pendientes.get(m.id);
    if (p) {
      pendientes.delete(m.id);
      clearTimeout(p.timer);
      m.tipo === "fallo" ? p.reject(new Error(m.error)) : p.resolve(m);
    }
  }

  function preparar() {
    return listoPromesa || crearWorker();
  }

  function reiniciar() {
    if (worker) worker.terminate();
    for (const p of pendientes.values()) {
      clearTimeout(p.timer);
      p.reject(new Error("reiniciado"));
    }
    pendientes.clear();
    worker = null;
    listoPromesa = null;
    return crearWorker();
  }

  async function pedir(msg, limiteSeg) {
    await preparar();
    const id = siguienteId++;
    return new Promise((resolve, reject) => {
      const p = { resolve, reject, timer: null };
      if (limiteSeg) {
        p.timer = setTimeout(() => {
          pendientes.delete(id);
          resolve({ id, tle: true });
          reiniciar();
        }, limiteSeg * 1000);
      }
      pendientes.set(id, p);
      worker.postMessage({ ...msg, id });
    });
  }

  // ---------- comparacion de salidas ----------
  function normalizar(s) {
    return s.replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");
  }

  function comparar(obtenida, esperada, comparador) {
    if (obtenida === esperada) return "AC";
    if (comparador && comparador.startsWith("tolerancia")) {
      const eps = parseFloat(comparador.split(":")[1] || "1e-6");
      const a = obtenida.trim().split(/\s+/), b = esperada.trim().split(/\s+/);
      if (a.length === b.length && a.every((x, i) => {
        const nx = Number(x), ny = Number(b[i]);
        return x === b[i] || (!isNaN(nx) && !isNaN(ny) && x !== "" && Math.abs(nx - ny) <= eps + 1e-9);
      })) return "AC";
    }
    if (normalizar(obtenida) === normalizar(esperada)) return "PE";
    return "WA";
  }

  function primeraDiferencia(a, b) {
    const la = a.split("\n"), lb = b.split("\n");
    const n = Math.max(la.length, lb.length);
    let i = 0;
    while (i < n && la[i] === lb[i]) i++;
    return i < n ? i + 1 : null;
  }

  const NOMBRES = {
    AC: "Correcto", WA: "Respuesta incorrecta", PE: "Error de presentacion",
    RTE: "Error en ejecucion", TLE: "Tiempo excedido", CE: "Error de sintaxis",
    BRK: "Usa break (no permitido en el curso)",
  };

  async function analizar(codigo) {
    return pedir({ tipo: "analizar", codigo });
  }

  async function ejecutar(codigo, entrada, limiteSeg) {
    const r = await pedir({ tipo: "ejecutar", codigo, entrada }, limiteSeg);
    return r.tle ? { tle: true, salida: "", error: null, segundos: limiteSeg } : r;
  }

  // Corre el codigo contra una lista de casos. onCaso(i, resultado) se llama tras cada caso.
  async function juzgar(codigo, casos, opciones = {}) {
    const { limite = 10, comparador = "exacto", onCaso = () => {} } = opciones;
    const analisis = await analizar(codigo);
    if (analisis.sintaxis) {
      return { veredicto: "CE", detalle: analisis.sintaxis, breaks: [], casos: [] };
    }
    const resultados = [];
    for (let i = 0; i < casos.length; i++) {
      const c = casos[i];
      const r = await ejecutar(codigo, c.entrada, limite);
      let v;
      if (r.tle) v = "TLE";
      else if (r.error) v = "RTE";
      else v = comparar(r.salida, c.salida, comparador);
      const res = {
        nombre: c.nombre, ejemplo: c.ejemplo, veredicto: v, segundos: r.segundos,
        entrada: c.entrada, esperada: c.salida, obtenida: r.salida, error: r.error,
        linea: v === "WA" ? primeraDiferencia(r.salida, c.salida) : null,
      };
      resultados.push(res);
      onCaso(i, res);
    }
    const malo = resultados.find((r) => r.veredicto !== "AC");
    let veredicto = malo ? malo.veredicto : "AC";
    if (veredicto === "AC" && analisis.breaks.length) veredicto = "BRK";
    return { veredicto, breaks: analisis.breaks, casos: resultados };
  }

  return { preparar, reiniciar, analizar, ejecutar, juzgar, comparar, NOMBRES };
})();
