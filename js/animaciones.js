// Animaciones paso a paso de cada tecnica. Las controla la estudiante (adelante, atras, reiniciar, automatico)
// y en los momentos clave piden una prediccion antes de mostrar el resultado.
// Cada animacion: {titulo, codigo:[lineas], cuadros:[{e: estado, t: texto, l: [lineas resaltadas], q?: pregunta}], dibujar(e)}
// Pregunta: {t: texto, o: [opciones], c: indice correcto, x: explicacion}
window.Anim = (() => {
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ------------------------------------------------------------ dividir y conquistar: busqueda binaria sobre la respuesta
  function dyc() {
    const N = 17, LIM = 90;
    const cuadros = [];
    const conocidos = new Array(N).fill(null);
    const foto = (lo, hi, mid, extra = {}) => ({ lo, hi, mid, conocidos: [...conocidos], ...extra });
    cuadros.push({ e: foto(0, 16, null), l: [0],
      t: "Buscamos el mayor x entre 0 y 16 con x·x ≤ 90. La pregunta «¿x·x ≤ 90?» es monótona: si vale para x, vale para todo lo menor. Eso permite descartar mitades enteras." });
    let lo = 0, hi = 16;
    const preguntas = {
      8: { t: "8·8 = 64 ≤ 90. ¿Qué pasa con los números de 0 a 7?", o: ["También cumplen: no hace falta revisarlos y lo = 8", "Hay que revisarlos uno por uno", "No cumplen"], c: 0,
        x: "Monotonía: si 8 cumple, todo lo menor también. La respuesta es al menos 8." },
      12: { t: "12·12 = 144 > 90. ¿Qué rango queda para buscar?", o: ["8 a 11", "12 a 16", "8 a 12"], c: 0,
        x: "12 no cumple y nada mayor puede cumplir: hi = mid − 1 = 11." },
      9: { t: "¿Por qué mid = (lo + hi + 1) // 2 y no (lo + hi) // 2?", o: ["Con lo = 8 y hi = 9, (8 + 9) // 2 = 8 y lo = mid no cambia nada: ciclo infinito", "Para que sea más rápido", "Da lo mismo"], c: 0,
        x: "Cuando la rama que cumple hace lo = mid, el medio debe redondear hacia arriba para que el rango siempre se achique." },
    };
    while (lo < hi) {
      const mid = Math.floor((lo + hi + 1) / 2);
      const ok = mid * mid <= LIM;
      cuadros.push({ e: foto(lo, hi, mid), l: [2, 3], q: preguntas[mid],
        t: `mid = (${lo} + ${hi} + 1) // 2 = ${mid}. ¿${mid}·${mid} = ${mid * mid} ≤ ${LIM}? ${ok ? "Sí." : "No."}` });
      if (ok) { for (let k = 0; k <= mid; k++) conocidos[k] = true; lo = mid; }
      else { for (let k = mid; k < N; k++) conocidos[k] = false; hi = mid - 1; }
      cuadros.push({ e: foto(lo, hi, null), l: ok ? [4] : [6],
        t: ok ? `Cumple: la respuesta es ${mid} o más. lo = ${mid}. Quedan ${hi - lo + 1} candidatos.` : `No cumple: la respuesta es menor que ${mid}. hi = ${mid - 1}. Quedan ${hi - lo + 1} candidatos.` });
    }
    cuadros.push({ e: foto(lo, hi, null, { fin: true }), l: [7],
      t: `lo = hi = ${lo}: la respuesta es ${lo}. Bastaron ${cuadros.filter((c) => c.e.mid !== null).length} preguntas en vez de 17. Con un rango de 10^9 serían unas 30: O(log(rango) · costo de la pregunta).` });

    function dibujar(e) {
      const W = 36, X0 = 10;
      let s = `<svg viewBox="0 0 ${X0 * 2 + N * W} 120" role="img" aria-label="Números de 0 a 16 con lo=${e.lo}, hi=${e.hi}">`;
      for (let k = 0; k < N; k++) {
        const x = X0 + k * W, fuera = k < e.lo || k > e.hi;
        const cls = e.conocidos[k] === true ? "an-si" : e.conocidos[k] === false ? "an-no" : "";
        s += `<g class="an-celda ${cls} ${fuera ? "an-fuera" : ""} ${k === e.mid ? "an-actual" : ""} ${e.fin && k === e.lo ? "an-meta" : ""}">
          <rect x="${x + 2}" y="30" width="${W - 4}" height="34" rx="6"/><text x="${x + W / 2}" y="52">${k}</text>
          <text class="an-mini" x="${x + W / 2}" y="22">${k * k}</text></g>`;
      }
      const marca = (k, txt, y) => `<g class="an-marca"><path d="M${X0 + k * W + W / 2} ${y - 14} l-5 -7 h10 z"/><text x="${X0 + k * W + W / 2}" y="${y}">${txt}</text></g>`;
      s += marca(e.lo, "lo", 98);
      if (e.hi !== e.lo) s += marca(e.hi, "hi", 98);
      if (e.mid !== null) s += marca(e.mid, "mid", 116);
      return s + `<text class="an-mini an-izq" x="${X0}" y="10">x·x</text></svg>`;
    }
    return {
      titulo: "Búsqueda binaria sobre la respuesta",
      codigo: ["lo, hi = 0, 16", "while lo < hi:", "    mid = (lo + hi + 1) // 2", "    if mid * mid <= 90:", "        lo = mid", "    else:", "        hi = mid - 1", "ans = lo"],
      cuadros, dibujar,
    };
  }

  // ------------------------------------------------------------ backtracking: subconjuntos que suman t con poda
  function bt() {
    const a = [3, 2, 1, 1], t = 4, resto = [7, 4, 2, 1, 0];
    const nodos = [];
    const cuadros = [];
    const preguntas = {
      "1": { t: "Ahora se prueba tomar el 2: la suma quedaría en 5. ¿Qué hace el backtracking?", o: ["Poda: 5 > 4, no sigue por esa rama", "Sigue hasta el final y luego revisa", "Termina toda la búsqueda"], c: 0,
        x: "Una suma parcial que ya se pasó nunca vuelve a servir: se corta la rama completa." },
      "100": { t: "Quedan dos 1 iguales. Si ahora se toma el segundo 1, ¿qué subconjunto sale?", o: ["{3, 1} otra vez: un repetido", "{3, 1, 1}", "Ninguno"], c: 0,
        x: "Con valores repetidos aparecen soluciones repetidas. Para evitarlo: ordena y no pruebes dos veces el mismo valor en un mismo nivel." },
      "0110": { t: "Ahora se prueba NO tomar el primer 1: la suma es 2 y solo queda un 1 por decidir. ¿Vale la pena seguir?", o: ["No: 2 + 1 < 4, poda por falta", "Sí, hay que probar todo", "Sí, porque 2 < 4"], c: 0,
        x: "Si ni tomando todo lo que queda se llega a t, la rama no tiene solución: se poda sin explorarla." },
    };
    function visitar(path, i, suma, elegidos) {
      let estado = "abierto";
      if (suma > t) estado = "exceso";
      else if (suma === t) estado = "sol";
      else if (suma + resto[i] < t) estado = "falta";
      nodos.push({ path, i, suma, estado });
      const conjunto = `{${elegidos.join(", ")}}`;
      const textos = {
        abierto: `Suma ${suma} con ${conjunto}. Todavía puede llegar a ${t}: se decide el siguiente número${i < a.length ? ` (el ${a[i]})` : ""}.`,
        exceso: `Suma ${suma} > ${t}: poda. No se exploran las ramas de abajo.`,
        sol: `¡Suma ${t}! Solución ${conjunto}. Al volver se deshace la última decisión y se prueba la otra opción.`,
        falta: `Suma ${suma} y lo que queda suma ${resto[i]}: ${suma} + ${resto[i]} < ${t}. Poda: por aquí nunca se llega.`,
      };
      const decision = path ? `${path.endsWith("1") ? "Se toma" : "No se toma"} el ${a[i - 1]}. ` : "";
      cuadros.push({ e: { nodos: nodos.map((n) => ({ ...n })), actual: path, elegidos: [...elegidos] }, t: decision + textos[estado],
        l: estado === "abierto" ? [5, 6] : estado === "sol" ? [3, 4] : [1, 2], q: preguntas[path] });
      if (estado === "abierto") {
        visitar(path + "1", i + 1, suma + a[i], [...elegidos, a[i]]);
        visitar(path + "0", i + 1, suma, elegidos);
      }
    }
    cuadros.push({ e: { nodos: [], actual: null, elegidos: [] }, l: [0],
      t: "Números [3, 2, 1, 1] y meta t = 4. Cada nivel del árbol decide un número: a la izquierda se toma, a la derecha no. Cada círculo muestra la suma parcial." });
    visitar("", 0, 0, []);
    cuadros.push({ e: { nodos: nodos.map((n) => ({ ...n })), actual: null, elegidos: [] }, l: [],
      t: `Se visitaron ${nodos.length} nodos de 31 posibles gracias a la poda. Soluciones: {3, 1} (dos veces, por los 1 repetidos) y {2, 1, 1}. Sin poda el costo es 2^n; con poda sigue siendo exponencial, pero viable para n pequeño.` });

    function dibujar(e) {
      const W = 640, Y0 = 26, DY = 66;
      const pos = (p) => {
        const d = p.length;
        let idx = 0;
        for (const ch of p) idx = idx * 2 + (ch === "1" ? 0 : 1);
        return [((idx + 0.5) / 2 ** d) * W, Y0 + d * DY];
      };
      let s = `<svg viewBox="0 0 ${W} ${Y0 * 2 + 4 * DY + 6}" role="img" aria-label="Árbol de decisiones del backtracking">`;
      for (const n of e.nodos) {
        if (n.path) {
          const [x, y] = pos(n.path), [px, py] = pos(n.path.slice(0, -1));
          const toma = n.path.endsWith("1");
          s += `<line class="an-arista ${toma ? "an-toma" : ""}" x1="${px}" y1="${py}" x2="${x}" y2="${y}"/>
            <text class="an-mini" x="${(x + px) / 2 + (toma ? -12 : 12)}" y="${(y + py) / 2}">${toma ? "+" + a[n.path.length - 1] : "–"}</text>`;
        }
      }
      for (const n of e.nodos) {
        const [x, y] = pos(n.path);
        const poda = n.estado === "exceso" || n.estado === "falta";
        s += `<g class="an-nodo an-${n.estado} ${n.path === e.actual ? "an-actual" : ""}"><circle cx="${x}" cy="${y}" r="16"/>
          <text x="${x}" y="${y + 5}">${n.suma}</text>${poda ? `<text class="an-x" x="${x + 17}" y="${y - 10}">✕</text>` : ""}${n.estado === "sol" ? `<text class="an-x" x="${x + 17}" y="${y - 10}">✓</text>` : ""}</g>`;
      }
      return s + "</svg>";
    }
    return {
      titulo: "Backtracking con poda: subconjuntos que suman 4",
      codigo: ["def solve(i, suma):", "    if suma > t or suma + resto[i] < t:", "        ans = 0                          # podar", "    elif suma == t:",
        "        ans = 1                          # solucion", "    else:", "        ans = solve(i + 1, suma + a[i])  # tomar a[i]",
        "        ans += solve(i + 1, suma)        # no tomar", "    return ans"],
      cuadros, dibujar,
    };
  }

  // ------------------------------------------------------------ programacion dinamica: mochila 0/1
  function dp() {
    const obj = [[2, 3], [3, 4], [4, 5]], cap = 5;
    const T = [new Array(cap + 1).fill(0)];
    for (let i = 1; i <= obj.length; i++) {
      const [w, v] = obj[i - 1];
      T.push([]);
      for (let c = 0; c <= cap; c++) T[i][c] = Math.max(T[i - 1][c], w <= c ? T[i - 1][c - w] + v : -1);
    }
    const lleno = Array.from({ length: obj.length + 1 }, (_, i) => new Array(cap + 1).fill(i === 0));
    for (let i = 1; i <= obj.length; i++) { lleno[i][0] = true; lleno[i][1] = true; }
    const foto = (extra = {}) => ({ lleno: lleno.map((f) => [...f]), ...extra });
    const cuadros = [{ e: foto(), l: [4, 5],
      t: "phi(i, c) = mejor valor usando los primeros i objetos con capacidad c. Fila 0 (ningún objeto) y capacidades 0 y 1 (no cabe nada) valen 0. Cada celda depende solo de la fila de arriba." }];
    const preguntas = {
      "2,5": { t: "No tomar (3,4) deja T[1][5] = 3. Tomarlo deja T[1][2] + 4. ¿Cuánto vale T[2][5]?", o: ["7", "4", "3"], c: 0, x: "T[1][2] = 3, más 4 = 7, que es mayor que 3." },
      "3,4": { t: "Con capacidad 4, ¿conviene tomar el objeto (4,5)?", o: ["Sí: T[2][0] + 5 = 5 supera a T[2][4] = 4", "No: se queda en 4"], c: 0, x: "Tomarlo usa toda la capacidad pero vale 5 > 4." },
      "3,5": { t: "Con capacidad 5, ¿conviene tomar el objeto (4,5)?", o: ["No: T[2][1] + 5 = 5 es menor que T[2][5] = 7", "Sí: 5 > 0"], c: 0, x: "Sin tomarlo ya se tienen 7 con los dos primeros objetos." },
    };
    for (let i = 1; i <= obj.length; i++) {
      const [w, v] = obj[i - 1];
      for (let c = 2; c <= cap; c++) {
        const deps = [[i - 1, c, "no"]];
        if (w <= c) deps.push([i - 1, c - w, "si"]);
        const q = preguntas[`${i},${c}`];
        const tomar = w <= c ? `tomar: T[${i - 1}][${c - w}] + ${v} = ${T[i - 1][c - w] + v}` : `tomar: no cabe (peso ${w} > ${c})`;
        const texto = `T[${i}][${c}] con el objeto (peso ${w}, valor ${v}): no tomar: T[${i - 1}][${c}] = ${T[i - 1][c]}; ${tomar}.`;
        if (q) cuadros.push({ e: foto({ actual: [i, c], deps, oculto: true }), t: texto, q, l: [8, 9, 10] });
        lleno[i][c] = true;
        cuadros.push({ e: foto({ actual: [i, c], deps }), t: `${texto} Queda ${T[i][c]}.`, l: w <= c ? [9, 10] : [8] });
      }
    }
    cuadros.push({ e: foto({ fin: true }), l: [11, 12],
      t: `Respuesta: T[3][5] = ${T[3][5]} (objetos (2,3) y (3,4)). Cada estado se calcula una sola vez: 4 × 6 celdas. La recursión sin mem repetiría subproblemas y crecería como 2^n.` });

    function dibujar(e) {
      const CW = 52, CH = 38, X0 = 120, Y0 = 30;
      const nombres = ["ninguno", "+ (2, 3)", "+ (3, 4)", "+ (4, 5)"];
      let s = `<svg viewBox="0 0 ${X0 + (cap + 1) * CW + 10} ${Y0 + 4 * CH + 12}" role="img" aria-label="Tabla de la mochila 0/1">`;
      for (let c = 0; c <= cap; c++) s += `<text class="an-mini" x="${X0 + c * CW + CW / 2}" y="${Y0 - 10}">c=${c}</text>`;
      for (let i = 0; i <= obj.length; i++) {
        s += `<text class="an-mini an-izq" x="8" y="${Y0 + i * CH + CH / 2 + 4}">${nombres[i]}</text>`;
        for (let c = 0; c <= cap; c++) {
          const dep = (e.deps || []).find(([r, cc]) => r === i && cc === c);
          const act = e.actual && e.actual[0] === i && e.actual[1] === c;
          const meta = e.fin && i === obj.length && c === cap;
          const val = e.lleno[i][c] && !(act && e.oculto) ? T[i][c] : act ? "?" : "";
          s += `<g class="an-celda ${act ? "an-actual" : ""} ${dep ? (dep[2] === "si" ? "an-dep-si" : "an-dep-no") : ""} ${meta ? "an-meta" : ""} ${e.lleno[i][c] ? "" : "an-vacia"}">
            <rect x="${X0 + c * CW + 2}" y="${Y0 + i * CH + 2}" width="${CW - 4}" height="${CH - 4}" rx="5"/>
            <text x="${X0 + c * CW + CW / 2}" y="${Y0 + i * CH + CH / 2 + 5}">${val}</text></g>`;
        }
      }
      return s + "</svg>";
    }
    return {
      titulo: "Programación dinámica: mochila 0/1 (capacidad 5)",
      codigo: ["def phi(i, c):", "    if (i, c) in mem:", "        ans = mem[(i, c)]", "    else:", "        if i == 0:", "            ans = 0", "        else:",
        "            w, v = obj[i - 1]", "            ans = phi(i - 1, c)      # no tomar", "            if w <= c:               # tomar",
        "                ans = max(ans, phi(i - 1, c - w) + v)", "        mem[(i, c)] = ans", "    return ans"],
      cuadros, dibujar, leyenda: `<span class="an-ley an-ley-no"></span> no tomar (arriba) <span class="an-ley an-ley-si"></span> tomar (arriba a la izquierda)`,
    };
  }

  // ------------------------------------------------------------ voraz: seleccion de actividades
  function voraz() {
    const acts = { A: [1, 4], B: [3, 5], C: [0, 6], D: [5, 7], E: [3, 9], F: [6, 10], G: [8, 11] };
    const letras = Object.keys(acts);
    const cuadros = [];
    const preguntas = {
      "fin:B": { t: "B empieza en 3 y la última escogida (A) termina en 4. ¿Se toma B?", o: ["No: se cruza con A", "Sí: B termina pronto"], c: 0, x: "B empieza antes de que A termine: chocan." },
      "fin:G": { t: "G empieza en 8 y la última escogida (D) termina en 7. ¿Se toma G?", o: ["Sí: es compatible", "No"], c: 0, x: "8 ≥ 7: no se cruza con nada de lo escogido." },
      "inicio:intro": { t: "Ahora ordenamos por INICIO. La primera es C (0–6), muy larga. ¿Cuántas actividades crees que saldrán?", o: ["Menos de 3", "3, igual que antes", "Más de 3"], c: 0,
        x: "C ocupa casi todo el principio y bloquea a A, B y D." },
    };
    function fase(criterio, orden) {
      const estados = {};
      let ultimo = -1, tomadas = 0;
      const titulo = criterio === "fin" ? "fin" : "inicio";
      cuadros.push({ e: { orden, estados: { ...estados }, ultimo, criterio }, l: [0], q: preguntas[`${criterio}:intro`],
        t: criterio === "fin" ? "Criterio voraz: ordenar por hora de FIN. La idea: terminar lo antes posible deja más espacio para lo que sigue."
          : "Contraejemplo: mismo algoritmo, pero ordenando por hora de inicio." });
      for (const x of orden) {
        const [ini, fin] = acts[x];
        const ok = ini >= ultimo;
        const q = preguntas[`${criterio}:${x}`];
        if (q) cuadros.push({ e: { orden, estados: { ...estados, [x]: "actual" }, ultimo, criterio }, l: [3], q, t: `Se revisa ${x} (${ini}–${fin}).` });
        const antes = ultimo;
        estados[x] = ok ? "tomada" : "descartada";
        if (ok) { ultimo = fin; tomadas++; }
        cuadros.push({ e: { orden, estados: { ...estados }, ultimo, criterio, actual: x }, l: ok ? [3, 4, 5] : [3],
          t: ok ? `${x} (${ini}–${fin}) ${antes < 0 ? "es la primera: no choca con nada" : `empieza en ${ini} ≥ ${antes}, el último fin`}: se toma. Ahora el último fin es ${fin}.`
            : `${x} (${ini}–${fin}) empieza en ${ini}, antes de ${antes}: se cruza, se descarta.` });
      }
      cuadros.push({ e: { orden, estados: { ...estados }, ultimo, criterio, fin: true }, l: [],
        t: criterio === "fin" ? `Ordenando por ${titulo}: ${tomadas} actividades (A, D, G). Una sola pasada después de ordenar: O(n log n).`
          : `Ordenando por inicio salen solo ${tomadas}. El criterio de orden es la decisión clave: antes de confiar en un voraz, busca un contraejemplo pequeño como este. Ordenar por fin se justifica por intercambio: cambiar la primera escogida por la que termina primero nunca empeora.` });
    }
    cuadros.push({ e: { orden: letras, estados: {}, ultimo: -1, criterio: null }, l: [],
      t: "Siete actividades con hora de inicio y fin. Queremos escoger la mayor cantidad sin que se crucen." });
    fase("fin", [...letras].sort((x, y) => acts[x][1] - acts[y][1]));
    fase("inicio", [...letras].sort((x, y) => acts[x][0] - acts[y][0] || acts[x][1] - acts[y][1]));

    function dibujar(e) {
      const U = 44, X0 = 40, Y0 = 24, DY = 30;
      let s = `<svg viewBox="0 0 ${X0 + 12 * U + 10} ${Y0 + letras.length * DY + 26}" role="img" aria-label="Actividades sobre una línea de tiempo">`;
      for (let k = 0; k <= 12; k++) s += `<line class="an-reja" x1="${X0 + k * U}" y1="${Y0 - 6}" x2="${X0 + k * U}" y2="${Y0 + letras.length * DY}"/><text class="an-mini" x="${X0 + k * U}" y="${Y0 + letras.length * DY + 16}">${k}</text>`;
      e.orden.forEach((x, fila) => {
        const [ini, fin] = acts[x];
        const est = e.estados[x] || "";
        s += `<g class="an-act an-${est} ${e.actual === x ? "an-actual" : ""}"><text class="an-izq" x="8" y="${Y0 + fila * DY + 15}">${x}</text>
          <rect x="${X0 + ini * U}" y="${Y0 + fila * DY}" width="${(fin - ini) * U}" height="20" rx="10"/></g>`;
      });
      if (e.ultimo >= 0) s += `<line class="an-ultimo" x1="${X0 + e.ultimo * U}" y1="${Y0 - 12}" x2="${X0 + e.ultimo * U}" y2="${Y0 + letras.length * DY + 4}"/>
        <text class="an-mini an-ultimo-t" x="${X0 + e.ultimo * U}" y="${Y0 - 14}">último fin</text>`;
      return s + "</svg>";
    }
    return {
      titulo: "Voraz: selección de actividades",
      codigo: ["acts.sort(key=lambda a: a[1])  # por fin", "ans, ultimo = 0, -1", "for ini, fin in acts:",
        "    if ini >= ultimo:          # compatible", "        ans += 1", "        ultimo = fin"],
      cuadros, dibujar, leyenda: `<span class="an-ley an-ley-si"></span> tomada <span class="an-ley an-ley-x"></span> descartada`,
    };
  }

  const FABRICAS = { dyc, bt, dp, voraz };

  // Monta la animacion del tema en el contenedor. opciones.onFin() se llama la primera vez que se llega al final.
  function montar(raiz, tema, opciones = {}) {
    const A = FABRICAS[tema]();
    const reducido = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const respondidas = new Map();
    // el orden de las opciones se baraja al montar: la correcta no siempre es la primera
    const ordenes = A.cuadros.map((c) => {
      const idx = c.q ? c.q.o.map((_, i) => i) : [];
      for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
      return idx;
    });
    let k = 0, auto = null, avisado = false;
    raiz.innerHTML = `<div class="anim tema-${tema}" tabindex="0">
      <div class="anim-cab"><b>${esc(A.titulo)}</b><span class="sub anim-paso"></span></div>
      <div class="anim-cuerpo"><div class="anim-lienzo"></div><pre class="anim-codigo"></pre></div>
      ${A.leyenda ? `<div class="sub anim-leyenda">${A.leyenda}</div>` : ""}
      <p class="anim-texto" aria-live="polite"></p>
      <div class="anim-pregunta"></div>
      <div class="anim-ctrl">
        <button class="btn mini sec" data-a="reset" title="Reiniciar" aria-label="Reiniciar">⟲</button>
        <button class="btn mini sec" data-a="atras" aria-label="Paso anterior">◀ Atrás</button>
        <button class="btn mini primario" data-a="sig" aria-label="Paso siguiente">Siguiente ▶</button>
        <button class="btn mini sec" data-a="auto" aria-label="Avance automático">▶▶ Auto</button>
        <div class="anim-barra"><div></div></div>
      </div></div>`;
    const $ = (s) => raiz.querySelector(s);
    const bloqueado = () => A.cuadros[k].q && !respondidas.has(k);

    function pintar() {
      const c = A.cuadros[k];
      $(".anim-lienzo").innerHTML = A.dibujar(c.e);
      $(".anim-codigo").innerHTML = A.codigo.map((l, i) => `<span class="${(c.l || []).includes(i) ? "an-linea" : ""}">${esc(l)}</span>`).join("\n");
      $(".anim-texto").textContent = c.t;
      $(".anim-paso").textContent = `paso ${k + 1} de ${A.cuadros.length}`;
      $(".anim-barra div").style.width = `${(100 * (k + 1)) / A.cuadros.length}%`;
      const q = c.q;
      if (q) {
        const r = respondidas.get(k);
        $(".anim-pregunta").innerHTML = `<div class="prediccion"><b>Predice antes de seguir:</b> ${esc(q.t)}
          <div class="opciones">${ordenes[k].map((i) => [q.o[i], i]).map(([o, i]) => `<button class="btn mini sec ${r !== undefined && i === q.c ? "correcta" : ""} ${r === i && i !== q.c ? "incorrecta" : ""}" data-o="${i}" ${r !== undefined ? "disabled" : ""}>${esc(o)}</button>`).join("")}</div>
          ${r !== undefined ? `<p class="${r === q.c ? "ok-t" : "mal-t"}"><b>${r === q.c ? "¡Bien!" : "Casi."}</b> ${esc(q.x)}</p>` : ""}</div>`;
        raiz.querySelectorAll("[data-o]").forEach((b) => {
          b.onclick = () => { respondidas.set(k, +b.dataset.o); pintar(); };
        });
      } else {
        $(".anim-pregunta").innerHTML = "";
      }
      $("[data-a=atras]").disabled = k === 0;
      $("[data-a=sig]").disabled = k === A.cuadros.length - 1 || bloqueado();
      $("[data-a=sig]").title = bloqueado() ? "Responde la predicción para seguir" : "";
      $("[data-a=auto]").textContent = auto ? "❚❚ Pausa" : "▶▶ Auto";
      if (k === A.cuadros.length - 1 && !avisado) {
        avisado = true;
        if (opciones.onFin) opciones.onFin();
      }
    }
    function parar() { clearInterval(auto); auto = null; }
    function sig() {
      if (k < A.cuadros.length - 1 && !bloqueado()) { k++; pintar(); }
      if (auto && (k === A.cuadros.length - 1 || bloqueado())) { parar(); pintar(); }
    }
    raiz.querySelector(".anim").onclick = (ev) => {
      const a = ev.target.dataset && ev.target.dataset.a;
      if (a === "reset") { parar(); k = 0; respondidas.clear(); pintar(); }
      else if (a === "atras") { parar(); k = Math.max(0, k - 1); pintar(); }
      else if (a === "sig") { parar(); sig(); }
      else if (a === "auto") {
        if (auto) parar();
        else auto = setInterval(sig, reducido ? 3500 : 2200);
        pintar();
      }
    };
    raiz.querySelector(".anim").onkeydown = (ev) => {
      if (ev.key === "ArrowRight") { parar(); sig(); }
      else if (ev.key === "ArrowLeft") { parar(); k = Math.max(0, k - 1); pintar(); }
    };
    pintar();
    return { parar, get paso() { return k; }, get total() { return A.cuadros.length; } };
  }

  return { montar, temas: Object.keys(FABRICAS), _fabricas: FABRICAS };
})();
