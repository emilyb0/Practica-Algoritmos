// Web Worker que ejecuta Python con Pyodide.
// Mensajes de entrada:
//   {tipo: "iniciar"}
//   {tipo: "analizar", id, codigo}            -> {id, sintaxis: null|msg, breaks: [lineas]}
//   {tipo: "ejecutar", id, codigo, entrada}   -> {id, salida, error, segundos}
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
importScripts(PYODIDE_URL + "pyodide.js");

const ARNES = `
import ast, io, sys, time, traceback

def _arena_analizar(codigo):
    try:
        arbol = ast.parse(codigo, "solucion.py")
    except SyntaxError as e:
        return {"sintaxis": f"Linea {e.lineno}: {e.msg}", "breaks": []}
    lineas = sorted(n.lineno for n in ast.walk(arbol) if isinstance(n, ast.Break))
    return {"sintaxis": None, "breaks": lineas}

def _arena_ejecutar(codigo, entrada):
    buf = io.BytesIO()
    salida = io.TextIOWrapper(buf, encoding="utf-8", write_through=True)
    viejos = sys.stdin, sys.stdout
    sys.stdin = io.TextIOWrapper(io.BytesIO(entrada.encode("utf-8")), encoding="utf-8")
    sys.stdout = salida
    error = None
    t0 = time.perf_counter()
    try:
        exec(compile(codigo, "solucion.py", "exec"), {"__name__": "__main__"})
    except SystemExit as e:
        if e.code not in (None, 0):
            error = f"SystemExit({e.code})"
    except BaseException as e:
        marcos = [m for m in traceback.extract_tb(e.__traceback__) if m.filename == "solucion.py"]
        detalle = "".join(traceback.format_list(marcos))
        error = (detalle + "".join(traceback.format_exception_only(type(e), e))).strip()
    finally:
        try:
            salida.flush()
        except Exception:
            pass
        sys.stdin, sys.stdout = viejos
    seg = time.perf_counter() - t0
    return {"salida": buf.getvalue().decode("utf-8", "replace"), "error": error, "segundos": seg}
`;

let pyodide = null;
const listo = (async () => {
  pyodide = await loadPyodide({ indexURL: PYODIDE_URL });
  pyodide.runPython(ARNES);
  return true;
})();

function aJS(proxy) {
  const r = proxy.toJs({ dict_converter: Object.fromEntries });
  proxy.destroy();
  return r;
}

self.onmessage = async (ev) => {
  const m = ev.data;
  try {
    await listo;
    if (m.tipo === "iniciar") {
      self.postMessage({ tipo: "listo" });
    } else if (m.tipo === "analizar") {
      const f = pyodide.globals.get("_arena_analizar");
      self.postMessage({ id: m.id, ...aJS(f(m.codigo)) });
      f.destroy();
    } else if (m.tipo === "ejecutar") {
      const f = pyodide.globals.get("_arena_ejecutar");
      self.postMessage({ id: m.id, ...aJS(f(m.codigo, m.entrada)) });
      f.destroy();
    }
  } catch (e) {
    self.postMessage({ id: m.id, tipo: "fallo", error: String(e) });
  }
};
