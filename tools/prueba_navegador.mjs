// Prueba de punta a punta de la Arena en Chrome sin interfaz (headless) usando el protocolo DevTools.
// Uso: node tools/prueba_navegador.mjs [ruta-a-chrome]
// Requiere Node 22+ (WebSocket nativo) y que la Arena este corriendo: python arena.py --no-abrir
// Las capturas quedan en la carpeta temporal del sistema (arena-*.png).
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
const excepciones = [];
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
  while (!v && Date.now() - t0 < ms) { await dormir(250); v = await evaluar(expr); }
  if (!v) throw new Error("Tiempo agotado esperando: " + expr);
  return v;
}
async function ir(ruta) {
  await evaluar(`location.hash = ${JSON.stringify("#/" + ruta)}`);
  await dormir(350);
}
async function captura(nombre) {
  writeFileSync(join(tmpdir(), `arena-${nombre}.png`), Buffer.from((await cdp("Page.captureScreenshot")).data, "base64"));
}
async function recargar() {
  await cdp("Page.reload");
  await dormir(500);
  await hasta("!!window.App && !!document.querySelector('#vista').children.length");
}

let fallas = 0;
function revisar(nombre, ok, detalle = "") {
  console.log(`${ok ? "OK   " : "FALLA"} ${nombre}${detalle ? " -> " + detalle : ""}`);
  if (!ok) fallas++;
}

const SOL_11332 = `import sys

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

// Envia un codigo desde la vista de problema abierta y espera el veredicto.
async function enviarCodigo(codigo) {
  await hasta("!!document.querySelector('.CodeMirror')");
  await evaluar(`(() => { const t = document.querySelector('#recuerdo'); if (t.value.trim().length < 20) { t.value = 'Tecnica elegida y por que: lo leo en el enunciado.'; t.dispatchEvent(new Event('input')); } })()`);
  await evaluar(`document.querySelector('.CodeMirror').CodeMirror.setValue(${JSON.stringify(codigo)})`);
  await evaluar("document.querySelector('#b-enviar').click()");
  await hasta("document.querySelector('#veredicto .v-titulo') && !document.querySelector('.veredicto.corriendo')", 180000);
  return evaluar("document.querySelector('#veredicto .v-titulo').textContent");
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
    if (m.method === "Runtime.exceptionThrown") excepciones.push(JSON.stringify(m.params.exceptionDetails).slice(0, 400));
  };
  await cdp("Runtime.enable");
  await cdp("Page.enable");
  await cdp("Page.navigate", { url: URL_ARENA + "#/inicio" });
  await hasta("!!window.Juez && !!window.App && document.querySelector('.hero') !== null");
  revisar("la pagina carga (inicio)", true);
  await evaluar("window.confirm = () => true; window.alert = () => {}");
  await captura("inicio");

  // ---- 0) datos: 4 temas del examen, sin NP en la competencia
  const temas = await evaluar("[...new Set(ARENA_DATA.arena.map(p => p.tema))].sort().join(',')");
  revisar("los problemas con juez son de los 4 temas + repaso", temas === "bt,dp,dyc,repaso,voraz", temas);
  const conteo = await evaluar(`(() => { const r = {}; for (const p of ARENA_DATA.arena) { const k = p.tema + ':' + p.dificultad; r[k] = (r[k] || 0) + 1; } return r; })()`);
  const faltan = ["dyc", "bt", "dp", "voraz"].flatMap((t) => ["facil", "medio", "dificil"].filter((d) => (conteo[`${t}:${d}`] || 0) < 2).map((d) => `${t}:${d}`));
  revisar("cada tema tiene al menos 2 problemas fáciles, medios y difíciles", faltan.length === 0, faltan.join(" ") || JSON.stringify(conteo));

  // ---- 1) Juez directo: correcto, incorrecto, break, sintaxis, tiempo excedido
  console.log("Cargando Pyodide…");
  await evaluar("Juez.preparar()");
  const casosJS = "ARENA_DATA.arena.find(p => p.slug === 'uva-11332').casos";
  const incorrecto = SOL_11332.replace("while n >= 10:", "if n >= 10:");
  const conBreak = `import sys
for tok in sys.stdin.read().split():
    if tok == "0":
        break
    n = int(tok)
    print(1 + (n - 1) % 9)
`;
  const juzgar = (codigo, limite = 10) =>
    evaluar(`Juez.juzgar(${JSON.stringify(codigo)}, ${casosJS}, {limite: ${limite}}).then(r => ({v: r.veredicto, b: r.breaks}))`);
  let r = await juzgar(SOL_11332);
  revisar("juez: solucion correcta -> AC", r.v === "AC", JSON.stringify(r));
  r = await juzgar(incorrecto);
  revisar("juez: solucion incorrecta -> WA", r.v === "WA", JSON.stringify(r));
  r = await juzgar(conBreak);
  revisar("juez: con break -> BRK y linea 4", r.v === "BRK" && r.b.length === 1 && r.b[0] === 4, JSON.stringify(r));
  r = await juzgar("def f(:\n    pass\n");
  revisar("juez: error de sintaxis -> CE", r.v === "CE", JSON.stringify(r));
  r = await evaluar(`Juez.juzgar("while True:\\n    pass\\n", ${casosJS}.slice(0, 1), {limite: 2}).then(r => r.veredicto)`);
  revisar("juez: ciclo infinito -> TLE", r === "TLE", r);

  // ---- 2) Todas las soluciones de referencia pasan en el navegador
  const resumen = await evaluar(`(async () => {
    const out = [];
    for (const p of ARENA_DATA.arena) {
      const t0 = performance.now();
      const r = await Juez.juzgar(p.solucion, p.casos, {limite: p.limite, comparador: p.comparador});
      out.push({slug: p.slug, v: r.veredicto, seg: (performance.now() - t0) / 1000, casos: r.casos.map(c => c.veredicto)});
    }
    return out;
  })()`);
  const malas = resumen.filter((x) => x.v !== "AC");
  revisar(`las ${resumen.length} soluciones de referencia son aceptadas en Pyodide (la más lenta: ${Math.max(...resumen.map((x) => x.seg)).toFixed(1)} s)`,
    malas.length === 0, malas.map((x) => `${x.slug}:${x.v}`).join(" "));

  // ---- 3) Plantillas, esqueletos de tecnica y esqueletos de problemas sin break
  const breaks = await evaluar(`(async () => {
    const codigos = [...GUIAS.lectura.patrones.map(x => ['lectura: ' + x.nombre, x.codigo]),
      ...GUIAS.plantillas.temas.flatMap(t => t.items.map(x => ['plantilla: ' + x.nombre, x.codigo])),
      ...ARENA_DATA.arena.map(p => ['esqueleto ' + p.slug, p.esqueleto])];
    const malos = [];
    for (const [n, c] of codigos) {
      const a = await Juez.analizar(c);
      if (a.sintaxis || a.breaks.length) malos.push(n + ' ' + (a.sintaxis || 'break en ' + a.breaks));
    }
    return {total: codigos.length, esq: GUIAS.plantillas.temas.filter(t => t.items[0].esqueleto).length, malos};
  })()`);
  revisar(`${breaks.total} plantillas y esqueletos compilan y no usan break`, breaks.malos.length === 0, breaks.malos.join("; "));
  revisar("cada uno de los 4 temas abre con su esqueleto de técnica", breaks.esq === 4, String(breaks.esq));

  // ---- 4) Practica: recuerdo activo, envio incorrecto, bitacora, rubrica, envio correcto, break
  const sesion0 = await evaluar("Store.estado.sesion.n");
  await ir("problema/uva-11332");
  await hasta("document.querySelector('.CodeMirror') !== null");
  revisar("el editor arranca bloqueado hasta escribir el recuerdo activo", (await evaluar("document.querySelector('#b-enviar').disabled")) === true);
  let v = await enviarCodigo(incorrecto);
  revisar("practica: envio incorrecto muestra 'Respuesta incorrecta'", v.includes("Respuesta incorrecta"), v);
  revisar("practica: aparece la rubrica con nota estimada", await evaluar("!!document.querySelector('#rubrica .nota-grande')"));
  revisar("practica: aparece el formulario de bitacora", await evaluar("!!document.querySelector('#guardar-bitacora')"));
  await evaluar(`(() => { document.querySelector('.causas input[value=tecnica]').checked = true; document.querySelector('#nota-bitacora').value = 'Use if en vez de while'; document.querySelector('#guardar-bitacora').click(); })()`);
  const rep = await evaluar("JSON.stringify(Store.estado.repasos.filter(r => r.slug === 'uva-11332'))");
  revisar("practica: el fallo queda en la bitacora y programa un repaso para la siguiente sesion",
    (await evaluar("Store.estado.bitacora.length")) === 1 && rep === JSON.stringify([{ slug: "uva-11332", vence: sesion0 + 1, etapa: 0 }]), rep);
  await captura("wa");
  v = await enviarCodigo(SOL_11332);
  revisar("practica: envio correcto muestra 'Correcto'", v.includes("Correcto"), v);
  revisar("practica: el problema queda resuelto", (await evaluar("Store.estado.problemas['uva-11332'].estado")) === "resuelto");
  const nota = await evaluar("document.querySelector('#rubrica .nota-grande').textContent");
  revisar("practica: aceptado -> rubrica 5.0 (casillas de calidad marcadas)", nota.startsWith("5.0"), nota);
  await evaluar("document.querySelector('#rubrica [data-check=limpio]').click()");
  const nota2 = await evaluar("document.querySelector('#rubrica .nota-grande').textContent");
  revisar("practica: desmarcar 'codigo limpio' baja la nota dentro de 4.0-5.0", nota2.startsWith("4.7"), nota2);
  await captura("ac");
  v = await enviarCodigo(conBreak);
  const vBrk = await evaluar("document.querySelector('#veredicto').textContent");
  revisar("practica: con break avisa en la linea 4", vBrk.includes("break") && vBrk.includes("línea(s) 4"), vBrk.slice(0, 120));
  revisar("practica: resolver en la misma sesion no adelanta el repaso", (await evaluar("Store.estado.repasos.find(r => r.slug === 'uva-11332').vence")) === sesion0 + 1);

  // ---- 5) Modulos: un paso marcado sobrevive a recargar la pagina
  await ir("bloque/m0-1");
  await hasta("!!document.querySelector('[data-paso=guia]')");
  revisar("bloque m0-1: el problema 11332 ya aceptado se marca solo", await evaluar("document.querySelector('[data-paso=\"uva-11332\"] input').checked"));
  await evaluar("document.querySelector('[data-paso=guia] input').click()");
  await recargar();
  await hasta("!!document.querySelector('[data-paso=guia]')");
  revisar("bloque m0-1: el paso marcado sigue marcado después de recargar",
    (await evaluar("document.querySelector('[data-paso=guia] input').checked")) && (await evaluar("Store.estado.modulos.bloques['m0-1'].pasos.guia === true")));
  revisar("bloque m0-1: queda como bloque activo", (await evaluar("Store.estado.modulos.activo && Store.estado.modulos.activo.id")) === "m0-1");
  await ir("inicio");
  revisar("inicio: muestra 'Continúa donde quedaste' con el bloque a medias", (await evaluar("document.querySelector('.continuar') ? document.querySelector('.continuar').textContent : ''")).includes("Patrones de lectura"));
  await evaluar("Store.bloque('m0-1').seg = 0; Store.guardar()");
  await ir("bloque/m0-1");
  await dormir(5600);
  revisar("bloque: el reloj del bloque cuenta el tiempo", (await evaluar("Store.estado.modulos.bloques['m0-1'].seg")) >= 5);

  // ---- 6) Animaciones: llegar al final (respondiendo las predicciones) marca el paso del bloque
  for (const t of ["dyc", "bt", "dp", "voraz"]) {
    await ir("guias/tecnicas/" + t);
    await hasta("!!document.querySelector('.anim [data-a=sig]')");
    const pasos = await evaluar(`(async () => {
      let n = 0;
      const sig = () => document.querySelector('.anim [data-a=sig]');
      while (n < 80 && !(sig().disabled && !document.querySelector('.anim [data-o]:not([disabled])'))) {
        const op = document.querySelector('.anim [data-o]:not([disabled])');
        if (op) op.click(); else sig().click();
        n++;
      }
      return document.querySelector('.anim-paso').textContent;
    })()`);
    const marcado = await evaluar(`!!(Store.estado.modulos.bloques['${t}-1'] || {pasos: {}}).pasos.anim`);
    revisar(`animacion ${t}: se recorre hasta el final (${pasos}) y marca el paso del bloque ${t}-1`, marcado && /paso (\d+) de \1/.test(pasos), pasos);
    if (t === "bt" || t === "dp") await captura("anim-" + t);
  }

  // ---- 7) Repaso espaciado: en una sesion nueva el problema fallado aparece primero
  // simula que pasaron 4 horas: se cambia la ultima actividad guardada y se recarga sin la marca de la pestana
  await ir("inicio");
  await evaluar(`(() => { const e = JSON.parse(localStorage.getItem('arena-ada:v1')); e.sesion.ultima -= 4 * 3600e3; localStorage.setItem('arena-ada:v1', JSON.stringify(e)); sessionStorage.clear(); location.reload(); return 1; })()`).catch(() => 0);
  await dormir(1000);
  await hasta("!!window.App && !!document.querySelector('.hero')");
  await evaluar("window.confirm = () => true; window.alert = () => {}");
  revisar("sesion nueva: el contador de sesiones avanza", (await evaluar("Store.estado.sesion.n")) === sesion0 + 1);
  const textoInicio = await evaluar("document.querySelector('#vista').textContent");
  revisar("sesion nueva: inicio muestra primero el repaso del problema fallado", textoInicio.includes("Primero, un repaso rápido") && textoInicio.includes("Summing Digits"));
  const reco = await evaluar("JSON.stringify(App.recomendar(60).plan.map(x => x.tipo + ':' + (x.slug || x.b.id)))");
  revisar("recomendador (1 h): primero el repaso, después el bloque empezado", reco.startsWith('["repaso:uva-11332","bloque:m0-1"'), reco);
  const reco3 = await evaluar("(() => { const r = App.recomendar(180); return {u: r.usado, n: r.plan.length}; })()");
  revisar("recomendador (3 h): llena el tiempo sin pasarse", reco3.u <= 185 && reco3.u >= 120 && reco3.n >= 3, JSON.stringify(reco3));
  await captura("inicio-repaso");
  await evaluar("document.querySelector('[data-rep=\"uva-11332\"][data-bien=\"1\"]').click()");
  revisar("repaso: 'Me salió' lo pasa a la etapa siguiente (vuelve 2 sesiones después)",
    (await evaluar("JSON.stringify(Store.estado.repasos.find(r => r.slug === 'uva-11332'))")) === JSON.stringify({ slug: "uva-11332", vence: sesion0 + 3, etapa: 1 }));

  // ---- 8) Simulacro: 4 problemas, lectura, 2 aceptados + 1 incorrecto = 5.0 sin bono; un tercer aceptado = bono +1
  await ir("competencia");
  await hasta("!!document.querySelector('#empezar')");
  await evaluar("document.querySelector('#empezar').click()");
  await hasta("!!document.querySelector('.lect')");
  const comp = await evaluar("Store.estado.competencia.problemas.map(x => ARENA_DATA.arena.find(p => p.slug === x.slug))");
  revisar("simulacro: 4 problemas, uno por tema", comp.map((p) => p.tema).sort().join(",") === "bt,dp,dyc,voraz", comp.map((p) => p.tema).join(","));
  revisar("simulacro: dificultades 1 fácil, 2 medios, 1 difícil", comp.map((p) => p.dificultad).sort().join(",") === "dificil,facil,medio,medio", comp.map((p) => p.dificultad).join(","));
  revisar("simulacro: duracion 2 h 20 min", (await evaluar("Store.estado.competencia.duracion")) === 8400);
  await evaluar(`(() => { for (const id of ['entiendo', 'parecido']) document.querySelector('.lect[data-letra=C] [data-s=' + id + ']').click(); document.querySelector('.lect[data-letra=A] [data-s=atascada]').click(); document.querySelector('.lect[data-letra=A] [data-s=limites]').click(); })()`);
  await evaluar("document.querySelector('#auto-orden').click()");
  const orden = await evaluar("Store.estado.competencia.orden.join('')");
  revisar("lectura: las señales estiman la dificultad y 'Ordenar' pone primero el fácil y al final el difícil", orden[0] === "C" && orden[3] === "A", orden);
  await captura("lectura");
  await evaluar("document.querySelector('#a-resolver').click()");
  await hasta("!!document.querySelector('.tablero')");
  const letras = ["A", "B", "C", "D"];
  const slugs = await evaluar("Store.estado.competencia.problemas.map(x => x.slug)");
  const solucionDe = (i) => evaluar(`ARENA_DATA.arena.find(p => p.slug === ${JSON.stringify(slugs[i])}).solucion`);
  for (const [i, tipo] of [[0, "ok"], [1, "ok"], [2, "mal"]]) {
    await ir("competencia/" + letras[i]);
    await hasta("!!document.querySelector('#reloj-p')");
    const codigo = tipo === "ok" ? await solucionDe(i) : "import sys\nprint(0)\n";
    v = await enviarCodigo(codigo);
    revisar(`simulacro: problema ${letras[i]} (${tipo === "ok" ? "solución correcta" : "solución incorrecta"}) -> ${v}`, tipo === "ok" ? v.includes("Correcto") : !v.includes("Correcto"));
  }
  await ir("competencia");
  await hasta("!!document.querySelector('.tablero')");
  let ex = await evaluar("App.notaExamen(App.compActual())");
  revisar("simulacro: 2 aceptados + 1 incorrecto -> nota 5.0 y bono 0", ex.nota === 5 && ex.bono === 0 && ex.acs === 2, JSON.stringify(ex));
  revisar("simulacro: el tablero muestra 5.0 y el aviso de que ya es 5.0", (await evaluar("document.querySelector('.tiles .tile-n').textContent")) === "5.0"
    && (await evaluar("document.querySelector('.avisos').textContent")).includes("5.0"));
  revisar("simulacro: se mide el tiempo dedicado a cada problema", (await evaluar("Store.estado.competencia.problemas[0].seg")) > 0);
  await captura("tablero");
  await ir("competencia/D");
  v = await enviarCodigo(await solucionDe(3));
  ex = await evaluar("App.notaExamen(App.compActual())");
  revisar("simulacro: tercer aceptado -> nota 5.0 y bono +1", ex.nota === 5 && ex.bono === 1 && ex.acs === 3, JSON.stringify(ex));
  await ir("competencia");
  await hasta("!!document.querySelector('#terminar')");
  await evaluar("document.querySelector('#terminar').click()");
  await hasta("location.hash.startsWith('#/reporte/') && !!document.querySelector('.reporte-cab')");
  const rep2 = await evaluar(`({cab: document.querySelector('.reporte-cab').textContent, calib: !!document.querySelector('.calib'), rubricas: document.querySelectorAll('#rep-problemas .rubrica').length,
    s: (() => { const s = Store.estado.simulacros[Store.estado.simulacros.length - 1]; return {nota: s.nota, bono: s.bono, acs: s.acs, v: s.version}; })(), comp: Store.estado.competencia})`);
  revisar("reporte: nota 5.0, bono +1, 3 aceptados", rep2.cab.includes("5.0") && rep2.cab.includes("bono +1") && rep2.s.nota === 5 && rep2.s.bono === 1 && rep2.s.acs === 3, JSON.stringify(rep2.s));
  revisar("reporte: rubrica de los 4 problemas y tabla de calibracion", rep2.rubricas === 4 && rep2.calib, `${rep2.rubricas} rubricas`);
  revisar("reporte: el examen queda cerrado", rep2.comp === null);
  const malo = await evaluar("document.querySelector('[data-rep-letra=C]').textContent");
  revisar("reporte: el problema incorrecto explica por qué y qué pasó", malo.includes("Por qué está en este rango") && malo.includes("Qué pasó"), malo.slice(0, 160));
  await captura("reporte");
  await ir("bloque/sim-1");
  revisar("modulos: el simulacro terminado marca el bloque Simulacro 1", await evaluar("App.progresoBloque(App.BLOQUE['sim-1']).hecho"));

  // ---- 9) Practica a ciegas: no muestra el tema hasta revelarlo
  await ir("ciego");
  await hasta("!!document.querySelector('#c-revelar')");
  revisar("ciego: el tema está oculto", (await evaluar("document.querySelectorAll('.prob-cab .chip').length")) === 0);
  await evaluar("document.querySelector('#c-revelar').click()");
  revisar("ciego: 'Revelar el tema' lo muestra", (await evaluar("document.querySelectorAll('.prob-cab .chip').length")) === 2);
  revisar("ciego: no hay escalera de pistas", (await evaluar("!!document.querySelector('#pistas')")) === false);

  // ---- 10) Migracion desde la version 1 (plan de 21 dias)
  const mig = await evaluar(`(() => { const e = Store.migrar({problemas: {}, actividad: {'2026-11-01': 3}, plan: {inicio: '2026-11-01', hecho: {}}, bitacora: [],
    repasos: [{slug: 'uva-10912', fecha: '2026-11-02', hecho: false}, {slug: 'uva-10912', fecha: '2026-11-04', hecho: false}, {slug: 'uva-208', fecha: '2026-11-02', hecho: true}],
    simulacros: [{inicio: 1, resueltos: 2, penalizacion: 50, problemas: []}], competencia: {inicio: 1, duracion: 10800, problemas: []}});
    return {v: e.version, plan: 'plan' in e, act: 'actividad' in e, rep: e.repasos, sim: e.simulacros[0].formato, comp: e.competencia, mod: !!e.modulos.bloques}; })()`);
  revisar("migracion v1 -> v2: quita plan y rachas, convierte repasos y marca simulacros viejos",
    mig.v === 2 && !mig.plan && !mig.act && mig.rep.length === 1 && mig.rep[0].slug === "uva-10912" && mig.sim === "v1" && mig.comp === null && mig.mod, JSON.stringify(mig));

  // ---- 11) Todas las vistas cargan
  for (const ruta of ["inicio", "modulos", "bloque/dyc-1", "bloque/rec-2", "practica", "competencia", "bitacora", "guias/tecnicas/voraz", "guias/reconocer",
    "guias/dificultad", "guias/lectura", "guias/plantillas", "guias/plantillas/bt", "guias/quiz", "progreso", "reporte/0"]) {
    await ir(ruta);
    const h1 = await evaluar("(document.querySelector('#vista h1') || {}).textContent || ''");
    revisar(`vista #/${ruta}`, h1.length > 0, h1);
    if (ruta === "modulos" || ruta === "progreso" || ruta === "guias/plantillas/bt") await captura(ruta.replace(/\//g, "-"));
  }
  await ir("guias/quiz");
  const q0 = await evaluar("Store.estado.quiz.respondidas");
  await evaluar("document.querySelector('#quiz [data-t]').click()");
  revisar("quiz: cuenta las respuestas (para el bloque de reconocimiento)", (await evaluar("Store.estado.quiz.respondidas")) === q0 + 1);
  revisar("quiz: solo ofrece los 4 temas del examen", (await evaluar("document.querySelectorAll('#quiz [data-t]').length")) === 4);

  // ---- 12) Celular (390 px) y modo oscuro
  await cdp("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  for (const ruta of ["inicio", "modulos", "problema/uva-10912", "guias/tecnicas/dp", "reporte/0"]) {
    await ir(ruta);
    await dormir(300);
    const ancho = await evaluar("document.documentElement.scrollWidth - window.innerWidth");
    revisar(`celular: #/${ruta} sin scroll horizontal`, ancho <= 0, `${ancho}px de más`);
    if (ruta === "inicio" || ruta === "guias/tecnicas/dp") await captura("movil-" + ruta.replace(/\//g, "-"));
  }
  await cdp("Emulation.clearDeviceMetricsOverride");
  await cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "dark" }] });
  await ir("guias/tecnicas/bt");
  await captura("oscuro-bt");
  await ir("inicio");
  await captura("oscuro-inicio");

  revisar("sin errores de JavaScript en la página", excepciones.length === 0, excepciones.join(" | "));
} catch (e) {
  console.error("ERROR:", e.message);
  fallas++;
} finally {
  console.log(fallas ? `\n${fallas} falla(s)` : "\nTODO OK");
  console.log(`Capturas en ${tmpdir()}\\arena-*.png`);
  try { ws.close(); } catch {}
  chrome.kill();
  process.exit(fallas ? 1 : 0);
}
