// Arena ADA: interfaz principal.
(() => {
  const D = window.ARENA_DATA;
  const PROB = Object.fromEntries(D.arena.map((p) => [p.slug, p]));
  const TEMAS = ["dyc", "bt", "dp", "voraz"];
  const NOMBRE_TEMA = D.temas;
  const CORTO = { dyc: "Dividir y conquistar", bt: "Backtracking", dp: "Prog. dinámica", voraz: "Voraces", repaso: "Repaso", np: "NP" };
  const DIF = { facil: "Fácil", medio: "Medio", dificil: "Difícil" };
  const CAUSAS = {
    lectura: "Lectura de entrada", tecnica: "Técnica equivocada", borde: "Caso borde",
    tiempo: "Tiempo (lento)", formato: "Formato de salida", break: "Usé break", otro: "Otro",
  };
  const BLOQUES = MODULOS.flatMap((m) => m.bloques.map((b) => Object.assign(b, { modulo: m })));
  const BLOQUE = Object.fromEntries(BLOQUES.map((b) => [b.id, b]));
  const MOD = Object.fromEntries(MODULOS.map((m) => [m.id, m]));
  const ESQUELETOS = GUIAS.plantillas.temas.flatMap((t) => t.items.filter((x) => x.esqueleto));
  const DURACION_EXAMEN = 140 * 60;
  const vista = document.getElementById("vista");

  // ---------------------------------------------------------------- utilidades
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
  const z2 = (n) => String(n).padStart(2, "0");
  const mmss = (seg) => {
    seg = Math.max(0, Math.floor(seg));
    const h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
    return h ? `${h}:${z2(m)}:${z2(s)}` : `${z2(m)}:${z2(s)}`;
  };
  const minTxt = (m) => (m < 60 ? `${Math.round(m)} min` : `${Math.floor(m / 60)} h${Math.round(m % 60) ? ` ${Math.round(m % 60)} min` : ""}`);
  const barajar = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = Rubrica.fmt;
  const resuelto = (slug) => (Store.estado.problemas[slug] || {}).estado === "resuelto";

  const EMBLEMA = {
    dyc: `<rect class="r" x="5" y="5" width="30" height="30" rx="3"/><path class="l" d="M20 5v30M5 20h30"/><rect class="f" x="20" y="20" width="15" height="15" rx="2"/>`,
    bt: `<path class="l" d="M20 8 11 20M20 8l9 12M11 20 6 32M11 20l5 12"/><circle class="f" cx="20" cy="8" r="3.5"/><circle class="f" cx="11" cy="20" r="3.5"/><circle class="f" cx="6" cy="32" r="3"/><circle class="f" cx="16" cy="32" r="3"/><path class="l" d="M26 17l7 7M33 17l-7 7"/>`,
    dp: `<rect class="r" x="5" y="5" width="30" height="30" rx="3"/><path class="l" d="M15 5v30M25 5v30M5 15h30M5 25h30"/><rect class="f" x="5" y="5" width="10" height="10"/><rect class="f" x="15" y="5" width="10" height="10" opacity=".7"/><rect class="f" x="5" y="15" width="10" height="10" opacity=".7"/><rect class="f" x="15" y="15" width="10" height="10" opacity=".4"/>`,
    voraz: `<path class="l" d="M5 34h9v-9h9v-9h9V7"/><circle class="f" cx="32" cy="7" r="3.5"/>`,
    repaso: `<path class="l" d="M9 7h16l6 6v20H9z"/><path class="l" d="M14 18h12M14 23h12M14 28h8"/>`,
    rec: `<circle class="l" cx="17" cy="17" r="10"/><path class="l" d="M25 25l9 9M14 14h6v6"/>`,
    sim: `<path class="l" d="M7 35V19a13 13 0 0 1 26 0v16M14 35V21a6 6 0 0 1 12 0v14M3 35h34"/>`,
  };
  const emblema = (t) => `<svg class="emblema tema-${t}" viewBox="0 0 40 40" aria-hidden="true">${EMBLEMA[t] || EMBLEMA.repaso}</svg>`;
  const chipTema = (t) => `<span class="chip tema-${t}">${esc(CORTO[t] || t)}</span>`;
  const chipDif = (d) => `<span class="chip dif-${d}">${esc(DIF[d] || d)}</span>`;
  const icono = (slug) => {
    const p = Store.estado.problemas[slug];
    if (!p || p.estado === "nuevo") return `<span class="estado e-nuevo" title="Sin intentar">○</span>`;
    if (p.estado === "resuelto") return `<span class="estado e-ok" title="Aceptado">✓</span>`;
    return `<span class="estado e-mal" title="Intentado">✗</span>`;
  };
  function toast(msg, ms = 7000) {
    let pila = $("#toasts");
    if (!pila) {
      pila = document.createElement("div");
      pila.id = "toasts";
      pila.setAttribute("role", "status");
      document.body.appendChild(pila);
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = msg;
    t.title = "Clic para cerrar";
    t.onclick = (e) => { if (e.target.tagName !== "A") t.remove(); };
    pila.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }
  let limpiezas = [];
  const alSalir = (f) => limpiezas.push(f);
  const leerLocal = (k, def) => { try { return localStorage.getItem(k) ?? def; } catch (e) { return def; } };
  const escribirLocal = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } };

  // ---------------------------------------------------------------- tema claro / oscuro
  const temaGuardado = leerLocal("arena-ada:tema", "");
  if (temaGuardado) document.documentElement.dataset.theme = temaGuardado;
  $("#tema-btn").onclick = () => {
    const oscuroAhora = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const nuevo = oscuroAhora ? "light" : "dark";
    document.documentElement.dataset.theme = nuevo;
    escribirLocal("arena-ada:tema", nuevo);
  };

  // ---------------------------------------------------------------- progreso de modulos
  function pasoHecho(b, paso) {
    const eb = Store.estado.modulos.bloques[b.id] || { pasos: {} };
    if (eb.pasos && eb.pasos[paso.id]) return true;
    return pasoAuto(b, paso);
  }
  function pasoAuto(b, paso) {
    const eb = Store.estado.modulos.bloques[b.id] || {};
    if (paso.tipo === "problema") return resuelto(paso.slug);
    if (paso.tipo === "quiz") return Store.estado.quiz.respondidas >= paso.n;
    if (paso.tipo === "ciego") return Store.estado.ciego.resueltos.length >= paso.n;
    if (paso.tipo === "simulacro") return simsV2().length >= paso.n;
    if (paso.tipo === "recuerdo") return (eb.recuerdo || "").trim().length >= 20;
    return false;
  }
  function progresoBloque(b) {
    const eb = Store.estado.modulos.bloques[b.id] || {};
    const hechos = b.pasos.filter((p) => pasoHecho(b, p)).length;
    return { hechos, total: b.pasos.length, hecho: !!eb.hecho || hechos === b.pasos.length, seg: eb.seg || 0 };
  }
  const fraccionBloque = (b) => { const x = progresoBloque(b); return x.hecho ? 1 : x.hechos / x.total; };
  function progresoModulo(m) {
    const nucleo = m.bloques.filter((b) => b.nucleo), extra = m.bloques.filter((b) => !b.nucleo);
    const pct = nucleo.reduce((s, b) => s + fraccionBloque(b), 0) / Math.max(1, nucleo.length);
    return {
      pct, hechos: nucleo.filter((b) => progresoBloque(b).hecho).length, total: nucleo.length,
      extraHechos: extra.filter((b) => progresoBloque(b).hecho).length, extra: extra.length,
      min: nucleo.reduce((s, b) => s + b.min, 0),
    };
  }
  function progresoGlobal() {
    const nucleo = BLOQUES.filter((b) => b.nucleo);
    return nucleo.reduce((s, b) => s + fraccionBloque(b), 0) / nucleo.length;
  }
  const bloquesHechos = () => new Set(BLOQUES.filter((b) => progresoBloque(b).hecho).map((b) => b.id));
  // Ejecuta fn y avisa si con eso se completo algun bloque.
  function vigilarBloques(fn) {
    const antes = bloquesHechos();
    const r = fn();
    for (const id of bloquesHechos()) {
      if (!antes.has(id)) {
        const b = BLOQUE[id];
        toast(`<b>Bloque terminado:</b> ${esc(b.modulo.titulo)} · ${esc(b.titulo)}. <a href="#/inicio" style="color:inherit">¿Qué sigue?</a>`);
        if (Store.estado.modulos.activo && Store.estado.modulos.activo.id === id) Store.estado.modulos.activo = null;
        Store.guardar();
      }
    }
    return r;
  }

  // ---------------------------------------------------------------- notas y tema mas debil
  const notaPractica = (slug) => {
    const e = Store.estado.problemas[slug];
    return e && e.mejor ? Rubrica.calcular(e.mejor, e.rubrica).nota : null;
  };
  function notasPorTema() {
    const r = {};
    for (const t of TEMAS) {
      const notas = D.arena.filter((p) => p.tema === t).map((p) => notaPractica(p.slug)).filter((x) => x !== null);
      for (const s of simsV2()) {
        for (const x of s.problemas) if (PROB[x.slug] && PROB[x.slug].tema === t) notas.push(Rubrica.calcular(x.mejor, x.checks).nota);
      }
      r[t] = { n: notas.length, prom: notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : null };
    }
    return r;
  }
  function temaMasDebil() {
    const st = notasPorTema();
    const con = TEMAS.filter((t) => st[t].n > 0);
    if (!con.length) return null;
    return con.sort((a, b) => st[a].prom - st[b].prom || st[a].n - st[b].n)[0];
  }

  // ---------------------------------------------------------------- recomendador "que hago ahora"
  function siguientesBloques(minutos) {
    const pend = (m, nucleo = true) => m.bloques.filter((b) => b.nucleo === nucleo && !progresoBloque(b).hecho);
    const debil = temaMasDebil();
    const pctTema = Object.fromEntries(TEMAS.map((t) => [t, progresoModulo(MOD[t]).pct]));
    const orden = [...TEMAS].sort((a, b) => (a === debil ? -1 : b === debil ? 1 : pctTema[a] - pctTema[b]));
    const listas = orden.map((t) => pend(MOD[t]));
    const mitad = TEMAS.every((t) => pctTema[t] >= 0.5);
    if (TEMAS.reduce((s, t) => s + pctTema[t], 0) / 4 >= 0.5) listas.push(pend(MOD.rec));
    const intercalados = [];
    let quedan = true;
    while (quedan) {                       // una vuelta por tema: practica intercalada
      quedan = false;
      for (const l of listas) if (l.length) { intercalados.push(l.shift()); quedan = true; }
    }
    const sims = mitad ? pend(MOD.sim) : [];
    let cola = [...pend(MOD.m0)];
    cola = minutos >= 140 && sims.length ? [...cola, ...sims, ...intercalados] : [...cola, ...intercalados, ...sims];
    const extras = [...(debil ? pend(MOD[debil], false) : []), ...orden.flatMap((t) => pend(MOD[t], false)), ...pend(MOD.rec, false), ...pend(MOD.sim, false)];
    return [...new Set([...cola, ...extras])];
  }

  function recomendar(minutos) {
    const plan = [];
    let usado = 0;
    const cabe = (m) => usado + m <= minutos + 5;
    for (const r of Store.repasosPendientes().slice(0, 3)) {
      if (PROB[r.slug] && (cabe(15) || !plan.length)) { plan.push({ tipo: "repaso", slug: r.slug, min: 15 }); usado += 15; }
    }
    const act = Store.estado.modulos.activo;
    const activo = act && BLOQUE[act.id] && !progresoBloque(BLOQUE[act.id]).hecho ? BLOQUE[act.id] : null;
    if (activo) {
      const resta = Math.max(10, Math.round(activo.min - progresoBloque(activo).seg / 60));
      if (cabe(resta) || !plan.length) { plan.push({ tipo: "bloque", b: activo, min: resta, continuar: true }); usado += resta; }
    }
    const saltados = new Set();
    for (const b of siguientesBloques(minutos)) {
      if (b === activo || saltados.has(b.modulo.id)) continue;
      if (cabe(b.min)) { plan.push({ tipo: "bloque", b, min: b.min }); usado += b.min; }
      else saltados.add(b.modulo.id);       // no saltarse el orden dentro de un modulo
    }
    if (!plan.some((x) => x.tipo === "bloque") && usado < minutos) {
      const b = siguientesBloques(minutos).find((x) => x !== activo);
      if (b) { plan.push({ tipo: "bloque", b, min: minutos - usado, parcial: true }); usado = minutos; }
    }
    return { plan, usado };
  }

  // ---------------------------------------------------------------- Pomodoro (50/10)
  const pomo = { fase: "trabajo", restante: 50 * 60, corriendo: false, intervalo: null };
  function pintarPomo() {
    $("#pomo-tiempo").textContent = mmss(pomo.restante);
    $("#pomo-fase").textContent = pomo.fase === "trabajo" ? "Trabajo" : "Descanso";
    $("#pomo").classList.toggle("descanso", pomo.fase === "descanso");
    $("#pomo-btn").textContent = pomo.corriendo ? "Pausa" : "Iniciar";
  }
  function tickPomo() {
    pomo.restante--;
    if (pomo.restante <= 0) {
      pomo.fase = pomo.fase === "trabajo" ? "descanso" : "trabajo";
      pomo.restante = (pomo.fase === "trabajo" ? 50 : 10) * 60;
      toast(pomo.fase === "descanso" ? "<b>¡50 minutos!</b> Descansa 10: levántate, toma agua, no mires el código." : "<b>Fin del descanso.</b> Nuevo bloque de 50 minutos.", 15000);
    }
    pintarPomo();
  }
  $("#pomo-btn").onclick = () => {
    pomo.corriendo = !pomo.corriendo;
    if (pomo.corriendo) pomo.intervalo = setInterval(tickPomo, 1000);
    else clearInterval(pomo.intervalo);
    pintarPomo();
  };
  $("#pomo-reset").onclick = () => {
    clearInterval(pomo.intervalo);
    Object.assign(pomo, { fase: "trabajo", restante: 50 * 60, corriendo: false });
    pintarPomo();
  };
  pintarPomo();

  // ---------------------------------------------------------------- relojes globales
  const rutaActual = () => location.hash.replace(/^#\/?/, "") || "inicio";
  function rutaEnBloque(b, r) {
    if (r === "bloque/" + b.id) return true;
    return b.pasos.some((p) => (p.tipo === "problema" && r === "problema/" + p.slug) || (p.tipo === "ruta" && r.startsWith(p.ruta))
      || (p.tipo === "anim" && r.startsWith("guias/tecnicas")) || (p.tipo === "quiz" && r === "guias/quiz")
      || (p.tipo === "ciego" && r === "ciego") || (p.tipo === "simulacro" && r.startsWith("competencia")));
  }
  // Cada 5 segundos con la pagina visible, el tiempo cuenta para el bloque activo si estas en una de sus partes.
  setInterval(() => {
    if (document.visibilityState !== "visible") return;
    const act = Store.estado.modulos.activo;
    if (act && BLOQUE[act.id] && rutaEnBloque(BLOQUE[act.id], rutaActual())) {
      const eb = Store.bloque(act.id);
      eb.seg += 5;
      Store.guardar();
      if ($("#b-reloj")) $("#b-reloj").textContent = relojBloque(BLOQUE[act.id]);
    }
  }, 5000);
  const relojBloque = (b) => `⏱ ${Math.floor(progresoBloque(b).seg / 60)} de ${b.min} min`;

  function pintarCabecera() {
    const c = compActual();
    $("#nav-comp-reloj").textContent = c ? "· " + mmss(restante(c)) : "";
    if (c) revisarAvisos(c);
  }
  setInterval(pintarCabecera, 1000);
  window.addEventListener("focus", () => { if (Store.revisarSesion()) render(); });

  // ---------------------------------------------------------------- router
  function ir(ruta) { location.hash = "#/" + ruta; }
  function render() {
    limpiezas.forEach((f) => f());
    limpiezas = [];
    const ruta = rutaActual();
    const [r, a, b] = ruta.split("/");
    const nav = { bloque: "modulos", problema: "practica", ciego: "practica", reporte: "competencia" }[r] || r;
    $$(".nav a").forEach((el) => el.classList.toggle("activo", el.dataset.r === nav));
    const act = Store.estado.modulos.activo;
    if (act && BLOQUE[act.id] && r !== "bloque" && rutaEnBloque(BLOQUE[act.id], ruta)) { act.ruta = ruta; Store.guardar(); }
    window.scrollTo(0, 0);
    if (r === "inicio") vInicio();
    else if (r === "modulos") vModulos();
    else if (r === "bloque" && BLOQUE[a]) vBloque(BLOQUE[a]);
    else if (r === "practica") vPractica();
    else if (r === "problema" && PROB[a]) vProblema(PROB[a], { modo: "practica" });
    else if (r === "ciego") vCiego();
    else if (r === "competencia" && a) vProblemaCompetencia(a);
    else if (r === "competencia") vCompetencia();
    else if (r === "reporte") vReporte(+a);
    else if (r === "bitacora") vBitacora();
    else if (r === "guias") vGuias(a || "tecnicas", b);
    else if (r === "progreso") vProgreso();
    else vInicio();
    pintarCabecera();
  }
  window.addEventListener("hashchange", render);

  // ---------------------------------------------------------------- piezas compartidas
  function htmlContinuar() {
    const act = Store.estado.modulos.activo;
    if (!act || !BLOQUE[act.id]) return "";
    const b = BLOQUE[act.id], pr = progresoBloque(b);
    if (pr.hecho) return "";
    const ruta = act.ruta || "bloque/" + b.id;
    return `<div class="card continuar tema-${b.modulo.tema || "repaso"}">
      <div><div class="sub">Continúa donde quedaste</div>
        <b>${esc(b.modulo.titulo)} · ${esc(b.titulo)}</b>
        <div class="sub">${pr.hechos} de ${pr.total} pasos · ${Math.floor(pr.seg / 60)} de ${b.min} min</div></div>
      <div class="fila"><a class="btn primario" href="#/${esc(ruta)}">Continuar</a>${ruta !== "bloque/" + b.id ? `<a class="btn sec" href="#/bloque/${b.id}">Ver el bloque</a>` : ""}</div></div>`;
  }

  function htmlRepasos() {
    const rep = Store.repasosPendientes().filter((r) => PROB[r.slug]);
    if (!rep.length) return "";
    return `<div class="card"><h2>Primero, un repaso rápido</h2>
      <p class="sub">Problemas que fallaste en sesiones anteriores. Intenta resolverlos (o escribir la idea) de memoria, unos 15 minutos cada uno:
        recuperar algo después de una pausa es lo que más lo fija. Si te sale, vuelve más adelante; si no, vuelve la próxima sesión.</p>
      <ul class="repasos lista-limpia">${rep.slice(0, 5).map((r) => {
        const p = PROB[r.slug];
        return `<li>${icono(r.slug)} <a href="#/problema/${r.slug}">${esc(p.nombre)}</a> ${chipTema(p.tema)}
          <span class="sub">repaso ${r.etapa + 1} de ${Store.ETAPAS.length}</span>
          <span class="acciones-rep"><button class="btn mini" data-rep="${r.slug}" data-bien="1">Me salió</button>
          <button class="btn mini sec" data-rep="${r.slug}" data-bien="0">Todavía no</button></span></li>`;
      }).join("")}</ul>${rep.length > 5 ? `<p class="sub">y ${rep.length - 5} más.</p>` : ""}</div>`;
  }
  function conectarRepasos(despues) {
    $$("[data-rep]").forEach((b) => {
      b.onclick = () => { Store.calificarRepaso(b.dataset.rep, b.dataset.bien === "1"); despues(); };
    });
  }

  function htmlRubrica(m, checks, contexto) {
    if (!m) return "";
    const r = Rubrica.calcular(m, checks);
    const k = Rubrica.marcas(m, checks);
    const lista = m.v === "AC" ? Rubrica.CHECK_AC : Rubrica.CHECK_NO;
    const rangos = ["0 – 2", "2 – 3", "3 – 4", "4 – 5"];
    const idx = Math.max(0, r.nivel - 1);
    return `<div class="card rubrica rango-${r.nivel}">
      <div class="rubrica-cab"><div class="nota-grande">${fmt(r.nota)}<small> / 5.0</small></div>
        <div><b>Nota estimada con la rúbrica del examen</b><div class="sub">${esc(contexto)} · rango ${esc(r.rango)}</div></div></div>
      <div class="escala">${rangos.map((x, i) => `<span class="${i === idx ? "aqui" : ""}">${x}</span>`).join("")}</div>
      <b>Por qué está en este rango</b>
      <ul class="porque">${r.porque.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <b>${m.v === "AC" ? "Autoevaluación: ¿cumple?" : "Autoevaluación: marca lo que sea cierto"}</b>
      <div class="checks">${lista.map((c) => `<label><input type="checkbox" data-check="${c.id}" ${k[c.id] ? "checked" : ""}> ${esc(c.texto)}</label>`).join("")}</div>
    </div>`;
  }
  function conectarRubrica(raiz, checks, despues) {
    $$("[data-check]", raiz).forEach((cb) => {
      cb.onchange = () => { checks[cb.dataset.check] = cb.checked; Store.guardar(); despues(); };
    });
  }

  // ---------------------------------------------------------------- vista: inicio
  function vInicio() {
    const minutos = +leerLocal("arena-ada:tiempo", "60") || 60;
    const debil = temaMasDebil();
    const ult = simsV2().slice(-1)[0];
    const acs = Object.values(Store.estado.problemas).filter((e) => e.estado === "resuelto").length;
    vista.innerHTML = `
      <section class="hero">
        <div>
          <h1>Arena ADA</h1>
          <p>Entrenamiento para el examen: dividir y conquistar, backtracking, programación dinámica y voraces, en Python.</p>
          <div class="regla"><span>4 problemas</span><span>2 h 20 min</span><span>2 aceptados = 5.0</span><span>el resto es bono</span></div>
        </div>
        <nav class="puertas" aria-label="Técnicas">${TEMAS.map((t) => `<a class="puerta tema-${t}" href="#/guias/tecnicas/${t}">${emblema(t)}<span>${t === "bt" ? "Back&shy;tracking" : esc(CORTO[t])}</span></a>`).join("")}</nav>
      </section>
      ${htmlRepasos()}
      ${htmlContinuar()}
      <section class="grid2">
        <div class="card">
          <h2>¿Qué hago ahora?</h2>
          <p class="sub">¿Cuánto tiempo tienes hoy?</p>
          <div class="tiempo-opciones" id="tiempos">
            ${[[30, "30 min"], [60, "1 h"], [120, "2 h"], [180, "3 h"]].map(([m, t]) => `<button class="btn mini ${m === minutos ? "elegido" : "sec"}" data-min="${m}">${t}</button>`).join("")}
            <label class="sub">u otro: <input type="number" id="min-otro" min="15" max="600" step="5" value="${[30, 60, 120, 180].includes(minutos) ? "" : minutos}" placeholder="min"></label>
          </div>
          <ol class="reco" id="reco"></ol>
          <p class="reco-total" id="reco-total"></p>
          <p class="sub">Es una sugerencia: todo el plan está en <a href="#/modulos">Módulos</a> y puedes abrir cualquier bloque.</p>
        </div>
        <div class="card">
          <h2>Cómo vas</h2>
          <div class="tiles">
            <div class="tile"><div class="tile-n">${Math.round(100 * progresoGlobal())}<small>%</small></div><div class="tile-l">del plan núcleo</div></div>
            <div class="tile"><div class="tile-n">${acs}</div><div class="tile-l">problemas aceptados</div></div>
            <div class="tile"><div class="tile-n" style="font-size:1.15rem">${debil ? esc(CORTO[debil]) : "—"}</div><div class="tile-l">tema a reforzar${debil ? ` (${fmt(notasPorTema()[debil].prom)})` : ""}</div></div>
            <div class="tile"><div class="tile-n">${ult ? fmt(ult.nota) : "—"}${ult && ult.bono ? `<small> +${ult.bono}</small>` : ""}</div><div class="tile-l">último simulacro</div></div>
          </div>
          ${MODULOS.map((m) => { const pm = progresoModulo(m); return `<div class="barra-fila tema-${m.tema || "x"}"><span class="sub">${esc(m.titulo)}</span>
            <div class="barra-fondo"><div class="barra-lleno" style="width:${100 * pm.pct}%"></div></div><b>${Math.round(100 * pm.pct)}%</b></div>`; }).join("")}
        </div>
      </section>`;
    conectarRepasos(vInicio);
    const pintarReco = (m) => {
      escribirLocal("arena-ada:tiempo", String(m));
      const { plan, usado } = recomendar(m);
      $("#reco").innerHTML = plan.map((x) => {
        if (x.tipo === "repaso") {
          const p = PROB[x.slug];
          return `<li><div><a href="#/problema/${x.slug}">Repaso: ${esc(p.nombre)}</a> ${chipTema(p.tema)}<div class="sub">Falló en una sesión anterior: resuélvelo de memoria.</div></div><span class="min">${x.min} min</span></li>`;
        }
        const b = x.b;
        return `<li><div><a href="#/bloque/${b.id}">${esc(b.modulo.titulo)}: ${esc(b.titulo)}</a>${b.nucleo ? "" : `<span class="etq">extra</span>`}
          <div class="sub">${x.continuar ? "Continúas un bloque empezado." : x.parcial ? "Empiézalo; la Arena guarda dónde quedaste para la próxima." : esc(b.que.split(".")[0] + ".")}</div></div>
          <span class="min">${minTxt(x.min)}</span></li>`;
      }).join("");
      $("#reco-total").innerHTML = plan.length ? `Total sugerido: <b>${minTxt(usado)}</b> de ${minTxt(m)}` : "¡Terminaste todo el plan! Haz otro simulacro o repasa tu tema más débil.";
    };
    $$("#tiempos [data-min]").forEach((b) => {
      b.onclick = () => {
        $$("#tiempos [data-min]").forEach((x) => { x.classList.toggle("elegido", x === b); x.classList.toggle("sec", x !== b); });
        $("#min-otro").value = "";
        pintarReco(+b.dataset.min);
      };
    });
    $("#min-otro").onchange = (e) => {
      const m = Math.max(15, Math.min(600, +e.target.value || 60));
      $$("#tiempos [data-min]").forEach((x) => { x.classList.remove("elegido"); x.classList.add("sec"); });
      pintarReco(m);
    };
    pintarReco(minutos);
  }

  // ---------------------------------------------------------------- vista: modulos
  function vModulos() {
    const totalNucleo = BLOQUES.filter((b) => b.nucleo).reduce((s, b) => s + b.min, 0);
    vista.innerHTML = `
      <h1>Módulos</h1>
      <p>Avanza a tu ritmo: no hay fechas ni rachas. Cada bloque dura entre 40 y 60 minutos y dice qué hacer y cuándo cuenta como terminado.
        El orden es una sugerencia y nada está bloqueado. El núcleo suma unas <b>${minTxt(totalNucleo)}</b>; los bloques <span class="etq">extra</span> son para cuando quieras más.</p>
      ${htmlContinuar()}
      <details class="card principios"><summary>Cómo está diseñado el plan (y por qué funciona)</summary>
        <dl>
          <dt>Recuerdo activo</dt><dd>Antes de codificar escribes la técnica y por qué; en los repasos resuelves de memoria. Recuperar información la fija más que releerla (Roediger y Karpicke, 2006).</dd>
          <dt>Repetición espaciada</dt><dd>Lo que fallas vuelve 1, 2 y 4 sesiones después, al abrir la Arena. Repartir el estudio rinde más que concentrarlo (Cepeda y otros, 2006).</dd>
          <dt>Práctica intercalada</dt><dd>«¿Qué hago ahora?» alterna temas y el módulo de reconocimiento mezcla problemas sin decir el tema: así aprendes a elegir la técnica, que es lo que pide el examen (Rohrer y Taylor, 2007).</dd>
          <dt>Ejemplos que se desvanecen</dt><dd>La escalera de pistas va de la técnica a la idea y al esqueleto con TODOs: cada vez te dan menos y completas más (Renkl y Atkinson, 2003).</dd>
          <dt>Imagen y palabra juntas</dt><dd>Las animaciones muestran el algoritmo, el código resaltado y la explicación al mismo tiempo, paso a paso y a tu ritmo (Mayer, 2009).</dd>
          <dt>Predicción y autoexplicación</dt><dd>Las animaciones piden predecir antes de mostrar el resultado, y cada problema termina con una explicación Feynman (Chi y otros, 1994).</dd>
          <dt>Calibración</dt><dd>En los simulacros estimas la dificultad de cada problema y el reporte la compara con lo que pasó; la rúbrica te pide autoevaluarte (Dunlosky y otros, 2013).</dd>
          <dt>Sin rachas</dt><dd>El progreso se mide en bloques terminados, no en días seguidos: un día sin estudiar no borra nada.</dd>
        </dl></details>
      <div class="modulos">${MODULOS.map((m) => {
        const pm = progresoModulo(m);
        const tema = m.tema || { m0: "repaso", rec: "rec", sim: "sim" }[m.id];
        return `<section class="card modulo tema-${m.tema || "x"}">
          <div class="modulo-cab">${emblema(tema)}<div><h2>${esc(m.titulo)}</h2><div class="sub">${esc(m.descripcion)}</div></div>
            <div class="pct">${Math.round(100 * pm.pct)}%<small>${pm.hechos}/${pm.total} núcleo · ${minTxt(pm.min)}${pm.extra ? ` · extra ${pm.extraHechos}/${pm.extra}` : ""}</small></div></div>
          <ul class="bloques">${m.bloques.map((b) => {
            const pr = progresoBloque(b);
            const f = pr.hecho ? 1 : pr.hechos / pr.total;
            return `<li><a class="bloque-fila ${pr.hecho ? "hecho" : f > 0 ? "parcial" : ""} ${b.nucleo ? "" : "extra"}" href="#/bloque/${b.id}" style="--p:${Math.round(f * 100)}%">
              <span class="marca-b">${pr.hecho ? "✓" : ""}</span>
              <span><b>${esc(b.titulo)}</b>${b.nucleo ? "" : `<span class="etq">extra</span>`}<span class="sub"> · ${esc(resumenPasos(b))}</span></span>
              <span class="min">${minTxt(b.min)}</span></a></li>`;
          }).join("")}</ul></section>`;
      }).join("")}</div>`;
  }
  function resumenPasos(b) {
    const probs = b.pasos.filter((p) => p.tipo === "problema").map((p) => PROB[p.slug] ? PROB[p.slug].nombre : p.slug);
    if (probs.length) return probs.join(", ");
    return `${b.pasos.length} pasos`;
  }

  // ---------------------------------------------------------------- vista: bloque
  function vBloque(b) {
    const eb = Store.bloque(b.id);
    Store.estado.modulos.activo = progresoBloque(b).hecho ? Store.estado.modulos.activo : { id: b.id, ruta: "bloque/" + b.id };
    Store.guardar();
    const i = BLOQUES.indexOf(b);
    const ant = BLOQUES[i - 1], sig = BLOQUES[i + 1];
    const tema = b.modulo.tema;
    vista.innerHTML = `
      <a class="volver" href="#/modulos">← Módulos</a>
      <div class="bloque-cab">
        <div><div class="sub">${esc(b.modulo.titulo)} · ${b.nucleo ? "núcleo" : "extra"} · unos ${minTxt(b.min)}</div><h1>${esc(b.titulo)}</h1></div>
        <div class="bloque-reloj" id="b-reloj" title="Tiempo que llevas en este bloque (cuenta mientras estás en sus partes)">${relojBloque(b)}</div>
      </div>
      <div class="card tema-${tema || "x"}">
        <h3>Qué hacer</h3>
        <p>${esc(b.que)}</p>
        <div class="criterio"><b>Cuenta como terminado:</b> ${esc(b.terminado)}</div>
        <ul class="pasos" id="pasos">${b.pasos.map((p) => htmlPaso(b, p)).join("")}</ul>
        <div class="fila" id="b-estado"></div>
      </div>
      <div class="card"><h3>Nota para ti</h3>
        <textarea id="b-nota" rows="3" placeholder="Qué aprendiste, qué te costó, qué quieres repasar…">${esc(eb.nota)}</textarea></div>
      <div class="nav-bloques">
        ${ant ? `<a href="#/bloque/${ant.id}">← ${esc(ant.titulo)}${ant.modulo !== b.modulo ? ` (${esc(ant.modulo.titulo)})` : ""}</a>` : "<span></span>"}
        ${sig ? `<a href="#/bloque/${sig.id}">${esc(sig.titulo)}${sig.modulo !== b.modulo ? ` (${esc(sig.modulo.titulo)})` : ""} →</a>` : ""}
      </div>`;
    const pintarEstado = () => {
      const pr = progresoBloque(b);
      $("#b-estado").innerHTML = pr.hecho
        ? `<span class="ok-t"><b>✓ Bloque terminado.</b></span> ${eb.hecho ? `<button class="btn mini sec" id="b-reabrir">Reabrir</button>` : ""} <a class="btn mini" href="#/inicio">¿Qué sigue?</a>`
        : `<span class="sub">${pr.hechos} de ${pr.total} pasos.</span> <button class="btn primario" id="b-terminar">Marcar bloque terminado</button>
           <span class="sub">(si cumpliste el criterio aunque falte algún paso)</span>`;
      if ($("#b-terminar")) $("#b-terminar").onclick = () => { vigilarBloques(() => { eb.hecho = true; Store.guardar(); }); pintarEstado(); };
      if ($("#b-reabrir")) $("#b-reabrir").onclick = () => { eb.hecho = false; Store.estado.modulos.activo = { id: b.id, ruta: "bloque/" + b.id }; Store.guardar(); pintarEstado(); };
    };
    const refrescarPaso = (p) => {
      const li = $(`[data-paso="${p.id}"]`);
      const ok = pasoHecho(b, p);
      li.classList.toggle("hecho", ok);
      const cb = $("input[type=checkbox]", li);
      cb.checked = ok;
      cb.disabled = pasoAuto(b, p) && !eb.pasos[p.id];
      pintarEstado();
    };
    $$("[data-paso] > label input[type=checkbox]").forEach((cb) => {
      cb.onchange = () => {
        const p = b.pasos.find((x) => x.id === cb.closest("[data-paso]").dataset.paso);
        vigilarBloques(() => { eb.pasos[p.id] = cb.checked; Store.guardar(); });
        refrescarPaso(p);
      };
    });
    const rec = $("#b-recuerdo");
    if (rec) {
      rec.oninput = () => {
        vigilarBloques(() => { eb.recuerdo = rec.value; Store.guardar(); });
        refrescarPaso(b.pasos.find((x) => x.tipo === "recuerdo"));
      };
    }
    const pAnim = b.pasos.find((x) => x.tipo === "anim");
    if (pAnim) {
      const a = Anim.montar($("#anim-bloque"), pAnim.tema, {
        onFin: () => { vigilarBloques(() => { eb.pasos[pAnim.id] = true; Store.guardar(); }); refrescarPaso(pAnim); },
      });
      alSalir(() => a.parar());
    }
    $("#b-nota").oninput = (e) => { eb.nota = e.target.value; Store.guardar(); };
    b.pasos.forEach((p) => { const li = $(`[data-paso="${p.id}"] input[type=checkbox]`); li.disabled = pasoAuto(b, p) && !eb.pasos[p.id]; });
    pintarEstado();
  }

  function htmlPaso(b, p) {
    const ok = pasoHecho(b, p);
    let cuerpo = esc(p.texto), auto = "", extra = "";
    if (p.tipo === "problema") {
      const x = PROB[p.slug];
      cuerpo = `${icono(p.slug)} <a href="#/problema/${p.slug}">${esc(x.id)} · ${esc(x.nombre)}</a> ${chipTema(x.tema)} ${chipDif(x.dificultad)}`;
      auto = "Se marca solo cuando el juez lo acepta. Si cumpliste el criterio sin aceptarlo, márcalo tú.";
    } else if (p.tipo === "ruta") {
      cuerpo = `${esc(p.texto)} · <a href="#/${p.ruta}">abrir</a>`;
    } else if (p.tipo === "anim") {
      auto = "Se marca solo al llegar al último paso.";
      extra = `<div class="contenido" id="anim-bloque"></div>`;
    } else if (p.tipo === "recuerdo") {
      auto = "Se marca solo al escribir 20 caracteres o más. Sin mirar la guía.";
      extra = `<div class="contenido"><textarea id="b-recuerdo" rows="2" placeholder="Ej.: Cuando… porque… Complejidad…">${esc((Store.estado.modulos.bloques[b.id] || {}).recuerdo)}</textarea></div>`;
    } else if (p.tipo === "quiz") {
      cuerpo = `<a href="#/guias/quiz">${esc(p.texto)}</a>`;
      auto = `Llevas ${Store.estado.quiz.respondidas} respuestas en total.`;
    } else if (p.tipo === "ciego") {
      cuerpo = `<a href="#/ciego">${esc(p.texto)}</a>`;
      auto = `Llevas ${Store.estado.ciego.resueltos.length} aceptados a ciegas.`;
    } else if (p.tipo === "simulacro") {
      cuerpo = `<a href="#/competencia">${esc(p.texto)}</a>`;
      auto = `Simulacros terminados: ${simsV2().length}.`;
    }
    return `<li class="paso ${ok ? "hecho" : ""}" data-paso="${p.id}"><label><input type="checkbox" ${ok ? "checked" : ""}>
      <span>${cuerpo}${auto ? `<span class="auto">${esc(auto)}</span>` : ""}</span></label>${extra}</li>`;
  }

  // ---------------------------------------------------------------- vista: practica
  const filtros = { tema: "", dif: "", conj: "nucleo", fuera: false };
  function vPractica() {
    const opciones = (sel, pares) => pares.map(([v, t]) => `<option value="${v}" ${sel === v ? "selected" : ""}>${esc(t)}</option>`).join("");
    const nFuera = [...D.arena, ...D.biblioteca].filter((p) => p.fuera_examen).length;
    vista.innerHTML = `
      <h1>Práctica</h1>
      <div class="card filtros">
        <label>Tema <select id="f-tema">${opciones(filtros.tema, [["", "Los 4 del examen"], ...TEMAS.map((t) => [t, NOMBRE_TEMA[t]]), ["repaso", "Repaso / lectura"]])}</select></label>
        <label>Dificultad <select id="f-dif">${opciones(filtros.dif, [["", "Todas"], ...Object.entries(DIF)])}</select></label>
        <label>Conjunto <select id="f-conj">${opciones(filtros.conj, [["nucleo", "Núcleo"], ["reserva", "Reserva para simulacros"], ["todo", "Núcleo + reserva"], ["biblioteca", "Catálogo completo (sin juez)"]])}</select></label>
        ${nFuera ? `<label><input type="checkbox" id="f-fuera" ${filtros.fuera ? "checked" : ""}> Mostrar los ${nFuera} fuera del examen</label>` : ""}
        <a class="btn" href="#/ciego" style="margin-left:auto">Práctica a ciegas →</a>
      </div>
      <div id="lista"></div>`;
    const pintar = () => {
      const f = (p) => (filtros.tema ? p.tema === filtros.tema : TEMAS.includes(p.tema) || p.tema === "repaso" || p.fuera_examen)
        && (!filtros.dif || p.dificultad === filtros.dif) && (filtros.fuera || !p.fuera_examen);
      if (filtros.conj === "biblioteca") {
        const ps = D.biblioteca.filter(f);
        $("#lista").innerHTML = `<p class="sub">Estos ${ps.length} problemas no tienen casos de prueba en la Arena: úsalos como lectura extra o para el quiz.</p>
          <ul class="problemas">${ps.map((p) => `<li class="prob tema-${p.tema}"><div><b>${esc(p.id)}</b> · ${esc(p.nombre)} ${chipTema(p.tema)} ${chipDif(p.dificultad)}
          ${p.fuera_examen ? `<span class="etq">fuera del examen</span>` : ""}<div class="sub">${esc(p.resumen)}</div></div>
          <div class="enlaces"><a href="${esc(p.enlace)}" target="_blank" rel="noopener">Enunciado</a>${p.enunciado_curso ? ` · <a href="${esc(p.enunciado_curso)}" target="_blank" rel="noopener">PDF del curso</a>` : ""}</div></li>`).join("")}</ul>`;
        return;
      }
      const ps = D.arena.filter((p) => f(p) && (filtros.conj === "todo" || p.conjunto === filtros.conj));
      const orden = { facil: 0, medio: 1, dificil: 2 };
      ps.sort((a, b) => orden[a.dificultad] - orden[b.dificultad] || a.tema.localeCompare(b.tema));
      $("#lista").innerHTML = (filtros.conj === "reserva"
        ? `<div class="card aviso">La reserva se usa en los simulacros. Si la practicas ahora, los simulacros tendrán menos problemas nuevos para ti.</div>` : "")
        + `<ul class="problemas">${ps.map((p) => {
          const e = Store.estado.problemas[p.slug] || {};
          const n = notaPractica(p.slug);
          return `<li class="prob tema-${p.tema}" data-ir="${p.slug}">
            <div>${icono(p.slug)} <b>${esc(p.id)}</b> · ${esc(p.nombre)} ${chipTema(p.tema)} ${chipDif(p.dificultad)}
              ${p.fuera_examen ? `<span class="etq">fuera del examen</span>` : ""}<div class="sub">${esc(p.resumen)}</div></div>
            <div class="meta">${e.intentos ? `${e.intentos} envío(s)` : ""}${n !== null ? ` · nota ${fmt(n)}` : ""}${e.mejorSeg ? ` · ${mmss(e.mejorSeg)}` : ""}</div></li>`;
        }).join("")}</ul>`;
      $$("[data-ir]").forEach((li) => { li.onclick = () => ir("problema/" + li.dataset.ir); });
    };
    $("#f-tema").onchange = (e) => { filtros.tema = e.target.value; pintar(); };
    $("#f-dif").onchange = (e) => { filtros.dif = e.target.value; pintar(); };
    $("#f-conj").onchange = (e) => { filtros.conj = e.target.value; pintar(); };
    if ($("#f-fuera")) $("#f-fuera").onchange = (e) => { filtros.fuera = e.target.checked; pintar(); };
    pintar();
  }

  // ---------------------------------------------------------------- practica a ciegas
  function elegirCiego(excluir = null) {
    const ok = (p) => TEMAS.includes(p.tema) && !p.fuera_examen && p.slug !== excluir && !resuelto(p.slug);
    const intentos = [
      (p) => ok(p) && p.conjunto === "nucleo" && !(Store.estado.problemas[p.slug] || {}).intentos,
      (p) => ok(p) && p.conjunto === "nucleo",
      (p) => ok(p),
      (p) => TEMAS.includes(p.tema) && p.slug !== excluir,
    ];
    let pool = [], k = 0;
    while (!pool.length && k < intentos.length) { pool = D.arena.filter(intentos[k]); k++; }
    return barajar(pool)[0].slug;
  }
  function vCiego() {
    const cg = Store.estado.ciego;
    if (!cg.actual || !PROB[cg.actual] || resuelto(cg.actual)) { cg.actual = elegirCiego(); Store.guardar(); }
    vProblema(PROB[cg.actual], { modo: "ciego" });
  }

  // ---------------------------------------------------------------- vista: problema
  // ctx.modo: "practica" | "ciego" | "competencia" (con ctx.letra)
  function vProblema(p, ctx) {
    const modo = ctx.modo, enComp = modo === "competencia", ciego = modo === "ciego";
    const ep = Store.problema(p.slug);
    const comp = enComp ? compActual() : null;
    const xc = comp ? comp.problemas.find((y) => y.letra === ctx.letra) : null;
    const ejemplo = p.casos.find((c) => c.ejemplo);
    const volver = enComp ? `<a class="volver" href="#/competencia">← Tablero del examen</a>` : `<a class="volver" href="#/practica">← Práctica</a>`;
    const plantillas = `<option value="">Insertar plantilla…</option>
      <optgroup label="Lectura de entrada">${GUIAS.lectura.patrones.map((x, i) => `<option value="l${i}">${esc(x.nombre)}</option>`).join("")}</optgroup>
      ${enComp ? "" : `<optgroup label="Esqueletos de técnica">${ESQUELETOS.map((x, i) => `<option value="e${i}">${esc(x.nombre.replace("Esqueleto de la técnica: ", ""))}</option>`).join("")}</optgroup>`}`;
    vista.innerHTML = `
      <div class="prob-cab">
        <div>
          ${volver}
          <h1>${enComp ? `${ctx.letra}. ` : ""}${esc(p.nombre)}</h1>
          <div>${enComp ? `<span class="sub">Hay un problema de cada tema: reconocer la técnica es parte del examen. Sin pistas.</span>`
            : ciego ? `<span class="sub">Práctica a ciegas: el tema y la dificultad están ocultos. Decide tú la técnica.</span>
                <button class="btn mini sec" id="c-saltar">Otro problema</button> <button class="btn mini sec" id="c-revelar">Revelar el tema</button> <span id="c-tema"></span>`
            : `<b>${esc(p.id)}</b> ${chipTema(p.tema)} ${chipDif(p.dificultad)}
              <span class="sub">${p.conjunto === "reserva" ? "reserva" : "núcleo"}${p.semestres.length ? ` · apareció en ${esc(p.semestres.join(", "))}` : ""}</span>`}</div>
        </div>
        ${enComp ? `<div class="reloj-grande" id="reloj-p">${mmss(restante(comp))}</div>` : `<div class="crono" id="crono">
          <span id="crono-t">00:00</span>
          <button class="btn mini" id="crono-btn">Iniciar cronómetro</button>
          <button class="btn mini sec" id="crono-reset" aria-label="Reiniciar cronómetro">↺</button>
        </div>`}
      </div>
      <div class="grid-prob">
        <div class="col-izq">
          <div class="card">
            <h3>Resumen</h3>
            <p>${esc(p.resumen)}</p>
            <p class="enlaces">Enunciado completo:
              ${p.enunciado_curso ? `<a href="${esc(p.enunciado_curso)}" target="_blank" rel="noopener">PDF de la tarea (formato del curso)</a> · ` : ""}
              <a href="${esc(p.enlace)}" target="_blank" rel="noopener">${esc(p.fuente)} oficial</a></p>
            ${p.comparador !== "exacto" ? `<p class="sub">Salida con decimales: el juez acepta diferencias de hasta ${esc(p.comparador.split(":")[1])}.</p>` : ""}
            <div class="io">
              <div><h4>Entrada de ejemplo</h4><pre>${esc(ejemplo.entrada)}</pre></div>
              <div><h4>Salida de ejemplo</h4><pre>${esc(ejemplo.salida)}</pre></div>
            </div>
          </div>
          <div class="card">
            <h3>Recuerdo activo <span class="sub">(antes de codificar)</span></h3>
            <p class="sub">En 2 líneas: ¿qué técnica vas a usar y por qué?</p>
            <textarea id="recuerdo" rows="3" placeholder="Ej.: Búsqueda binaria sobre la respuesta, porque «¿alcanza con X?» es monótono y X llega a 10^9.">${esc(ep.recuerdo)}</textarea>
          </div>
          ${enComp || ciego ? "" : `<div class="card"><h3>Escalera de pistas</h3><p class="sub">Cada escalón te da un poco más. Sube solo si llevas un rato atascada.</p><div id="pistas"></div></div>`}
          <div class="card">
            <h3>Explicación Feynman</h3>
            <p class="sub">Explica la solución con tus palabras, como si se la contaras a alguien que no sabe programar.</p>
            <textarea id="feynman" rows="4" placeholder="La idea es…">${esc(ep.feynman)}</textarea>
          </div>
        </div>
        <div class="col-der">
          <div class="card editor-card">
            <div class="editor-barra">
              <b>solucion.py</b>
              <span class="sub" id="estado-py">Python se carga la primera vez (unos segundos)</span>
              <select id="insertar" aria-label="Insertar plantilla">${plantillas}</select>
            </div>
            <div id="bloqueo" class="bloqueo">Escribe tu recuerdo activo (técnica + por qué) para desbloquear el editor.</div>
            <textarea id="codigo"></textarea>
            <div class="acciones">
              <button class="btn" id="b-ejemplo">Probar ejemplo</button>
              <button class="btn primario" id="b-enviar">Enviar (todos los casos)</button>
              <button class="btn sec" id="b-propia">Mi propia entrada…</button>
            </div>
            <div id="propia" class="oculto">
              <textarea id="entrada-propia" rows="4" placeholder="Pega aquí una entrada"></textarea>
              <button class="btn mini" id="b-correr-propia">Ejecutar</button>
              <pre id="salida-propia" class="salida"></pre>
            </div>
          </div>
          <div id="veredicto"></div>
          <div id="rubrica"></div>
          <div id="resultados"></div>
          <div id="bitacora-form"></div>
        </div>
      </div>`;

    // --- cronometro (practica) o tiempo dedicado al problema (examen)
    let cronoSeg = 0, cronoInt = null;
    if (enComp) {
      comp.abierto = ctx.letra;
      let tick = 0;
      const t = setInterval(() => {
        const c = compActual();
        if (!c) { clearInterval(t); return; }
        const r = restante(c);
        if ($("#reloj-p")) { $("#reloj-p").textContent = mmss(r); $("#reloj-p").classList.toggle("poco", r < 15 * 60); }
        if (r <= 0) { clearInterval(t); const i = terminarCompetencia(); ir("reporte/" + i); return; }
        if (document.visibilityState === "visible") { xc.seg = (xc.seg || 0) + 1; tick++; if (tick % 5 === 0) Store.guardar(); }
      }, 1000);
      alSalir(() => { clearInterval(t); Store.guardar(); });
    } else {
      const pintarCrono = () => { $("#crono-t").textContent = mmss(cronoSeg); };
      $("#crono-btn").onclick = () => {
        if (cronoInt) { clearInterval(cronoInt); cronoInt = null; $("#crono-btn").textContent = "Continuar"; }
        else { cronoInt = setInterval(() => { cronoSeg++; pintarCrono(); }, 1000); $("#crono-btn").textContent = "Pausa"; }
      };
      $("#crono-reset").onclick = () => { cronoSeg = 0; pintarCrono(); };
      alSalir(() => clearInterval(cronoInt));
    }
    if (ciego) {
      $("#c-saltar").onclick = () => { Store.estado.ciego.actual = elegirCiego(p.slug); Store.guardar(); vCiego(); };
      $("#c-revelar").onclick = () => { $("#c-tema").innerHTML = `${chipTema(p.tema)} ${chipDif(p.dificultad)}`; };
    }

    // --- editor
    const borrador = Store.borrador(p.slug);
    $("#codigo").value = borrador ?? "import sys\n\n\ndef solve():\n    ans = 0\n    # TODO: la logica del algoritmo\n    return ans\n\n\ndef main():\n    linea = sys.stdin.readline().strip()\n    # TODO: leer la entrada\n    print(solve())\n\n\nif __name__ == \"__main__\":\n    main()\n";
    const cm = CodeMirror.fromTextArea($("#codigo"), {
      mode: "python", lineNumbers: true, indentUnit: 4, tabSize: 4, matchBrackets: true,
      autoCloseBrackets: true, styleActiveLine: true, viewportMargin: Infinity,
      extraKeys: {
        Tab: (c) => (c.somethingSelected() ? c.indentSelection("add") : c.replaceSelection("    ", "end")),
        "Shift-Tab": (c) => c.indentSelection("subtract"),
        "Ctrl-Enter": () => enviar(true),
      },
    });
    let guardarT = null;
    cm.on("change", () => { clearTimeout(guardarT); guardarT = setTimeout(() => Store.borrador(p.slug, cm.getValue()), 400); });
    alSalir(() => Store.borrador(p.slug, cm.getValue()));

    const actualizarBloqueo = () => {
      const ok = $("#recuerdo").value.trim().length >= 20;
      cm.setOption("readOnly", ok ? false : "nocursor");
      $("#bloqueo").classList.toggle("oculto", ok);
      $(".editor-card").classList.toggle("bloqueado", !ok);
      ["#b-ejemplo", "#b-enviar", "#b-propia"].forEach((s) => { $(s).disabled = !ok; });
    };
    $("#recuerdo").oninput = () => { ep.recuerdo = $("#recuerdo").value; Store.guardar(); actualizarBloqueo(); };
    $("#feynman").oninput = () => { ep.feynman = $("#feynman").value; Store.guardar(); };
    actualizarBloqueo();

    $("#insertar").onchange = (e) => {
      const v = e.target.value;
      const x = v[0] === "l" ? GUIAS.lectura.patrones[+v.slice(1)] : v[0] === "e" ? ESQUELETOS[+v.slice(1)] : null;
      if (x && (!cm.getValue().trim() || confirm("¿Reemplazar el código actual por la plantilla?"))) cm.setValue(x.codigo + "\n");
      e.target.value = "";
    };

    // --- escalera de pistas (solo practica): ejemplo resuelto que se va desvaneciendo
    if (modo === "practica") {
      const pintarPistas = () => {
        const n = ep.pistas || 0;
        const nombres = ["Pista 1 · Técnica", "Pista 2 · Idea clave", "Pista 3 · Esqueleto con TODOs"];
        let html = "";
        for (let k = 0; k < Math.min(n, 3); k++) {
          html += `<div class="pista"><b>${nombres[k]}</b>${k < 2 ? `<p>${esc(p.pistas[k])}</p>`
            : `<pre class="codigo-pista">${esc(p.esqueleto)}</pre><button class="btn mini" id="usar-esq">Copiar al editor</button>`}</div>`;
        }
        if (n < 3) html += `<button class="btn sec" id="sig-pista">Ver ${nombres[n]}</button> `;
        html += ep.vioSolucion
          ? `<div class="pista"><b>Solución completa</b><pre class="codigo-pista">${esc(p.solucion)}</pre></div>`
          : `<button class="btn link" id="ver-sol">Ver la solución completa…</button>`;
        $("#pistas").innerHTML = html;
        if ($("#sig-pista")) $("#sig-pista").onclick = () => { ep.pistas = n + 1; Store.guardar(); pintarPistas(); };
        if ($("#usar-esq")) $("#usar-esq").onclick = () => { if (confirm("¿Reemplazar tu código por el esqueleto?")) cm.setValue(p.esqueleto); };
        if ($("#ver-sol")) $("#ver-sol").onclick = () => {
          if (confirm("¿Segura? Ver la solución completa le quita valor al ejercicio. Intenta antes la pista 3 y anota en la bitácora qué te bloqueó.")) {
            ep.vioSolucion = true; Store.guardar(); pintarPistas();
          }
        };
      };
      pintarPistas();
    }

    // --- rubrica: nota estimada a partir del mejor envio
    const pintarRubrica = () => {
      const m = enComp ? xc.mejor : ep.mejor;
      if (enComp && !xc.checks) xc.checks = {};
      const checks = enComp ? xc.checks : ep.rubrica;
      const contexto = m ? `según tu mejor envío (${m.pasados} de ${m.total} casos)` : "";
      $("#rubrica").innerHTML = htmlRubrica(m, checks, contexto);
      conectarRubrica($("#rubrica"), checks, pintarRubrica);
    };
    pintarRubrica();

    // --- juez
    const estadoPy = $("#estado-py");
    Juez.preparar().then(() => { estadoPy.textContent = "Python listo"; }).catch((e) => { estadoPy.textContent = "Error: " + e.message; });

    function pintarResultados(res, casos) {
      $("#resultados").innerHTML = `<div class="card tabla-scroll"><table class="tabla-casos"><thead><tr><th>Caso</th><th>Veredicto</th><th>Tiempo</th></tr></thead><tbody>
        ${casos.map((c, i) => {
          const r = res[i];
          return `<tr class="${r ? "v-" + r.veredicto : ""}" data-caso="${i}"><td>${esc(c.nombre)}</td>
            <td>${r ? `<span class="badge b-${r.veredicto}">${esc(Juez.NOMBRES[r.veredicto])}</span>` : `<span class="sub">en espera…</span>`}</td>
            <td>${r ? r.segundos.toFixed(2) + " s" : ""}</td></tr>
            <tr class="detalle oculto" id="det-${i}"><td colspan="3"></td></tr>`;
        }).join("")}</tbody></table><p class="sub">Haz clic en un caso para ver la entrada, la salida esperada y la tuya.</p></div>`;
      $$("tr[data-caso]").forEach((tr) => {
        tr.onclick = () => {
          const i = +tr.dataset.caso, r = res[i];
          if (!r) return;
          const det = $("#det-" + i);
          const corto = (s) => (s.length > 3000 ? s.slice(0, 3000) + "\n… (recortado)" : s);
          det.firstElementChild.innerHTML = `
            ${r.linea ? `<p class="sub">Primera línea distinta: ${r.linea}</p>` : ""}
            ${r.error ? `<h4>Error</h4><pre class="err">${esc(r.error)}</pre>` : ""}
            <div class="io3"><div><h4>Entrada</h4><pre>${esc(corto(r.entrada))}</pre></div>
            <div><h4>Esperada</h4><pre>${esc(corto(r.esperada))}</pre></div>
            <div><h4>Tu salida</h4><pre>${esc(corto(r.obtenida))}</pre></div></div>`;
          det.classList.toggle("oculto");
        };
      });
    }

    let ocupado = false;
    async function enviar(soloEjemplo) {
      if (ocupado || $("#b-enviar").disabled) return;
      ocupado = true;
      const casos = soloEjemplo ? p.casos.filter((c) => c.ejemplo) : p.casos;
      const res = [];
      $("#veredicto").innerHTML = `<div class="card veredicto corriendo">Ejecutando ${casos.length} caso(s)…</div>`;
      $("#bitacora-form").innerHTML = "";
      pintarResultados(res, casos);
      let r;
      try {
        r = await Juez.juzgar(cm.getValue(), casos, {
          limite: p.limite, comparador: p.comparador,
          onCaso: (i, x) => { res[i] = x; pintarResultados(res, casos); },
        });
      } catch (e) {
        $("#veredicto").innerHTML = `<div class="card veredicto v-RTE">No se pudo ejecutar: ${esc(e.message)}</div>`;
        ocupado = false;
        return;
      }
      if (!$("#veredicto")) { ocupado = false; return; }   // cambiaste de vista mientras corria
      if (r.veredicto === "CE") $("#resultados").innerHTML = "";
      const avisoBreak = r.breaks.length
        ? `<div class="aviso-break">⚠ Tu código usa <code>break</code> en la(s) línea(s) ${r.breaks.join(", ")}. En el curso no está permitido: termina el ciclo con la condición del while o con una bandera.</div>` : "";
      const okTodos = r.casos.length && r.casos.every((c) => c.veredicto === "AC");
      $("#veredicto").innerHTML = `<div class="card veredicto v-${r.veredicto}">
        <div class="v-titulo">${soloEjemplo ? "Ejemplo: " : ""}${esc(Juez.NOMBRES[r.veredicto])}</div>
        ${r.veredicto === "CE" ? `<pre class="err">${esc(r.detalle)}</pre>` : ""}
        ${r.veredicto === "BRK" && okTodos ? `<p>La salida es correcta, pero el envío no cuenta como aceptado.</p>` : ""}
        ${avisoBreak}</div>`;
      if (!soloEjemplo) {
        const resumen = Rubrica.resumir(r, p.casos.length);
        const segundos = enComp ? null : (cronoSeg || null);
        vigilarBloques(() => {
          Store.registrarEnvio(p.slug, resumen, segundos, modo);
          if (enComp) registrarEnvioCompetencia(ctx.letra, resumen);
          if (ciego && r.veredicto === "AC") {
            const cg = Store.estado.ciego;
            if (!cg.resueltos.includes(p.slug)) cg.resueltos.push(p.slug);
            cg.actual = null;
            Store.guardar();
          }
        });
        pintarRubrica();
        if (r.veredicto === "AC") {
          clearInterval(cronoInt); cronoInt = null;
          const extra = ciego
            ? `<p>Era ${chipTema(p.tema)} ${chipDif(p.dificultad)}. ¿Lo reconociste? Compáralo con tu recuerdo activo.</p><a class="btn" href="#/ciego">Siguiente a ciegas →</a>`
            : enComp ? `<p>Cuenta para el examen. <a href="#/competencia">Volver al tablero</a></p>`
            : `<p>¡Bien! Ahora escribe tu explicación Feynman.${cronoSeg ? ` Tiempo: ${mmss(cronoSeg)}.` : ""}</p>`;
          $("#veredicto").firstElementChild.insertAdjacentHTML("beforeend", extra);
          if (!enComp) $("#feynman").focus();
        } else if (r.veredicto !== "CE") {
          formularioBitacora(p, r, modo);
        }
      }
      ocupado = false;
    }
    $("#b-ejemplo").onclick = () => enviar(true);
    $("#b-enviar").onclick = () => enviar(false);
    $("#b-propia").onclick = () => $("#propia").classList.toggle("oculto");
    $("#b-correr-propia").onclick = async () => {
      $("#salida-propia").textContent = "Ejecutando…";
      try {
        const r = await Juez.ejecutar(cm.getValue(), $("#entrada-propia").value, p.limite);
        $("#salida-propia").textContent = r.tle ? `Tiempo excedido (${p.limite} s)` : (r.salida + (r.error ? "\n" + r.error : "")) || "(sin salida)";
      } catch (e) {
        $("#salida-propia").textContent = "Error: " + e.message;
      }
    };
  }

  function formularioBitacora(p, r, modo) {
    const sugerida = { TLE: "tiempo", BRK: "break", PE: "formato" }[r.veredicto]
      || (r.casos.some((c) => c.error && /IndexError|ValueError/.test(c.error)) ? "lectura" : "");
    const falloEjemplo = r.casos.some((c) => c.ejemplo && c.veredicto !== "AC");
    $("#bitacora-form").innerHTML = `<div class="card bitacora-form">
      <h3>Bitácora: ¿qué falló?</h3>
      <p class="sub">${falloEjemplo ? "Falló el ejemplo del enunciado." : "El ejemplo pasa, pero falla un caso adicional: piensa en casos borde."}
        Este problema volverá en tus repasos: 1, 2 y 4 sesiones después.</p>
      <div class="causas">${Object.entries(CAUSAS).map(([k, v]) => `<label><input type="checkbox" value="${k}" ${k === sugerida ? "checked" : ""}> ${v}</label>`).join("")}</div>
      <textarea id="nota-bitacora" rows="2" placeholder="Nota corta: qué pasó y qué harás distinto"></textarea>
      <button class="btn" id="guardar-bitacora">Guardar en la bitácora</button>
    </div>`;
    $("#guardar-bitacora").onclick = () => {
      const causas = $$(".causas input:checked").map((x) => x.value);
      Store.agregarBitacora({ slug: p.slug, veredicto: r.veredicto, causas, nota: $("#nota-bitacora").value, modo });
      $("#bitacora-form").innerHTML = `<div class="card sub">Guardado en la bitácora.</div>`;
    };
  }

  // ---------------------------------------------------------------- competencia (examen simulado)
  const simsV2 = () => Store.estado.simulacros.filter((s) => s.version === 2);
  function compActual() {
    const c = Store.estado.competencia;
    return c && c.version === 2 && !c.fin ? c : null;
  }
  const restante = (c) => c.duracion - (Date.now() - c.inicio) / 1000;
  const notaProblemaComp = (x) => Rubrica.calcular(x.mejor, x.checks || {}).nota;
  function notaExamen(c) {
    return Rubrica.examen(c.problemas.map(notaProblemaComp), c.problemas.filter((x) => x.resuelto).length);
  }
  function estimar(senales = {}) {
    const pos = GUIAS.dificultad.positivas.filter((s) => senales[s.id]).length;
    const neg = GUIAS.dificultad.negativas.filter((s) => senales[s.id]).length;
    if (!pos && !neg) return null;
    const v = pos - neg;
    return v >= 2 ? "facil" : v >= 0 ? "medio" : "dificil";
  }

  function elegirProblemas() {
    const difs = barajar(["facil", "medio", "medio", "dificil"]);
    return barajar(TEMAS).map((tema, k) => {
      const pool = D.arena.filter((p) => p.tema === tema && !p.fuera_examen);
      const prefs = [
        (p) => p.dificultad === difs[k] && !resuelto(p.slug) && p.conjunto === "reserva",
        (p) => p.dificultad === difs[k] && !resuelto(p.slug),
        (p) => p.dificultad === difs[k],
        (p) => !resuelto(p.slug),
        () => true,
      ];
      let candidatos = [], f = 0;
      while (!candidatos.length && f < prefs.length) { candidatos = pool.filter(prefs[f]); f++; }
      return barajar(candidatos)[0].slug;
    });
  }

  function empezarCompetencia(duracionSeg, slugs = null) {
    const letras = "ABCD";
    Store.estado.competencia = {
      version: 2, inicio: Date.now(), duracion: duracionSeg, fin: null, fase: "lectura", lecturaSeg: null, abierto: null, avisos: [],
      problemas: (slugs || elegirProblemas()).map((slug, i) => ({ letra: letras[i], slug, intentos: 0, resuelto: false, minuto: null, mejor: null, estim: null, senales: {}, seg: 0, checks: {} })),
      orden: [...letras.slice(0, (slugs || [1, 2, 3, 4]).length)],
    };
    Store.guardar();
  }

  function vCompetencia() {
    const c = Store.estado.competencia;
    if (c && c.version === 2 && !c.fin && restante(c) <= 0) { const i = terminarCompetencia(); return ir("reporte/" + i); }
    const actual = compActual();
    if (!actual) return vCompInicio();
    if (actual.fase === "lectura") return vCompLectura(actual);
    return vCompTablero(actual);
  }

  function vCompInicio() {
    const sims = Store.estado.simulacros;
    vista.innerHTML = `
      <h1>Competencia</h1>
      <div class="grid2">
        <div class="card">
          <h2>Simulacro del examen</h2>
          <p><b>4 problemas</b>, uno de cada tema (sin decir cuál), con dificultades mezcladas: 1 fácil, 2 medios y 1 difícil. Tienes <b>2 horas 20 minutos</b> y no hay pistas.</p>
          <p><b>Calificación.</b> Cada problema se califica con la rúbrica. La nota del examen es el promedio de tus <b>2 mejores</b> problemas:
            <b>2 aceptados = 5.0</b>. Cada aceptado adicional se muestra aparte como <b>bono</b>. Meta mínima: 4.0 en dos problemas.</p>
          <p><b>Primero se lee.</b> El examen empieza con una fase de lectura: lees los 4, marcas señales de dificultad y los ordenas de fácil a difícil.</p>
          <label>Duración <select id="duracion"><option value="140">2 h 20 min (como el examen)</option><option value="70">1 h 10 min (medio examen)</option></select></label>
          <button class="btn primario" id="empezar">Empezar simulacro</button>
        </div>
        <div class="card">
          <h3>Rúbrica de cada problema</h3>
          <table class="tablero">
            <tr><td><b>4.0 – 5.0</b></td><td>Aceptado. Dentro del rango: técnica adecuada, complejidad razonable, código limpio.</td></tr>
            <tr><td><b>3.0 – 4.0</b></td><td>No aceptado pero bien encaminado: técnica correcta con un error (tiempo, un caso borde, se acabó el tiempo).</td></tr>
            <tr><td><b>2.0 – 3.0</b></td><td>Código razonable que muestra comprensión del tema.</td></tr>
            <tr><td><b>0 – 2.0</b></td><td>No se ve comprensión. La lectura de datos bien hecha suma; mal hecha, resta.</td></tr>
          </table>
          <h3 style="margin-top:1rem">Estrategia</h3>
          <ol>${GUIAS.dificultad.estrategia.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
        </div>
      </div>
      <h2>Historial</h2>
      ${sims.length ? `<div class="card tabla-scroll"><table class="tablero"><thead><tr><th>Fecha</th><th>Nota</th><th>Bono</th><th>Aceptados</th><th>Problemas</th><th></th></tr></thead><tbody>
        ${sims.map((s, i) => [s, i]).reverse().map(([s, i]) => s.version === 2
          ? `<tr class="${s.nota >= 4 ? "ok" : "mal"}"><td>${new Date(s.inicio).toLocaleString()}</td><td><b>${fmt(s.nota)}</b></td><td>${s.bono ? "+" + s.bono : "—"}</td><td>${s.acs}/4</td>
            <td>${s.problemas.map((x) => `<span class="${x.resuelto ? "ok-t" : "mal-t"}">${esc(PROB[x.slug] ? PROB[x.slug].nombre : x.slug)}</span>`).join(", ")}</td><td><a href="#/reporte/${i}">Reporte</a></td></tr>`
          : `<tr><td>${new Date(s.inicio).toLocaleString()}</td><td colspan="5" class="sub">Formato anterior (5 problemas en 3 horas): ${s.resueltos}/5 resueltos.</td></tr>`).join("")}
        </tbody></table></div>` : `<p class="sub">Aún no has hecho simulacros.</p>`}`;
    $("#empezar").onclick = () => { empezarCompetencia(+$("#duracion").value * 60); vCompetencia(); };
  }

  function relojComp(c, sel) {
    const t = setInterval(() => {
      const r = restante(c);
      if ($(sel)) { $(sel).textContent = mmss(r); $(sel).classList.toggle("poco", r < 15 * 60); }
      if (r <= 0) { clearInterval(t); const i = terminarCompetencia(); ir("reporte/" + i); }
    }, 1000);
    alSalir(() => clearInterval(t));
  }

  function vCompLectura(c) {
    const g = GUIAS.dificultad;
    const transcurrido = () => (Date.now() - c.inicio) / 1000;
    vista.innerHTML = `
      <div class="comp-cab"><div><h1>Examen · fase de lectura</h1>
        <p class="sub">Lee los 4 problemas (unos 10 minutos), marca las señales y ordénalos de más fácil a más difícil. El reloj del examen ya corre.</p></div>
        <div class="reloj-grande" id="reloj">${mmss(restante(c))}</div></div>
      <div class="card aviso"><b>Recuerda:</b> ${esc(g.intro)}</div>
      <div class="lect-grid">${c.problemas.map((x) => {
        const p = PROB[x.slug], ej = p.casos.find((k) => k.ejemplo);
        return `<div class="card lect" data-letra="${x.letra}">
          <h3><span class="letra">${x.letra}</span> ${esc(p.nombre)}</h3>
          <p>${esc(p.resumen)}</p>
          <p class="enlaces">${p.enunciado_curso ? `<a href="${esc(p.enunciado_curso)}" target="_blank" rel="noopener">PDF del curso</a> · ` : ""}<a href="${esc(p.enlace)}" target="_blank" rel="noopener">enunciado oficial</a></p>
          <details><summary class="sub">Ejemplo de entrada y salida</summary><div class="io"><pre>${esc(ej.entrada)}</pre><pre>${esc(ej.salida)}</pre></div></details>
          <div class="senales-check">
            ${g.positivas.map((s) => `<label><input type="checkbox" data-s="${s.id}" ${x.senales[s.id] ? "checked" : ""}> ${esc(s.texto)}</label>`).join("")}
            ${g.negativas.map((s) => `<label class="neg"><input type="checkbox" data-s="${s.id}" ${x.senales[s.id] ? "checked" : ""}> ${esc(s.texto)}</label>`).join("")}
          </div>
          <div>Estimación: <span class="estim" data-estim="${x.letra}"></span></div>
        </div>`;
      }).join("")}</div>
      <div class="card"><h3>Tu orden para resolver</h3>
        <p class="sub">Empieza por el más fácil: el primer aceptado da calma y tiempo. Puedes reordenar con las flechas.</p>
        <ol class="orden-lista" id="orden"></ol>
        <div class="fila"><button class="btn sec" id="auto-orden">Ordenar según mis señales</button>
          <button class="btn primario" id="a-resolver">Empezar a resolver en este orden</button></div></div>`;
    const etiqueta = (e) => (e ? `${DIF[e]}` : `<span class="sub">marca señales</span>`);
    const pintarOrden = () => {
      c.problemas.forEach((x) => { x.estim = estimar(x.senales); $(`[data-estim="${x.letra}"]`).innerHTML = etiqueta(x.estim); });
      $("#orden").innerHTML = c.orden.map((l, i) => {
        const x = c.problemas.find((y) => y.letra === l);
        return `<li><b>${i + 1}.</b> <span class="letra">${l}</span> ${esc(PROB[x.slug].nombre)} · ${etiqueta(x.estim)}
          <span style="margin-left:auto" class="fila"><button class="btn mini sec" data-sube="${i}" ${i === 0 ? "disabled" : ""} aria-label="Subir">↑</button>
          <button class="btn mini sec" data-baja="${i}" ${i === c.orden.length - 1 ? "disabled" : ""} aria-label="Bajar">↓</button></span></li>`;
      }).join("");
      $$("[data-sube]").forEach((b) => { b.onclick = () => { const i = +b.dataset.sube; [c.orden[i - 1], c.orden[i]] = [c.orden[i], c.orden[i - 1]]; Store.guardar(); pintarOrden(); }; });
      $$("[data-baja]").forEach((b) => { b.onclick = () => { const i = +b.dataset.baja; [c.orden[i + 1], c.orden[i]] = [c.orden[i], c.orden[i + 1]]; Store.guardar(); pintarOrden(); }; });
    };
    $$(".lect [data-s]").forEach((cb) => {
      cb.onchange = () => {
        const x = c.problemas.find((y) => y.letra === cb.closest(".lect").dataset.letra);
        x.senales[cb.dataset.s] = cb.checked;
        Store.guardar();
        pintarOrden();
      };
    });
    $("#auto-orden").onclick = () => {
      const peso = { facil: 0, medio: 1, dificil: 2 };
      c.orden.sort((a, b) => {
        const xa = c.problemas.find((y) => y.letra === a), xb = c.problemas.find((y) => y.letra === b);
        return (peso[xa.estim] ?? 1) - (peso[xb.estim] ?? 1);
      });
      Store.guardar();
      pintarOrden();
    };
    $("#a-resolver").onclick = () => {
      c.fase = "juego";
      c.lecturaSeg = Math.round(transcurrido());
      Store.guardar();
      vCompetencia();
    };
    pintarOrden();
    relojComp(c, "#reloj");
  }

  function avisosEstrategia(c) {
    const t = (Date.now() - c.inicio) / 1000, dur = c.duracion, k = dur / DURACION_EXAMEN;
    const acs = c.problemas.filter((x) => x.resuelto).length;
    const lista = [];
    if (acs >= 2) lista.push({ id: "dos", bueno: true, texto: `¡Llevas ${acs} aceptados: eso ya es 5.0! Lo que resuelvas ahora es bono${acs > 2 ? ` (+${acs - 2})` : ""}.` });
    if (dur - t <= 15 * 60 * k) lista.push({ id: "final", texto: "Quedan menos de 15 minutos: envía tu mejor versión de cada problema empezado. Un intento bien encaminado vale 3.0 – 4.0." });
    for (const x of c.problemas) {
      if (!x.resuelto && (x.seg || 0) >= 40 * 60 * k) lista.push({ id: "atasco-" + x.letra, texto: `Llevas ${Math.floor(x.seg / 60)} minutos en ${x.letra} sin aceptarlo. Si no avanzas, pasa al siguiente y vuelve después.` });
    }
    if (t >= dur / 2 && acs === 0) lista.push({ id: "mitad", texto: "Vas por la mitad sin aceptados: elige el problema que más se parezca a algo que ya hiciste y apunta primero a que pase el ejemplo." });
    if (t >= 100 * 60 * k && acs === 1) lista.push({ id: "segundo", texto: "Te falta un aceptado para el 5.0: concéntrate en el problema que más casos pasa." });
    return lista;
  }
  function revisarAvisos(c) {
    if (c.fase !== "juego") return;
    for (const a of avisosEstrategia(c)) {
      if (!c.avisos.includes(a.id)) {
        c.avisos.push(a.id);
        Store.guardar();
        toast(`<b>Estrategia:</b> ${esc(a.texto)}`, 12000);
      }
    }
  }

  function vCompTablero(c) {
    const ex = notaExamen(c);
    const avisos = avisosEstrategia(c);
    const primero = c.problemas.find((x) => x.letra === c.orden.find((l) => !c.problemas.find((y) => y.letra === l).resuelto));
    vista.innerHTML = `
      <div class="comp-cab"><h1>Examen en curso</h1><div class="reloj-grande" id="reloj">${mmss(restante(c))}</div></div>
      <div class="tiles">
        <div class="tile"><div class="tile-n">${fmt(ex.nota)}</div><div class="tile-l">nota estimada (2 mejores)</div></div>
        <div class="tile"><div class="tile-n">${ex.acs}<small>/4</small></div><div class="tile-l">aceptados (2 = 5.0)</div></div>
        <div class="tile"><div class="tile-n">${ex.bono ? "+" + ex.bono : "—"}</div><div class="tile-l">bono (aceptados extra)</div></div>
      </div>
      <div class="avisos">${avisos.map((a) => `<div class="aviso-estr ${a.bueno ? "bueno" : ""}">${a.bueno ? "★" : "⚑"} <span>${esc(a.texto)}</span></div>`).join("")
        || (primero ? `<div class="aviso-estr bueno">➜ <span>Sigue tu orden: ahora <b>${primero.letra}</b>, ${esc(PROB[primero.slug].nombre)}.</span></div>` : "")}</div>
      <div class="card tabla-scroll">
        <table class="tablero"><thead><tr><th>#</th><th>Problema</th><th>Estimaste</th><th>Envíos</th><th>Mejor envío</th><th>Tiempo</th><th>Nota</th></tr></thead>
        <tbody>${c.orden.map((l, i) => {
          const x = c.problemas.find((y) => y.letra === l), p = PROB[x.slug];
          return `<tr class="${x.resuelto ? "ok" : x.intentos ? "mal" : ""}">
            <td>${i + 1}</td><td><a href="#/competencia/${x.letra}"><b>${x.letra}.</b> ${esc(p.nombre)}</a></td>
            <td>${x.estim ? DIF[x.estim] : "—"}</td><td>${x.intentos}</td>
            <td>${x.mejor ? `<span class="badge b-${x.mejor.v}">${esc(Juez.NOMBRES[x.mejor.v])}</span> <span class="sub">${x.mejor.pasados}/${x.mejor.total}</span>` : "—"}</td>
            <td>${mmss(x.seg || 0)}${x.resuelto ? ` <span class="sub">(min ${x.minuto})</span>` : ""}</td><td><b>${x.mejor ? fmt(notaProblemaComp(x)) : "—"}</b></td></tr>`;
        }).join("")}</tbody></table>
        <p class="sub">La nota de cada problema sale de la rúbrica con tu mejor envío; ajusta la autoevaluación dentro de cada problema.
          Un envío con <code>break</code> no cuenta como aceptado.</p>
        <button class="btn sec" id="terminar">Terminar examen</button>
      </div>`;
    relojComp(c, "#reloj");
    $("#terminar").onclick = () => {
      if (confirm("¿Terminar el examen ahora?")) { const i = terminarCompetencia(); ir("reporte/" + i); }
    };
  }

  function registrarEnvioCompetencia(letra, res) {
    const c = compActual();
    if (!c) return;
    if (restante(c) <= 0) {
      const i = terminarCompetencia();
      alert("Se acabó el tiempo: este envío ya no cuenta para el examen.");
      ir("reporte/" + i);
      return;
    }
    const x = c.problemas.find((y) => y.letra === letra);
    if (res.v === "CE") return;
    x.intentos++;
    x.mejor = Rubrica.mejorEnvio(x.mejor, res);
    if (res.v === "AC" && !x.resuelto) { x.resuelto = true; x.minuto = Math.floor((Date.now() - c.inicio) / 60000); }
    Store.guardar();
  }

  function terminarCompetencia() {
    const c = compActual();
    if (!c) return Store.estado.simulacros.length - 1;
    c.fin = Date.now();
    if (c.lecturaSeg === null) c.lecturaSeg = Math.round((c.fin - c.inicio) / 1000);
    const ex = notaExamen(c);
    vigilarBloques(() => {
      Store.estado.simulacros.push({
        version: 2, inicio: c.inicio, fin: c.fin, duracion: c.duracion, lecturaSeg: c.lecturaSeg, orden: [...c.orden],
        problemas: c.problemas.map((x) => JSON.parse(JSON.stringify(x))), nota: ex.nota, bono: ex.bono, acs: ex.acs,
      });
      Store.estado.competencia = null;
      Store.guardar();
    });
    return Store.estado.simulacros.length - 1;
  }

  function vProblemaCompetencia(letra) {
    const c = compActual();
    if (!c) return ir("competencia");
    if (c.fase === "lectura") return ir("competencia");
    const x = c.problemas.find((y) => y.letra === letra);
    if (!x) return ir("competencia");
    vProblema(PROB[x.slug], { modo: "competencia", letra });
  }

  // ---------------------------------------------------------------- reporte del simulacro
  function vReporte(i) {
    const s = Store.estado.simulacros[i];
    if (!s || s.version !== 2) { vista.innerHTML = `<h1>Reporte</h1><div class="card sub">No hay reporte para este simulacro. <a href="#/competencia">Volver</a></div>`; return; }
    const recalcular = () => {
      const ex = Rubrica.examen(s.problemas.map(notaProblemaComp), s.problemas.filter((x) => x.resuelto).length);
      s.nota = ex.nota; s.bono = ex.bono; s.acs = ex.acs;
      Store.guardar();
    };
    recalcular();
    const usado = Math.min(s.duracion, (s.fin - s.inicio) / 1000);
    const orden = s.orden || s.problemas.map((x) => x.letra);
    const calib = s.problemas.filter((x) => x.estim);
    const aciertosCalib = calib.filter((x) => x.estim === PROB[x.slug].dificultad).length;
    const fallosDe = (slug) => Store.estado.bitacora.filter((b) => b.slug === slug && b.modo === "competencia" && Date.parse(b.fecha) >= s.inicio && Date.parse(b.fecha) <= s.fin + 3600e3);
    const n = simsV2().indexOf(s) + 1;
    vista.innerHTML = `
      <a class="volver" href="#/competencia">← Competencia</a>
      <h1>Reporte del simulacro ${n}</h1>
      <div class="card reporte-cab rango-${s.nota >= 4 ? 4 : s.nota >= 3 ? 3 : s.nota >= 2 ? 2 : 1}">
        <div class="nota-grande">${fmt(s.nota)}<small> / 5.0</small></div>
        <div><b>${s.acs} aceptado(s)${s.bono ? ` · bono +${s.bono}` : ""}</b>
          <div class="sub">Nota = promedio de tus 2 mejores problemas (2 aceptados = 5.0; cada aceptado extra es bono).</div>
          <div class="sub">${new Date(s.inicio).toLocaleString()} · usaste ${minTxt(usado / 60)} de ${minTxt(s.duracion / 60)} · lectura inicial: ${minTxt((s.lecturaSeg || 0) / 60)}${(s.lecturaSeg || 0) > 15 * 60 ? " (más de lo recomendado: unos 10 min)" : ""}</div></div>
      </div>
      <div class="card"><h3>Tiempo por problema</h3>
        ${orden.map((l) => { const x = s.problemas.find((y) => y.letra === l), p = PROB[x.slug]; return `<div class="barra-fila tema-${p.tema}">
          <span><b>${x.letra}.</b> ${esc(p.nombre)}</span><div class="tiempo-barra"><div style="width:${(100 * (x.seg || 0)) / s.duracion}%"></div></div>
          <span class="sub">${minTxt((x.seg || 0) / 60)}${x.resuelto ? ` · ✓ aceptado en el minuto ${x.minuto}` : ""}</span></div>`; }).join("")}
        <p class="sub">Tiempo con el problema abierto. En el examen conviene no pasar de 35 – 40 minutos atascada en uno.</p></div>
      <div id="rep-problemas">${orden.map((l) => {
        const x = s.problemas.find((y) => y.letra === l), p = PROB[x.slug];
        const fallos = fallosDe(x.slug);
        return `<div class="card tema-${p.tema}" data-rep-letra="${x.letra}">
          <div class="tecnica-cab">${emblema(p.tema)}<div><h3>${x.letra}. ${esc(p.nombre)}</h3>
            <div>${chipTema(p.tema)} ${chipDif(p.dificultad)} <span class="sub">estimaste: ${x.estim ? DIF[x.estim] : "sin marcar"} · ${x.intentos} envío(s)</span></div></div></div>
          <p><b>Qué pasó:</b> ${x.mejor ? `mejor envío ${esc(Juez.NOMBRES[x.mejor.v])}, ${x.mejor.pasados} de ${x.mejor.total} casos${x.mejor.ejemplo ? " (el ejemplo pasa)" : ""}.` : "no hubo envíos."}
            ${fallos.length ? `Bitácora: ${fallos.map((b) => b.causas.map((k) => CAUSAS[k] || k).join(", ") || "sin causa").map(esc).join("; ")}.` : ""}</p>
          <div class="rub" data-rub="${x.letra}"></div>
          <a href="#/problema/${x.slug}">Practicar este problema con pistas →</a></div>`;
      }).join("")}</div>
      ${calib.length ? `<div class="card"><h3>Calibración: ¿estimaste bien la dificultad?</h3>
        <table class="tablero calib"><tr><th>Problema</th><th>Estimaste</th><th>Real</th><th></th></tr>
        ${calib.map((x) => { const real = PROB[x.slug].dificultad, ok = real === x.estim; return `<tr><td>${x.letra}. ${esc(PROB[x.slug].nombre)}</td><td>${DIF[x.estim]}</td><td>${DIF[real]}</td><td class="${ok ? "si" : "no"}">${ok ? "✓" : "✗"}</td></tr>`; }).join("")}</table>
        <p class="sub">Acertaste ${aciertosCalib} de ${calib.length}. Estimar bien la dificultad en la lectura te permite empezar por lo seguro.</p></div>` : ""}
      <div class="card"><h3>Siguiente paso</h3><p>Abre el bloque de análisis: llena la bitácora de lo que falló y reintenta en práctica el problema que estuvo más cerca de pasar.</p>
        <a class="btn" href="#/bloque/sim-${Math.min(3, n)}r">Análisis del simulacro ${Math.min(3, n)} →</a></div>`;
    const pintarRub = (x) => {
      const cont = $(`[data-rub="${x.letra}"]`);
      if (!x.checks) x.checks = {};
      cont.innerHTML = x.mejor ? htmlRubrica(x.mejor, x.checks, "ajusta la autoevaluación si hace falta")
        : `<div class="card rubrica rango-0"><div class="rubrica-cab"><div class="nota-grande">0.0<small> / 5.0</small></div><div>Sin envío no hay nota: en el examen envía siempre tu mejor intento, aunque solo lea bien la entrada.</div></div></div>`;
      conectarRubrica(cont, x.checks, () => { recalcular(); pintarRub(x); $(".reporte-cab .nota-grande").innerHTML = `${fmt(s.nota)}<small> / 5.0</small>`; });
    };
    s.problemas.forEach(pintarRub);
  }

  // ---------------------------------------------------------------- bitacora
  function vBitacora() {
    const b = Store.estado.bitacora;
    const cuenta = {};
    b.forEach((e) => (e.causas.length ? e.causas : ["sin causa"]).forEach((k) => { cuenta[k] = (cuenta[k] || 0) + 1; }));
    const max = Math.max(1, ...Object.values(cuenta));
    vista.innerHTML = `
      <h1>Bitácora de errores</h1>
      ${b.length ? `<div class="card"><h3>Tus errores más frecuentes</h3>
        ${Object.entries(cuenta).sort((x, y) => y[1] - x[1]).map(([k, n]) => `<div class="barra-fila"><span>${esc(CAUSAS[k] || k)}</span>
          <div class="barra-fondo"><div class="barra-lleno" style="width:${(100 * n) / max}%"></div></div><b>${n}</b></div>`).join("")}</div>
        <div class="card"><h3>Para repasar</h3><ul class="bitacora">${b.map((e) => {
          const p = PROB[e.slug];
          return `<li><div><b>Sesión ${e.sesion || "—"}</b> · <a href="#/problema/${e.slug}">${esc(p ? p.nombre : e.slug)}</a>
            ${p ? chipTema(p.tema) : ""} <span class="badge b-${e.veredicto}">${esc(Juez.NOMBRES[e.veredicto] || e.veredicto)}</span>
            ${e.modo === "competencia" ? `<span class="chip">simulacro</span>` : e.modo === "ciego" ? `<span class="chip">a ciegas</span>` : ""}</div>
            <div>${e.causas.map((k) => `<span class="chip">${esc(CAUSAS[k] || k)}</span>`).join(" ")}</div>
            ${e.nota ? `<div class="nota">${esc(e.nota)}</div>` : ""}</li>`;
        }).join("")}</ul></div>`
        : `<div class="card sub">Aún no hay errores registrados. Después de cada envío fallido la Arena te pide anotar qué falló.</div>`}`;
  }

  // ---------------------------------------------------------------- guias
  function vGuias(tab, sub) {
    const tabs = [["tecnicas", "Técnicas"], ["reconocer", "Reconocer la técnica"], ["dificultad", "¿Fácil o difícil?"], ["lectura", "Lectura de entrada"], ["plantillas", "Plantillas y esqueletos"], ["quiz", "Quiz"]];
    let cuerpo = "";
    if (tab === "tecnicas") {
      const t = TEMAS.includes(sub) ? sub : "dyc";
      const g = GUIAS.tecnicas[t];
      cuerpo = `<div class="tabs">${TEMAS.map((x) => `<a href="#/guias/tecnicas/${x}" class="${x === t ? "activo" : ""}">${esc(NOMBRE_TEMA[x])}</a>`).join("")}</div>
        <div class="tema-${t}">
          <div class="card tecnica-intro">
            <div class="tecnica-cab">${emblema(t)}<div><h2 style="margin:0">${esc(NOMBRE_TEMA[t])}</h2><p>${esc(g.idea)}</p></div></div>
          </div>
          <div id="anim-guia"></div>
          <p class="sub">Avanza a tu ritmo con ◀ ▶ (o las flechas del teclado). Cuando aparezca una pregunta, predice antes de seguir: equivocarse en una predicción también enseña.</p>
          <div class="grid2">
            <div class="card"><h3>Cuándo usarla</h3><ul>${g.cuando.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
              <h3>Complejidad</h3><p>${esc(g.complejidad)}</p></div>
            <div class="card"><h3>Pasos</h3><ol>${g.pasos.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div>
            <div class="card"><h3>Errores típicos</h3><ul>${g.errores.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
            <div class="card"><h3>Ahora tú</h3><p>Cierra la guía y escribe de memoria, en papel, cuándo usar la técnica y su esqueleto (main que lee + función que resuelve).
              Luego compáralo con las <a href="#/guias/plantillas/${t}">plantillas de ${esc(CORTO[t])}</a>.</p></div>
          </div>
        </div>`;
    } else if (tab === "reconocer") {
      const g = GUIAS.reconocer;
      cuerpo = `<p>${esc(g.intro)}</p>
        <div class="senales">${g.senales.map((s) => `<div class="card senal tema-${s.tema}"><div class="sub">Señal</div><b>${esc(s.senal)}</b>
          <div class="flecha">→ ${esc(s.tecnica)}</div><p>${esc(s.detalle)}</p></div>`).join("")}</div>
        <div class="grid2"><div class="card"><h3>El tamaño delata la complejidad</h3><table class="tablero">${g.tamanos.map(([a, b]) => `<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td></tr>`).join("")}</table></div>
        <div class="card"><h3>Preguntas en orden</h3><ol>${g.preguntas.map((q) => `<li>${esc(q)}</li>`).join("")}</ol>
        <h3>${esc(g.voraz_contraejemplo.titulo)}</h3><p>${esc(g.voraz_contraejemplo.texto)}</p></div></div>`;
    } else if (tab === "dificultad") {
      const g = GUIAS.dificultad;
      cuerpo = `<p>${esc(g.intro)}</p>
        <div class="grid2"><div class="card"><h3 class="ok-t">Señales de que es fácil</h3><ul>${g.positivas.map((s) => `<li>${esc(s.texto)}</li>`).join("")}</ul>
          <h3 class="mal-t">Señales de que es difícil</h3><ul>${g.negativas.map((s) => `<li>${esc(s.texto)}</li>`).join("")}</ul>
          <p class="sub">En la fase de lectura del simulacro marcas estas señales en cada problema y la Arena sugiere un orden. Al final, el reporte compara tu estimación con la dificultad real.</p></div>
        <div class="card"><h3>Estrategia para las 2 h 20 min</h3><ol>${g.estrategia.map((x) => `<li>${esc(x)}</li>`).join("")}</ol></div></div>`;
    } else if (tab === "lectura") {
      const g = GUIAS.lectura;
      cuerpo = `<p>${esc(g.intro)}</p>${g.patrones.map((x) => `<div class="card"><h3>${esc(x.nombre)}</h3><pre class="codigo">${esc(x.codigo)}</pre></div>`).join("")}
        <div class="card"><h3>Errores típicos</h3><ul>${g.errores.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>`;
    } else if (tab === "plantillas") {
      const t = TEMAS.includes(sub) ? sub : "";
      cuerpo = `<div class="tabs"><a href="#/guias/plantillas" class="${t ? "" : "activo"}">Todas</a>${TEMAS.map((x) => `<a href="#/guias/plantillas/${x}" class="${x === t ? "activo" : ""}">${esc(NOMBRE_TEMA[x])}</a>`).join("")}</div>
        <p class="sub">Cada tema empieza con el esqueleto de la técnica (main que lee + función que resuelve). Todas terminan los ciclos con la condición del while o con banderas: sin <code>break</code>.</p>` +
        GUIAS.plantillas.temas.filter((x) => !t || x.tema === t).map((x) => `<h2 class="tecnica-cab tema-${x.tema}">${emblema(x.tema)} ${esc(x.nombre)}</h2>${x.items.map((it) => `<div class="card ${it.esqueleto ? `tema-${x.tema} senal` : ""}"><h3>${esc(it.nombre)}${it.esqueleto ? `<span class="etq">esqueleto</span>` : ""}</h3><pre class="codigo">${esc(it.codigo)}</pre></div>`).join("")}`).join("");
    } else {
      cuerpo = `<div id="quiz"></div>`;
    }
    vista.innerHTML = `<h1>Guías</h1><div class="tabs">${tabs.map(([k, v]) => `<a href="#/guias/${k}" class="${k === tab ? "activo" : ""}">${v}</a>`).join("")}</div>${cuerpo}`;
    if (tab === "tecnicas") {
      const t = TEMAS.includes(sub) ? sub : "dyc";
      const a = Anim.montar($("#anim-guia"), t, {
        onFin: () => {
          const b = BLOQUE[`${t}-1`];
          if (b) vigilarBloques(() => { Store.bloque(b.id).pasos.anim = true; Store.guardar(); });
        },
      });
      alSalir(() => a.parar());
    }
    if (tab === "quiz") quiz();
  }

  function quiz() {
    const todos = [...D.arena, ...D.biblioteca].filter((p) => TEMAS.includes(p.tema) && !p.fuera_examen);
    let aciertos = 0, total = 0, p = null;
    const nueva = () => {
      p = todos[Math.floor(Math.random() * todos.length)];
      const q = Store.estado.quiz;
      $("#quiz").innerHTML = `<div class="card quiz">
        <p class="sub">Esta ronda: ${aciertos}/${total} · en total: ${q.aciertos}/${q.respondidas}</p>
        <h3>${esc(p.nombre)}</h3><p>${esc(p.resumen)}</p>
        <p class="sub">¿Qué técnica usarías? Decide en menos de un minuto.</p>
        <div class="opciones">${TEMAS.map((t) => `<button class="btn sec" data-t="${t}">${esc(NOMBRE_TEMA[t])}</button>`).join("")}</div>
        <div id="quiz-res"></div></div>`;
      $$("#quiz [data-t]").forEach((b) => {
        b.onclick = () => {
          total++;
          const ok = b.dataset.t === p.tema;
          if (ok) aciertos++;
          vigilarBloques(() => { q.respondidas++; if (ok) q.aciertos++; Store.guardar(); });
          $$("#quiz [data-t]").forEach((x) => { x.disabled = true; x.classList.toggle("correcta", x.dataset.t === p.tema); x.classList.toggle("incorrecta", x === b && !ok); });
          $("#quiz-res").innerHTML = `<p class="${ok ? "ok-t" : "mal-t"}"><b>${ok ? "¡Correcto!" : "No."}</b> Técnica: ${esc(NOMBRE_TEMA[p.tema])}. ${esc(p.pista)}</p>
            <button class="btn primario" id="quiz-sig">Siguiente</button>`;
          $("#quiz-sig").onclick = nueva;
        };
      });
    };
    nueva();
  }

  // ---------------------------------------------------------------- progreso
  function vProgreso() {
    const st = notasPorTema();
    const debil = temaMasDebil();
    const resueltos = Object.entries(Store.estado.problemas).filter(([s, e]) => e.estado === "resuelto" && PROB[s]);
    const sims = simsV2();
    vista.innerHTML = `
      <h1>Progreso</h1>
      <div class="tiles">
        <div class="tile"><div class="tile-n">${Math.round(100 * progresoGlobal())}<small>%</small></div><div class="tile-l">del plan núcleo</div></div>
        <div class="tile"><div class="tile-n">${resueltos.length}</div><div class="tile-l">problemas aceptados</div></div>
        <div class="tile"><div class="tile-n" style="font-size:1.15rem">${debil ? esc(NOMBRE_TEMA[debil]) : "—"}</div><div class="tile-l">tema más débil</div></div>
        <div class="tile"><div class="tile-n">${sims.length}</div><div class="tile-l">simulacros${sims.length ? ` · último ${fmt(sims[sims.length - 1].nota)}` : ""}</div></div>
        <div class="tile"><div class="tile-n">${Store.estado.sesion.n}</div><div class="tile-l">sesiones de estudio</div></div>
      </div>
      <div class="grid2">
        <div class="card"><h3>Módulos</h3>
          ${MODULOS.map((m) => { const pm = progresoModulo(m); return `<div class="barra-fila tema-${m.tema || "x"}"><span>${esc(m.titulo)}</span>
            <div class="barra-fondo"><div class="barra-lleno" style="width:${100 * pm.pct}%"></div></div><b>${Math.round(100 * pm.pct)}%</b></div>`; }).join("")}
        </div>
        <div class="card"><h3>Nota estimada por tema</h3>
          <p class="sub">Promedio de la rúbrica en los problemas que has intentado (práctica y simulacros). El más bajo es tu tema más débil.</p>
          ${TEMAS.map((t) => `<div class="barra-fila tema-${t}"><span>${chipTema(t)}</span>
            <div class="barra-fondo"><div class="barra-lleno" style="width:${st[t].prom === null ? 0 : (100 * st[t].prom) / 5}%"></div></div>
            <b>${st[t].prom === null ? "—" : fmt(st[t].prom)}</b></div>`).join("")}
          <p class="sub">${TEMAS.map((t) => `${CORTO[t]}: ${st[t].n} problema(s)`).join(" · ")}</p>
        </div>
      </div>
      ${sims.length ? `<div class="card tabla-scroll"><h3>Simulacros</h3><table class="tablero"><tr><th>#</th><th>Nota</th><th>Bono</th><th>Aceptados</th><th></th></tr>
        ${sims.map((s, k) => `<tr class="${s.nota >= 4 ? "ok" : "mal"}"><td>${k + 1}</td><td><b>${fmt(s.nota)}</b></td><td>${s.bono ? "+" + s.bono : "—"}</td><td>${s.acs}/4</td>
          <td><a href="#/reporte/${Store.estado.simulacros.indexOf(s)}">Reporte</a></td></tr>`).join("")}</table></div>` : ""}
      <div class="grid2">
        <div class="card tabla-scroll"><h3>Aceptados</h3>${resueltos.length ? `<table class="tablero"><tr><th>Problema</th><th>Envíos</th><th>Nota</th><th>Pistas</th></tr>
          ${resueltos.map(([s, e]) => `<tr><td><a href="#/problema/${s}">${esc(PROB[s].nombre)}</a> ${chipTema(PROB[s].tema)}</td><td>${e.intentos}</td><td>${fmt(notaPractica(s))}</td>
          <td>${e.pistas || 0}${e.vioSolucion ? " + solución" : ""}</td></tr>`).join("")}</table>` : `<p class="sub">Aún nada.</p>`}</div>
        <div class="card"><h3>Respaldo</h3>
          <p class="sub">El progreso vive en este navegador (localStorage). Expórtalo de vez en cuando o para pasarlo a otro computador.</p>
          <div class="fila"><button class="btn sec" id="exportar">Exportar progreso</button>
          <label class="btn sec">Importar… <input type="file" id="importar" accept=".json" hidden></label></div>
          <button class="btn link" id="borrar">Borrar todo el progreso</button>
        </div>
      </div>`;
    $("#exportar").onclick = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([Store.exportar()], { type: "application/json" }));
      const d = new Date();
      a.download = `arena-ada-progreso-${d.getFullYear()}-${z2(d.getMonth() + 1)}-${z2(d.getDate())}.json`;
      a.click();
    };
    $("#importar").onchange = async (e) => {
      try { Store.importar(await e.target.files[0].text()); vProgreso(); } catch (err) { alert("Archivo inválido: " + err.message); }
    };
    $("#borrar").onclick = () => { if (confirm("¿Borrar TODO el progreso? No se puede deshacer.")) { Store.reiniciarTodo(); vProgreso(); } };
  }

  // Ganchos para las pruebas automaticas.
  window.App = { recomendar, temaMasDebil, progresoBloque, progresoModulo, terminarCompetencia, empezarCompetencia, notaExamen, compActual, BLOQUE };
  render();
})();
