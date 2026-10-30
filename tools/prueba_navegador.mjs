// Prueba de punta a punta de la Arena en Chrome sin interfaz (headless) usando el protocolo DevTools.
// Uso: node tools/prueba_navegador.mjs [ruta-a-chrome]
// Requiere Node 22+ (WebSocket nativo) y que la Arena este corriendo: python arena.py --no-abrir
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = process.argv[2] || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL_ARENA = process.env.ARENA_URL || "http://127.0.0.1:8000/";
const PUERTO = 9333;
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

const perfil = mkdtempSync(join(tmpdir(), "arena-chrome-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${PUERTO}`, `--user-data-dir=${perfil}`,
  "--no-first-run", "--window-size=1400,1000", "about:blank"], { stdio: "ignore" });

let ws, sig = 1;
const espera = new Map();
function cdp(method, params = {}) {
  const id = sig++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res, rej) => espera.set(id, { res, rej }));
}
async function evaluar(expr) {
  const r = await cdp("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 800));
  return r.result.value;
}
async function hasta(expr, ms = 120000) {
  const t0 = Date.now();
  let v = await evaluar(expr);
  while (!v && Date.now() - t0 < ms) { await dormir(300); v = await evaluar(expr); }
  if (!v) throw new Error("Tiempo agotado esperando: " + expr);
  return v;
}

let fallas = 0;
function revisar(nombre, ok, detalle = "") {
  console.log(`${ok ? "OK   " : "FALLA"} ${nombre}${detalle ? " -> " + detalle : ""}`);
  if (!ok) fallas++;
}

try {
  let paginas = null;
  for (let k = 0; k < 50 && !paginas; k++) {
    try { paginas = await (await fetch(`http://127.0.0.1:${PUERTO}/json/list`)).json(); } catch { await dormir(200); }
  }
  ws = new WebSocket(paginas.find((p) => p.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => { ws.onopen = r; });
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && espera.has(m.id)) { espera.get(m.id)[m.error ? "rej" : "res"](m.error || m.result); espera.delete(m.id); }
  };
  await cdp("Runtime.enable");
  await cdp("Page.enable");
  await cdp("Page.navigate", { url: URL_ARENA + "#/inicio" });
  await hasta("!!window.Juez && !!window.ARENA_DATA && document.querySelector('.tiles') !== null");
  revisar("la pagina carga (inicio)", true);

  // ---- 1) Juez directo: correcto, incorrecto, break, sintaxis, tiempo excedido
  console.log("Cargando Pyodide…");
  await evaluar("Juez.preparar()");
  const casosJS = "ARENA_DATA.arena.find(p => p.slug === 'uva-11332').casos";
  const correcto = `import sys

def g(n):
    while n >= 10:
        n = sum(int(c) for c in str(n))
    return n

data = sys.stdin.read().split()
i = 0
while i < len(data) and data[i] != "0":
    print(g(int(data[i])))
    i += 1
`;
  const incorrecto = correcto.replace("while n >= 10:", "if n >= 10:");
  const conBreak = `import sys
for tok in sys.stdin.read().split():
    if tok == "0":
        break
    n = int(tok)
    print(1 + (n - 1) % 9)
`;
  const sintaxis = "def f(:\n    pass\n";
  const infinito = "while True:\n    pass\n";
  const juzgar = (codigo, limite = 10) =>
    evaluar(`Juez.juzgar(${JSON.stringify(codigo)}, ${casosJS}, {limite: ${limite}}).then(r => ({v: r.veredicto, b: r.breaks, casos: r.casos.map(c => c.veredicto)}))`);

  let r = await juzgar(correcto);
  revisar("solucion correcta -> Correcto (AC)", r.v === "AC", JSON.stringify(r));
  r = await juzgar(incorrecto);
  revisar("solucion incorrecta -> Respuesta incorrecta (WA)", r.v === "WA", JSON.stringify(r));
  r = await juzgar(conBreak);
  revisar("solucion con break -> aviso de break (BRK) y lineas detectadas", r.v === "BRK" && r.b.length === 1 && r.b[0] === 4, JSON.stringify(r));
  r = await juzgar(sintaxis);
  revisar("error de sintaxis -> CE", r.v === "CE", JSON.stringify(r));
  r = await evaluar(`Juez.juzgar(${JSON.stringify(infinito)}, ${casosJS}.slice(0, 1), {limite: 2}).then(r => r.veredicto)`);
  revisar("ciclo infinito -> Tiempo excedido (TLE)", r === "TLE", r);

  // ---- 2) Todas las soluciones de referencia pasan en el navegador
  const resumen = await evaluar(`(async () => {
    const out = [];
    for (const p of ARENA_DATA.arena) {
      const t0 = performance.now();
      const r = await Juez.juzgar(p.solucion, p.casos, {limite: p.limite, comparador: p.comparador});
      out.push({slug: p.slug, v: r.veredicto, seg: (performance.now() - t0) / 1000, casos: r.casos.map(c => c.veredicto + ':' + c.segundos.toFixed(2))});
    }
    return out;
  })()`);
  for (const x of resumen) {
    revisar(`referencia ${x.slug} en Pyodide (${x.seg.toFixed(1)} s)`, x.v === "AC", x.v === "AC" ? "" : x.casos.join(" "));
  }

  // ---- 3) Plantillas y esqueletos sin break
  const breaks = await evaluar(`(async () => {
    const codigos = [...GUIAS.lectura.patrones.map(x => ['lectura: ' + x.nombre, x.codigo]),
      ...GUIAS.plantillas.temas.flatMap(t => t.items.map(x => ['plantilla: ' + x.nombre, x.codigo])),
      ...ARENA_DATA.arena.map(p => ['esqueleto ' + p.slug, p.esqueleto])];
    const malos = [];
    for (const [n, c] of codigos) {
      const a = await Juez.analizar(c);
      if (a.sintaxis || a.breaks.length) malos.push(n + ' ' + (a.sintaxis || 'break en ' + a.breaks));
    }
    return {total: codigos.length, malos};
  })()`);
  revisar(`${breaks.total} plantillas/esqueletos compilan y no usan break`, breaks.malos.length === 0, breaks.malos.join("; "));

  // ---- 4) Flujo de la interfaz: problema, recuerdo activo, editor y envio
  await cdp("Page.navigate", { url: URL_ARENA + "#/problema/uva-11332" });
  await hasta("document.querySelector('.CodeMirror') !== null");
  const bloqueado = await evaluar("document.querySelector('#b-enviar').disabled");
  revisar("el editor arranca bloqueado hasta escribir el recuerdo activo", bloqueado === true);
  await evaluar(`(() => { const t = document.querySelector('#recuerdo'); t.value = 'Simulacion con ciclo while: sumo digitos hasta que quede uno.'; t.dispatchEvent(new Event('input')); })()`);
  revisar("el recuerdo activo desbloquea el editor", (await evaluar("document.querySelector('#b-enviar').disabled")) === false);

  await evaluar(`document.querySelector('.CodeMirror').CodeMirror.setValue(${JSON.stringify(incorrecto)})`);
  await evaluar("document.querySelector('#b-enviar').click()");
  await hasta("document.querySelector('#veredicto .v-titulo') && !document.querySelector('.veredicto.corriendo')");
  const vMal = await evaluar("document.querySelector('#veredicto .v-titulo').textContent");
  revisar("UI: envio incorrecto muestra 'Respuesta incorrecta'", vMal.includes("Respuesta incorrecta"), vMal);
  revisar("UI: aparece el formulario de bitacora", await evaluar("!!document.querySelector('#guardar-bitacora')"));
  await evaluar(`(() => { document.querySelector('.causas input[value=tecnica]').checked = true; document.querySelector('#nota-bitacora').value = 'Use if en vez de while'; document.querySelector('#guardar-bitacora').click(); })()`);
  const bit = await evaluar("Store.estado.bitacora.length");
  const rep = await evaluar("Store.estado.repasos.filter(r => r.slug === 'uva-11332').map(r => r.fecha)");
  revisar("UI: la bitacora guarda el error y programa repasos a 1, 3 y 7 dias", bit === 1 && rep.length === 3, JSON.stringify(rep));
  writeFileSync(join(tmpdir(), "arena-wa.png"), Buffer.from((await cdp("Page.captureScreenshot")).data, "base64"));

  await evaluar(`document.querySelector('.CodeMirror').CodeMirror.setValue(${JSON.stringify(correcto)})`);
  await evaluar("document.querySelector('#b-enviar').click()");
  await hasta("document.querySelector('#veredicto .v-titulo') && !document.querySelector('.veredicto.corriendo')");
  const vBien = await evaluar("document.querySelector('#veredicto .v-titulo').textContent");
  revisar("UI: envio correcto muestra 'Correcto'", vBien.includes("Correcto"), vBien);
  revisar("UI: el progreso marca el problema como resuelto", (await evaluar("Store.estado.problemas['uva-11332'].estado")) === "resuelto");
  writeFileSync(join(tmpdir(), "arena-ac.png"), Buffer.from((await cdp("Page.captureScreenshot")).data, "base64"));

  await evaluar(`document.querySelector('.CodeMirror').CodeMirror.setValue(${JSON.stringify(conBreak)})`);
  await evaluar("document.querySelector('#b-enviar').click()");
  await hasta("document.querySelector('#veredicto .v-titulo') && !document.querySelector('.veredicto.corriendo')");
  const vBrk = await evaluar("document.querySelector('#veredicto').textContent");
  revisar("UI: con break avisa y no cuenta como resuelto", vBrk.includes("break") && vBrk.includes("línea(s) 4"), vBrk.slice(0, 120));

  // ---- 5) Competencia: 5 problemas, uno por tema
  await cdp("Page.navigate", { url: URL_ARENA + "#/competencia" });
  await hasta("!!document.querySelector('#empezar')");
  await evaluar("document.querySelector('#empezar').click()");
  await hasta("!!document.querySelector('#reloj')");
  const comp = await evaluar("Store.estado.competencia.problemas.map(x => ARENA_DATA.arena.find(p => p.slug === x.slug).tema).sort().join(',')");
  revisar("competencia: 5 problemas, uno por tema", comp === "bt,dp,dyc,np,voraz", comp);
  writeFileSync(join(tmpdir(), "arena-comp.png"), Buffer.from((await cdp("Page.captureScreenshot")).data, "base64"));

  // ---- 6) Resto de vistas cargan sin errores
  for (const ruta of ["plan", "practica", "bitacora", "guias/reconocer", "guias/lectura", "guias/plantillas", "guias/quiz", "progreso", "inicio"]) {
    await cdp("Page.navigate", { url: URL_ARENA + "#/" + ruta });
    await dormir(400);
    const h1 = await evaluar("(document.querySelector('#vista h1') || {}).textContent || ''");
    revisar(`vista #/${ruta}`, h1.length > 0, h1);
  }
  await cdp("Page.navigate", { url: URL_ARENA + "#/plan" });
  await dormir(500);
  writeFileSync(join(tmpdir(), "arena-plan.png"), Buffer.from((await cdp("Page.captureScreenshot", { captureBeyondViewport: false })).data, "base64"));
} catch (e) {
  console.error("ERROR:", e.message);
  fallas++;
} finally {
  console.log(fallas ? `\n${fallas} falla(s)` : "\nTODO OK");
  try { ws.close(); } catch {}
  chrome.kill();
  process.exit(fallas ? 1 : 0);
}
