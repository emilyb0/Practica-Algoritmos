// Arena ADA: interfaz principal.
(() => {
  const D = window.ARENA_DATA;
  const PROB = Object.fromEntries(D.arena.map((p) => [p.slug, p]));
  const TEMAS5 = ["dyc", "bt", "dp", "voraz", "np"];
  const NOMBRE_TEMA = { ...D.temas, np: "NP-completo" };
  const DIF = { facil: "Fácil", medio: "Medio", dificil: "Difícil" };
  const CAUSAS = {
    lectura: "Lectura de entrada", tecnica: "Técnica equivocada", borde: "Caso borde",
    tiempo: "Tiempo (lento)", formato: "Formato de salida", break: "Usé break", otro: "Otro",
  };
  const vista = document.getElementById("vista");

  // ---------------------------------------------------------------- utilidades
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
  const mmss = (seg) => {
    seg = Math.max(0, Math.floor(seg));
    const h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
    const z = (n) => String(n).padStart(2, "0");
    return h ? `${h}:${z(m)}:${z(s)}` : `${z(m)}:${z(s)}`;
  };
  const chipTema = (t) => `<span class="chip tema-${t}">${esc(NOMBRE_TEMA[t] || t)}</span>`;
  const chipDif = (d) => `<span class="chip dif-${d}">${esc(DIF[d] || d)}</span>`;
  const barajar = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const icono = (slug) => {
    const p = Store.estado.problemas[slug];
    if (!p || p.estado === "nuevo") return `<span class="estado e-nuevo" title="Sin intentar">○</span>`;
    if (p.estado === "resuelto") return `<span class="estado e-ok" title="Resuelto">✓</span>`;
    return `<span class="estado e-mal" title="Intentado">✗</span>`;
  };
  let limpiezas = [];
  const alSalir = (f) => limpiezas.push(f);

  // ---------------------------------------------------------------- estado derivado
  function diaDelPlan() {
    const plan = Store.estado.plan;
    if (!plan.inicio) { plan.inicio = Store.hoy(); Store.guardar(); }
    return Store.diasEntre(plan.inicio, Store.hoy()) + 1;
  }

  function estadisticasTema() {
    const r = {};
    for (const t of TEMAS5) {
      const del = D.arena.filter((p) => p.tema === t && p.conjunto === "nucleo");
      let resueltos = 0, intentados = 0;
      for (const p of D.arena.filter((q) => q.tema === t)) {
        const e = Store.estado.problemas[p.slug];
        if (e && e.intentos) { intentados++; if (e.estado === "resuelto") resueltos++; }
      }
      const errores = Store.estado.bitacora.filter((b) => PROB[b.slug] && PROB[b.slug].tema === t).length;
      const resNucleo = del.filter((p) => (Store.estado.problemas[p.slug] || {}).estado === "resuelto").length;
      r[t] = { total: del.length, resNucleo, resueltos, intentados, errores,
               exito: intentados ? resueltos / intentados : null, cobertura: del.length ? resNucleo / del.length : 0 };
    }
    return r;
  }

  function temaMasDebil() {
    const st = estadisticasTema();
    const con = TEMAS5.filter((t) => st[t].intentados > 0 || st[t].errores > 0);
    if (!con.length) return null;
    // menor puntaje = mas debil: mezcla tasa de exito, cobertura del nucleo y errores registrados
    const puntaje = (t) => 0.5 * (st[t].exito ?? 0) + 0.4 * st[t].cobertura - 0.03 * st[t].errores;
    return con.sort((a, b) => puntaje(a) - puntaje(b))[0];
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
      try { new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=").play(); } catch (e) { /* sin sonido */ }
      alert(pomo.fase === "descanso" ? "¡50 minutos! Descansa 10 minutos." : "Fin del descanso. Nuevo bloque de 50 minutos.");
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

  function pintarCabecera() {
    $("#racha").textContent = Store.racha();
    const c = Store.estado.competencia;
    $("#nav-comp-reloj").textContent = c && !c.fin ? "· " + mmss(c.duracion - (Date.now() - c.inicio) / 1000) : "";
  }
  setInterval(pintarCabecera, 1000);

  // ---------------------------------------------------------------- router
  function ir(ruta) { location.hash = "#/" + ruta; }
  function render() {
    limpiezas.forEach((f) => f());
    limpiezas = [];
    const partes = location.hash.replace(/^#\/?/, "").split("/");
    const [r, a, b] = partes;
    $$(".nav a").forEach((el) => el.classList.toggle("activo", el.dataset.r === (r || "inicio")));
    window.scrollTo(0, 0);
    if (!r || r === "inicio") vInicio();
    else if (r === "plan") vPlan();
    else if (r === "practica") vPractica();
    else if (r === "problema" && PROB[a]) vProblema(PROB[a], null);
    else if (r === "competencia" && a) vProblemaCompetencia(a);
    else if (r === "competencia") vCompetencia();
    else if (r === "bitacora") vBitacora();
    else if (r === "guias") vGuias(a || "reconocer");
    else if (r === "progreso") vProgreso();
    else vInicio();
    pintarCabecera();
  }
  window.addEventListener("hashchange", render);

  // ---------------------------------------------------------------- tareas del plan
  function tareaHecha(dia, k, tarea) {
    if (Store.estado.plan.hecho[`d${dia}:${k}`]) return true;
    return tarea.t === "problema" && (Store.estado.problemas[tarea.slug] || {}).estado === "resuelto";
  }

  function htmlTarea(dia, k, tarea) {
    const id = `d${dia}:${k}`;
    const hecha = tareaHecha(dia, k, tarea);
    let cuerpo;
    if (tarea.t === "problema") {
      const p = PROB[tarea.slug];
      cuerpo = `<a href="#/problema/${p.slug}">${esc(p.id)} · ${esc(p.nombre)}</a> ${chipTema(p.tema)} ${chipDif(p.dificultad)}`;
    } else if (tarea.t === "guia") {
      cuerpo = `<a href="#/${tarea.ruta}">${esc(tarea.texto)}</a>`;
    } else if (tarea.t === "quiz") {
      cuerpo = `<a href="#/guias/quiz">Quiz de reconocimiento: ${tarea.n} problemas</a> <span class="sub">Lee el resumen y di la técnica en menos de 1 minuto.</span>`;
    } else if (tarea.t === "simulacro") {
      cuerpo = `<a href="#/competencia">Simulacro completo: 5 problemas en 3 horas</a> <span class="sub">Meta: 3 de 5. Sin pistas.</span>`;
    } else {
      cuerpo = esc(tarea.texto);
    }
    return `<li class="tarea ${hecha ? "hecha" : ""}"><label><input type="checkbox" data-tarea="${id}" ${hecha ? "checked" : ""}> <span>${cuerpo}</span></label></li>`;
  }

  function conectarChecks(raiz) {
    $$("input[data-tarea]", raiz).forEach((cb) => {
      cb.onchange = () => {
        Store.estado.plan.hecho[cb.dataset.tarea] = cb.checked;
        if (cb.checked) Store.marcarActividad();
        Store.guardar();
        cb.closest(".tarea").classList.toggle("hecha", cb.checked);
        pintarCabecera();
      };
    });
  }

  function htmlRepasos() {
    const rep = Store.repasosPendientes();
    if (!rep.length) return `<p class="sub">No tienes repasos pendientes hoy.</p>`;
    return `<ul class="lista">${rep.map((r) => {
      const p = PROB[r.slug];
      return `<li>${icono(r.slug)} <a href="#/problema/${r.slug}">${esc(p.id)} · ${esc(p.nombre)}</a> ${chipTema(p.tema)}
        <span class="sub">programado para ${r.fecha}</span>
        <button class="btn mini" data-repaso="${r.slug}">Marcar repasado</button></li>`;
    }).join("")}</ul>`;
  }

  function conectarRepasos(raiz, despues) {
    $$("[data-repaso]", raiz).forEach((b) => {
      b.onclick = () => { Store.completarRepaso(b.dataset.repaso); despues(); };
    });
  }

  // ---------------------------------------------------------------- vista: inicio
  function vInicio() {
    const dia = diaDelPlan();
    const d = PLAN.find((x) => x.dia === dia);
    const nucleo = D.arena.filter((p) => p.conjunto === "nucleo");
    const res = nucleo.filter((p) => (Store.estado.problemas[p.slug] || {}).estado === "resuelto").length;
    const debil = temaMasDebil();
    const sims = Store.estado.simulacros;
    const ultimo = sims[sims.length - 1];
    vista.innerHTML = `
      <section class="hero">
        <div>
          <h1>Arena ADA</h1>
          <p class="sub">Mini competencia: 5 problemas en 3 horas, en Python. Meta: resolver 3 de 5.</p>
        </div>
      </section>
      <section class="tiles">
        <div class="tile"><div class="tile-n">${res}<small>/${nucleo.length}</small></div><div class="tile-l">núcleo resuelto</div></div>
        <div class="tile"><div class="tile-n">${Store.racha()}</div><div class="tile-l">días de racha</div></div>
        <div class="tile"><div class="tile-n">${debil ? esc(NOMBRE_TEMA[debil]) : "—"}</div><div class="tile-l">tema más débil</div></div>
        <div class="tile"><div class="tile-n">${ultimo ? `${ultimo.resueltos}<small>/5</small>` : "—"}</div><div class="tile-l">último simulacro</div></div>
      </section>
      <section class="grid2">
        <div class="card">
          <h2>${d ? `Hoy: día ${dia} de 21` : dia < 1 ? "El plan empieza pronto" : "Plan terminado"}</h2>
          ${d ? `<p class="foco">${esc(d.foco)}</p>
            <p class="sub">${esc(PLAN_SEMANAS[d.semana])} · 2 a 3 bloques Pomodoro de 50 + 10 min.
              En cada problema: 2 líneas de recuerdo activo antes de codificar y explicación Feynman al terminar.</p>
            <ul class="tareas">${d.tareas.map((t, k) => htmlTarea(dia, k, t)).join("")}</ul>`
            : `<p class="sub">Ajusta la fecha de inicio en <a href="#/plan">Plan 21 días</a> o practica libremente.</p>`}
        </div>
        <div class="card">
          <h2>Repasos espaciados de hoy</h2>
          <p class="sub">Problemas fallados vuelven a los 1, 3 y 7 días.</p>
          <div id="repasos">${htmlRepasos()}</div>
        </div>
      </section>`;
    conectarChecks(vista);
    conectarRepasos(vista, vInicio);
  }

  // ---------------------------------------------------------------- vista: plan
  function vPlan() {
    const hoyDia = diaDelPlan();
    const semanas = [1, 2, 3].map((s) => `
      <h2 class="semana">${esc(PLAN_SEMANAS[s])}</h2>
      <div class="dias">${PLAN.filter((d) => d.semana === s).map((d) => {
        const hechas = d.tareas.filter((t, k) => tareaHecha(d.dia, k, t)).length;
        return `<div class="dia ${d.dia === hoyDia ? "hoy" : ""} ${hechas === d.tareas.length ? "completo" : ""}">
          <div class="dia-cab"><b>Día ${d.dia}</b><span class="sub">${Store.sumarDias(Store.estado.plan.inicio, d.dia - 1)}</span>
            <span class="progreso-dia">${hechas}/${d.tareas.length}</span></div>
          <div class="foco">${esc(d.foco)}</div>
          <ul class="tareas">${d.tareas.map((t, k) => htmlTarea(d.dia, k, t)).join("")}</ul>
        </div>`;
      }).join("")}</div>`).join("");
    vista.innerHTML = `
      <h1>Plan de 21 días</h1>
      <div class="card principios">
        <div><b>Práctica intercalada:</b> cada día mezcla temas distintos.</div>
        <div><b>Repetición espaciada:</b> lo que falles vuelve a los 1, 3 y 7 días (ver Inicio).</div>
        <div><b>Recuerdo activo:</b> el editor se desbloquea cuando escribes en 2 líneas la técnica y por qué.</div>
        <div><b>Feynman:</b> al resolver, explica la solución con tus palabras.</div>
        <div><b>Pomodoro:</b> bloques de 50 min + 10 de descanso (reloj arriba a la derecha).</div>
        <label class="inicio-plan">Fecha de inicio del plan:
          <input type="date" id="plan-inicio" value="${Store.estado.plan.inicio}"></label>
      </div>
      ${semanas}`;
    $("#plan-inicio").onchange = (e) => { Store.estado.plan.inicio = e.target.value; Store.guardar(); vPlan(); };
    conectarChecks(vista);
  }

  // ---------------------------------------------------------------- vista: practica
  const filtros = { tema: "", dif: "", conj: "nucleo" };
  function vPractica() {
    const opciones = (sel, pares) => pares.map(([v, t]) => `<option value="${v}" ${sel === v ? "selected" : ""}>${esc(t)}</option>`).join("");
    vista.innerHTML = `
      <h1>Práctica</h1>
      <div class="filtros card">
        <label>Tema <select id="f-tema">${opciones(filtros.tema, [["", "Todos"], ...Object.entries(NOMBRE_TEMA)])}</select></label>
        <label>Dificultad <select id="f-dif">${opciones(filtros.dif, [["", "Todas"], ...Object.entries(DIF)])}</select></label>
        <label>Conjunto <select id="f-conj">${opciones(filtros.conj, [["nucleo", "Núcleo (30)"], ["reserva", "Reserva para simulacros"], ["todo", "Núcleo + reserva"], ["biblioteca", "Catálogo completo (sin juez)"]])}</select></label>
      </div>
      <div id="lista"></div>`;
    const pintar = () => {
      const f = (p) => (!filtros.tema || p.tema === filtros.tema) && (!filtros.dif || p.dificultad === filtros.dif);
      if (filtros.conj === "biblioteca") {
        const ps = D.biblioteca.filter(f);
        $("#lista").innerHTML = `<p class="sub">Estos ${ps.length} problemas no tienen casos de prueba en la Arena: úsalos como lectura extra o para el quiz.</p>
          <ul class="problemas">${ps.map((p) => `<li class="prob"><div><b>${esc(p.id)}</b> · ${esc(p.nombre)} ${chipTema(p.tema)} ${chipDif(p.dificultad)}
          <div class="sub">${esc(p.resumen)}</div></div>
          <div class="enlaces"><a href="${esc(p.enlace)}" target="_blank" rel="noopener">Enunciado</a>${p.enunciado_curso ? ` · <a href="${esc(p.enunciado_curso)}" target="_blank" rel="noopener">PDF del curso</a>` : ""}</div></li>`).join("")}</ul>`;
        return;
      }
      const ps = D.arena.filter((p) => f(p) && (filtros.conj === "todo" || p.conjunto === filtros.conj));
      const orden = { facil: 0, medio: 1, dificil: 2 };
      ps.sort((a, b) => orden[a.dificultad] - orden[b.dificultad] || a.tema.localeCompare(b.tema));
      $("#lista").innerHTML = filtros.conj === "reserva"
        ? `<div class="card aviso">La reserva se usa en los simulacros. Si la practicas ahora, los simulacros tendrán menos problemas nuevos para ti.</div>` : "";
      $("#lista").innerHTML += `<ul class="problemas">${ps.map((p) => {
        const e = Store.estado.problemas[p.slug] || {};
        return `<li class="prob" data-ir="${p.slug}">
          <div>${icono(p.slug)} <b>${esc(p.id)}</b> · ${esc(p.nombre)} ${chipTema(p.tema)} ${chipDif(p.dificultad)}
            <div class="sub">${esc(p.resumen)}</div></div>
          <div class="meta">${e.intentos ? `${e.intentos} envío(s)` : ""}${e.mejorSeg ? ` · ${mmss(e.mejorSeg)}` : ""}</div></li>`;
      }).join("")}</ul>`;
      $$("[data-ir]").forEach((li) => { li.onclick = () => ir("problema/" + li.dataset.ir); });
    };
    $("#f-tema").onchange = (e) => { filtros.tema = e.target.value; pintar(); };
    $("#f-dif").onchange = (e) => { filtros.dif = e.target.value; pintar(); };
    $("#f-conj").onchange = (e) => { filtros.conj = e.target.value; pintar(); };
    pintar();
  }

  // ---------------------------------------------------------------- vista: problema
  // comp = null (practica) o {letra} (competencia)
  function vProblema(p, comp) {
    const ep = Store.problema(p.slug);
    const ejemplo = p.casos.find((c) => c.ejemplo);
    const enComp = !!comp;
    vista.innerHTML = `
      <div class="prob-cab">
        <div>
          ${enComp ? `<a class="volver" href="#/competencia">← Tablero</a>` : `<a class="volver" href="#/practica">← Práctica</a>`}
          <h1>${enComp ? `${comp.letra}. ` : ""}${esc(p.nombre)}</h1>
          <div>${enComp ? `<span class="sub">Hay un problema de cada tema: reconocer la técnica es parte del reto.</span>`
            : `<b>${esc(p.id)}</b> ${chipTema(p.tema)} ${chipDif(p.dificultad)}
            <span class="sub">${p.conjunto === "reserva" ? "reserva" : "núcleo"} · apareció en ${esc(p.semestres.join(", ") || "extra")}</span>`}</div>
        </div>
        <div class="crono ${enComp ? "oculto" : ""}" id="crono">
          <span id="crono-t">00:00</span>
          <button class="btn mini" id="crono-btn">Iniciar cronómetro</button>
          <button class="btn mini sec" id="crono-reset">↺</button>
        </div>
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
            <h3>Recuerdo activo <span class="sub">(obligatorio antes de codificar)</span></h3>
            <p class="sub">En 2 líneas: ¿qué técnica vas a usar y por qué?</p>
            <textarea id="recuerdo" rows="3" placeholder="Ej.: Búsqueda binaria sobre la respuesta, porque «¿alcanza con X?» es monótono y X llega a 10^9.">${esc(ep.recuerdo)}</textarea>
          </div>
          ${enComp ? `<div class="card sub">En la competencia no hay pistas.</div>` : `
          <div class="card">
            <h3>Escalera de pistas</h3>
            <div id="pistas"></div>
          </div>`}
          <div class="card">
            <h3>Técnica Feynman</h3>
            <p class="sub">Explica la solución con tus palabras, como si se la contaras a alguien que no sabe programar.</p>
            <textarea id="feynman" rows="5" placeholder="La idea es...">${esc(ep.feynman)}</textarea>
          </div>
        </div>
        <div class="col-der">
          <div class="card editor-card">
            <div class="editor-barra">
              <b>solucion.py</b>
              <span class="sub" id="estado-py">Python se carga la primera vez (unos segundos)</span>
              <select id="insertar"><option value="">Insertar plantilla…</option>
                ${GUIAS.lectura.patrones.map((x, i) => `<option value="${i}">${esc(x.nombre)}</option>`).join("")}</select>
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
          <div id="resultados"></div>
          <div id="bitacora-form"></div>
        </div>
      </div>`;

    // --- cronometro opcional
    let cronoSeg = 0, cronoInt = null;
    const pintarCrono = () => { $("#crono-t").textContent = mmss(cronoSeg); };
    $("#crono-btn").onclick = () => {
      if (cronoInt) { clearInterval(cronoInt); cronoInt = null; $("#crono-btn").textContent = "Continuar"; }
      else { cronoInt = setInterval(() => { cronoSeg++; pintarCrono(); }, 1000); $("#crono-btn").textContent = "Pausa"; }
    };
    $("#crono-reset").onclick = () => { cronoSeg = 0; pintarCrono(); };
    alSalir(() => clearInterval(cronoInt));

    // --- editor
    const borrador = Store.borrador(p.slug);
    $("#codigo").value = borrador ?? "import sys\n\n\ndef solve():\n    ans = 0\n    # TODO: la logica del algoritmo\n    return ans\n\n\ndef main():\n    linea = sys.stdin.readline().strip()\n    # TODO: leer la entrada\n    print(solve())\n\n\nif __name__ == \"__main__\":\n    main()\n";
    const cm = CodeMirror.fromTextArea($("#codigo"), {
      mode: "python", lineNumbers: true, indentUnit: 4, tabSize: 4, matchBrackets: true,
      autoCloseBrackets: true, styleActiveLine: true, viewportMargin: Infinity,
      extraKeys: {
        Tab: (c) => c.somethingSelected() ? c.indentSelection("add") : c.replaceSelection("    ", "end"),
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
      const x = GUIAS.lectura.patrones[e.target.value];
      if (x && (!cm.getValue().trim() || confirm("¿Reemplazar el código actual por la plantilla?"))) cm.setValue(x.codigo + "\n");
      e.target.value = "";
    };

    // --- pistas (solo practica)
    if (!enComp) {
      const pintarPistas = () => {
        const n = ep.pistas || 0;
        const nombres = ["Pista 1 · Técnica", "Pista 2 · Idea clave", "Pista 3 · Esqueleto con TODOs"];
        let html = "";
        for (let k = 0; k < 3; k++) {
          if (k < n) {
            html += `<div class="pista"><b>${nombres[k]}</b>${k < 2 ? `<p>${esc(p.pistas[k])}</p>`
              : `<pre class="codigo-pista">${esc(p.esqueleto)}</pre><button class="btn mini" id="usar-esq">Copiar al editor</button>`}</div>`;
          }
        }
        if (n < 3) html += `<button class="btn sec" id="sig-pista">Ver ${nombres[n]}</button>`;
        html += ep.vioSolucion
          ? `<div class="pista"><b>Solución completa</b><pre class="codigo-pista">${esc(p.solucion)}</pre></div>`
          : `<button class="btn link" id="ver-sol">Ver la solución completa…</button>`;
        $("#pistas").innerHTML = html;
        if ($("#sig-pista")) $("#sig-pista").onclick = () => { ep.pistas = n + 1; Store.guardar(); pintarPistas(); };
        if ($("#usar-esq")) $("#usar-esq").onclick = () => { if (confirm("¿Reemplazar tu código por el esqueleto?")) cm.setValue(p.esqueleto); };
        if ($("#ver-sol")) $("#ver-sol").onclick = () => {
          if (confirm("¿Seguro? Ver la solución completa le quita valor al ejercicio. Intenta antes la pista 3 y anota en la bitácora qué te bloqueó.")) {
            ep.vioSolucion = true; Store.guardar(); pintarPistas();
          }
        };
      };
      pintarPistas();
    }

    // --- juez
    const estadoPy = $("#estado-py");
    Juez.preparar().then(() => { estadoPy.textContent = "Python listo"; }).catch((e) => { estadoPy.textContent = "Error: " + e.message; });

    function pintarResultados(res, casos) {
      $("#resultados").innerHTML = `<div class="card"><table class="tabla-casos"><thead><tr><th>Caso</th><th>Veredicto</th><th>Tiempo</th></tr></thead><tbody>
        ${casos.map((c, i) => {
          const r = res[i];
          return `<tr class="${r ? "v-" + r.veredicto : ""}" data-caso="${i}"><td>${esc(c.nombre)}</td>
            <td>${r ? `<span class="badge b-${r.veredicto}">${esc(Juez.NOMBRES[r.veredicto])}</span>` : `<span class="sub">en espera…</span>`}</td>
            <td>${r ? r.segundos.toFixed(2) + " s" : ""}</td></tr>
            <tr class="detalle oculto" id="det-${i}"><td colspan="3"></td></tr>`;
        }).join("")}</tbody></table><p class="sub">Haz clic en un caso para ver entrada, salida esperada y la tuya.</p></div>`;
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
      if (r.veredicto === "CE") $("#resultados").innerHTML = "";
      const avisoBreak = r.breaks.length
        ? `<div class="aviso-break">⚠ Tu código usa <code>break</code> en la(s) línea(s) ${r.breaks.join(", ")}. En el curso no está permitido: termina el ciclo con la condición del while o con una bandera.</div>` : "";
      const okTodos = r.casos.length && r.casos.every((c) => c.veredicto === "AC");
      $("#veredicto").innerHTML = `<div class="card veredicto v-${r.veredicto}">
        <div class="v-titulo">${soloEjemplo ? "Ejemplo: " : ""}${esc(Juez.NOMBRES[r.veredicto])}</div>
        ${r.veredicto === "CE" ? `<pre class="err">${esc(r.detalle)}</pre>` : ""}
        ${r.veredicto === "BRK" && okTodos ? `<p>La salida es correcta, pero el envío no cuenta como resuelto.</p>` : ""}
        ${avisoBreak}</div>`;
      if (!soloEjemplo) {
        const segundos = enComp ? null : (cronoSeg || null);
        Store.registrarEnvio(p.slug, r.veredicto === "AC" ? "AC" : r.veredicto, segundos);
        if (enComp) registrarEnvioCompetencia(comp.letra, r.veredicto);
        if (r.veredicto === "AC") {
          clearInterval(cronoInt); cronoInt = null;
          $("#veredicto").firstElementChild.innerHTML += `<p>¡Bien! Ahora escribe tu explicación Feynman a la izquierda.${cronoSeg ? ` Tiempo: ${mmss(cronoSeg)}.` : ""}</p>`;
          $("#feynman").focus();
        } else if (r.veredicto !== "CE") {
          formularioBitacora(p, r, enComp);
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

  function formularioBitacora(p, r, enComp) {
    const sugerida = { TLE: "tiempo", BRK: "break", PE: "formato" }[r.veredicto]
      || (r.casos.some((c) => c.error && /IndexError|ValueError/.test(c.error)) ? "lectura" : "");
    const falloEjemplo = r.casos.some((c) => c.ejemplo && c.veredicto !== "AC");
    $("#bitacora-form").innerHTML = `<div class="card bitacora-form">
      <h3>Bitácora: ¿qué falló?</h3>
      <p class="sub">${falloEjemplo ? "Falló el ejemplo del enunciado." : "El ejemplo pasa, pero falla un caso adicional: piensa en casos borde."}
        Este problema volverá en tus repasos a los 1, 3 y 7 días.</p>
      <div class="causas">${Object.entries(CAUSAS).map(([k, v]) => `<label><input type="checkbox" value="${k}" ${k === sugerida ? "checked" : ""}> ${v}</label>`).join("")}</div>
      <textarea id="nota-bitacora" rows="2" placeholder="Nota corta: qué pasó y qué harás distinto"></textarea>
      <button class="btn" id="guardar-bitacora">Guardar en la bitácora</button>
    </div>`;
    $("#guardar-bitacora").onclick = () => {
      const causas = $$(".causas input:checked").map((x) => x.value);
      Store.agregarBitacora({ slug: p.slug, veredicto: r.veredicto, causas, nota: $("#nota-bitacora").value, modo: enComp ? "competencia" : "practica" });
      $("#bitacora-form").innerHTML = `<div class="card sub">Guardado en la bitácora.</div>`;
    };
  }

  // ---------------------------------------------------------------- competencia
  function elegirProblemas() {
    const difs = barajar(["facil", "medio", "medio", "dificil", Math.random() < 0.5 ? "medio" : "dificil"]);
    const resuelto = (p) => (Store.estado.problemas[p.slug] || {}).estado === "resuelto";
    return barajar(TEMAS5).map((tema, k) => {
      const pool = D.arena.filter((p) => p.tema === tema);
      // preferencias en orden: dificultad pedida + no resuelto + reserva, y se va relajando
      const filtrosPref = [
        (p) => p.dificultad === difs[k] && !resuelto(p) && p.conjunto === "reserva",
        (p) => p.dificultad === difs[k] && !resuelto(p),
        (p) => !resuelto(p) && p.conjunto === "reserva",
        (p) => !resuelto(p),
        (p) => p.dificultad === difs[k],
        () => true,
      ];
      let candidatos = [], f = 0;
      while (!candidatos.length && f < filtrosPref.length) { candidatos = pool.filter(filtrosPref[f]); f++; }
      return barajar(candidatos)[0].slug;
    });
  }

  function vCompetencia() {
    const c = Store.estado.competencia;
    if (c && !c.fin && Date.now() - c.inicio >= c.duracion * 1000) terminarCompetencia();
    const actual = Store.estado.competencia;
    if (!actual || actual.fin) return vCompetenciaInicio();
    const restante = () => actual.duracion - (Date.now() - actual.inicio) / 1000;
    const st = tablero(actual);
    vista.innerHTML = `
      <div class="comp-cab">
        <h1>Competencia en curso</h1>
        <div class="reloj-grande" id="reloj">${mmss(restante())}</div>
      </div>
      <div class="tiles">
        <div class="tile"><div class="tile-n">${st.resueltos}<small>/5</small></div><div class="tile-l">resueltos (meta: 3)</div></div>
        <div class="tile"><div class="tile-n">${st.penalizacion}</div><div class="tile-l">minutos de penalización</div></div>
      </div>
      <div class="card">
        <table class="tablero"><thead><tr><th></th><th>Problema</th><th>Intentos</th><th>Resuelto en</th><th>Penalización</th></tr></thead>
        <tbody>${actual.problemas.map((x) => {
          const p = PROB[x.slug];
          return `<tr class="${x.resuelto ? "ok" : x.intentos ? "mal" : ""}" data-letra="${x.letra}">
            <td><b>${x.letra}</b></td><td><a href="#/competencia/${x.letra}">${esc(p.nombre)}</a></td>
            <td>${x.intentos}</td><td>${x.resuelto ? mmss(x.minuto * 60) : "—"}</td><td>${x.resuelto ? x.minuto + 20 * (x.intentos - 1) : ""}</td></tr>`;
        }).join("")}</tbody></table>
        <p class="sub">Penalización estilo ICPC: minutos desde el inicio hasta el acierto + 20 por cada envío rechazado antes del acierto.
          Un envío con <code>break</code> cuenta como rechazado. Sin pistas, y el tema no se muestra: identificar la técnica es parte del reto.</p>
        <button class="btn sec" id="terminar">Terminar competencia</button>
      </div>`;
    const t = setInterval(() => {
      const r = restante();
      if ($("#reloj")) $("#reloj").textContent = mmss(r);
      if (r <= 0) { clearInterval(t); terminarCompetencia(); vCompetencia(); }
    }, 1000);
    alSalir(() => clearInterval(t));
    $("#terminar").onclick = () => { if (confirm("¿Terminar la competencia ahora?")) { terminarCompetencia(); vCompetencia(); } };
  }

  function tablero(c) {
    let resueltos = 0, penalizacion = 0;
    for (const x of c.problemas) {
      if (x.resuelto) { resueltos++; penalizacion += x.minuto + 20 * (x.intentos - 1); }
    }
    return { resueltos, penalizacion };
  }

  function vCompetenciaInicio() {
    const sims = Store.estado.simulacros;
    vista.innerHTML = `
      <h1>Modo competencia</h1>
      <div class="card">
        <p>5 problemas aleatorios, uno por tema (dividir y conquistar, backtracking, DP, voraz y NP-completo), con mezcla de dificultades.
        Tienes <b>3 horas</b>. Se prefieren problemas que aún no has resuelto, empezando por la reserva.</p>
        <label>Duración <select id="duracion"><option value="180">3 horas (simulacro completo)</option><option value="90">90 minutos</option><option value="60">60 minutos</option></select></label>
        <button class="btn primario" id="empezar">Empezar competencia</button>
      </div>
      <h2>Historial de simulacros</h2>
      ${sims.length ? `<table class="tablero"><thead><tr><th>Fecha</th><th>Resueltos</th><th>Penalización</th><th>Problemas</th></tr></thead><tbody>
        ${sims.slice().reverse().map((s) => `<tr class="${s.resueltos >= 3 ? "ok" : "mal"}"><td>${new Date(s.inicio).toLocaleString()}</td><td>${s.resueltos}/5</td><td>${s.penalizacion}</td>
          <td>${s.problemas.map((x) => `<a href="#/problema/${x.slug}" class="${x.resuelto ? "ok-t" : "mal-t"}">${esc(PROB[x.slug].nombre)}</a>`).join(", ")}</td></tr>`).join("")}
        </tbody></table>` : `<p class="sub">Aún no has hecho simulacros.</p>`}`;
    $("#empezar").onclick = () => {
      const letras = "ABCDE";
      Store.estado.competencia = {
        inicio: Date.now(), duracion: +$("#duracion").value * 60, fin: null,
        problemas: elegirProblemas().map((slug, i) => ({ letra: letras[i], slug, intentos: 0, resuelto: false, minuto: null })),
      };
      Store.marcarActividad();
      Store.guardar();
      vCompetencia();
    };
  }

  function registrarEnvioCompetencia(letra, veredicto) {
    const c = Store.estado.competencia;
    if (!c || c.fin) return;
    if (Date.now() - c.inicio >= c.duracion * 1000) {
      terminarCompetencia();
      alert("Se acabó el tiempo: este envío ya no cuenta para la competencia.");
      return;
    }
    const x = c.problemas.find((y) => y.letra === letra);
    if (x.resuelto || veredicto === "CE") return;
    x.intentos++;
    if (veredicto === "AC") { x.resuelto = true; x.minuto = Math.floor((Date.now() - c.inicio) / 60000); }
    Store.guardar();
  }

  function terminarCompetencia() {
    const c = Store.estado.competencia;
    if (!c || c.fin) return;
    c.fin = Date.now();
    const st = tablero(c);
    Store.estado.simulacros.push({ inicio: c.inicio, fin: c.fin, problemas: c.problemas.map((x) => ({ ...x })), ...st });
    Store.guardar();
  }

  function vProblemaCompetencia(letra) {
    const c = Store.estado.competencia;
    if (!c || c.fin) return ir("competencia");
    const x = c.problemas.find((y) => y.letra === letra);
    if (!x) return ir("competencia");
    vProblema(PROB[x.slug], { letra });
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
        ${Object.entries(cuenta).sort((x, y) => y[1] - x[1]).map(([k, n]) => `<div class="barra"><span>${esc(CAUSAS[k] || k)}</span>
          <div class="barra-fondo"><div class="barra-lleno" style="width:${(100 * n) / max}%"></div></div><b>${n}</b></div>`).join("")}</div>
        <div class="card"><h3>Para repasar</h3><ul class="bitacora">${b.map((e) => {
          const p = PROB[e.slug];
          return `<li><div><b>${new Date(e.fecha).toLocaleDateString()}</b> · <a href="#/problema/${e.slug}">${esc(p ? p.nombre : e.slug)}</a>
            ${p ? chipTema(p.tema) : ""} <span class="badge b-${e.veredicto}">${esc(Juez.NOMBRES[e.veredicto] || e.veredicto)}</span>
            ${e.modo === "competencia" ? `<span class="chip">competencia</span>` : ""}</div>
            <div>${e.causas.map((k) => `<span class="chip">${esc(CAUSAS[k] || k)}</span>`).join(" ")}</div>
            ${e.nota ? `<div class="nota">${esc(e.nota)}</div>` : ""}</li>`;
        }).join("")}</ul></div>`
        : `<div class="card sub">Aún no hay errores registrados. Después de cada envío fallido la Arena te pide anotar qué falló.</div>`}`;
  }

  // ---------------------------------------------------------------- guias
  function vGuias(tab) {
    const tabs = [["reconocer", "Reconocer la técnica"], ["lectura", "Lectura rápida"], ["plantillas", "Plantillas por tema"], ["quiz", "Quiz de reconocimiento"]];
    let cuerpo = "";
    if (tab === "reconocer") {
      const g = GUIAS.reconocer;
      cuerpo = `<p>${esc(g.intro)}</p>
        <div class="senales">${g.senales.map((s) => `<div class="card senal tema-borde-${s.tema}"><div class="sub">Señal</div><b>${esc(s.senal)}</b>
          <div class="flecha">→ ${esc(s.tecnica)}</div><p>${esc(s.detalle)}</p></div>`).join("")}</div>
        <div class="grid2"><div class="card"><h3>El tamaño delata la complejidad</h3><table class="tablero">${g.tamanos.map(([a, b]) => `<tr><td><b>${esc(a)}</b></td><td>${esc(b)}</td></tr>`).join("")}</table></div>
        <div class="card"><h3>Preguntas en orden</h3><ol>${g.preguntas.map((q) => `<li>${esc(q)}</li>`).join("")}</ol>
        <h3>${esc(g.voraz_contraejemplo.titulo)}</h3><p>${esc(g.voraz_contraejemplo.texto)}</p></div></div>`;
    } else if (tab === "lectura") {
      const g = GUIAS.lectura;
      cuerpo = `<p>${esc(g.intro)}</p>${g.patrones.map((x) => `<div class="card"><h3>${esc(x.nombre)}</h3><pre class="codigo">${esc(x.codigo)}</pre></div>`).join("")}
        <div class="card"><h3>Errores típicos</h3><ul>${g.errores.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>`;
    } else if (tab === "plantillas") {
      cuerpo = `<p class="sub">Todas terminan los ciclos con la condición del while o con banderas: sin <code>break</code>.</p>` +
        GUIAS.plantillas.temas.map((t) => `<h2>${chipTema(t.tema)} ${esc(t.nombre)}</h2>${t.items.map((x) => `<div class="card"><h3>${esc(x.nombre)}</h3><pre class="codigo">${esc(x.codigo)}</pre></div>`).join("")}`).join("");
    } else {
      cuerpo = `<div id="quiz"></div>`;
    }
    vista.innerHTML = `<h1>Guías</h1><div class="tabs">${tabs.map(([k, v]) => `<a href="#/guias/${k}" class="${k === tab ? "activo" : ""}">${v}</a>`).join("")}</div>${cuerpo}`;
    if (tab === "quiz") quiz();
  }

  function quiz() {
    const todos = [...D.arena, ...D.biblioteca].filter((p) => TEMAS5.includes(p.tema));
    let aciertos = 0, total = 0, p = null;
    const nueva = () => {
      p = todos[Math.floor(Math.random() * todos.length)];
      $("#quiz").innerHTML = `<div class="card quiz">
        <p class="sub">Aciertos: ${aciertos}/${total}</p>
        <h3>${esc(p.nombre)}</h3><p>${esc(p.resumen)}</p>
        <div class="opciones">${TEMAS5.map((t) => `<button class="btn sec" data-t="${t}">${esc(NOMBRE_TEMA[t])}</button>`).join("")}</div>
        <div id="quiz-res"></div></div>`;
      $$("#quiz [data-t]").forEach((b) => {
        b.onclick = () => {
          total++;
          const ok = b.dataset.t === p.tema;
          if (ok) aciertos++;
          $$("#quiz [data-t]").forEach((x) => { x.disabled = true; x.classList.toggle("correcta", x.dataset.t === p.tema); });
          $("#quiz-res").innerHTML = `<p class="${ok ? "ok-t" : "mal-t"}"><b>${ok ? "¡Correcto!" : "No."}</b> Técnica: ${esc(NOMBRE_TEMA[p.tema])}. ${esc(p.pista)}</p>
            <button class="btn primario" id="quiz-sig">Siguiente</button>`;
          $("#quiz-sig").onclick = nueva;
          Store.marcarActividad();
          Store.guardar();
        };
      });
    };
    nueva();
  }

  // ---------------------------------------------------------------- progreso
  function vProgreso() {
    const st = estadisticasTema();
    const debil = temaMasDebil();
    const resueltos = Object.entries(Store.estado.problemas).filter(([s, e]) => e.estado === "resuelto" && PROB[s]);
    const dias = Object.keys(Store.estado.actividad).sort().slice(-28);
    vista.innerHTML = `
      <h1>Progreso</h1>
      <div class="tiles">
        <div class="tile"><div class="tile-n">${resueltos.length}</div><div class="tile-l">problemas resueltos</div></div>
        <div class="tile"><div class="tile-n">${Store.racha()}</div><div class="tile-l">días de racha</div></div>
        <div class="tile"><div class="tile-n">${debil ? esc(NOMBRE_TEMA[debil]) : "—"}</div><div class="tile-l">tema más débil</div></div>
        <div class="tile"><div class="tile-n">${Store.estado.simulacros.length}</div><div class="tile-l">simulacros</div></div>
      </div>
      <div class="card"><h3>Por tema (núcleo)</h3>
        ${TEMAS5.map((t) => `<div class="barra"><span>${chipTema(t)}</span>
          <div class="barra-fondo"><div class="barra-lleno tema-fondo-${t}" style="width:${(100 * st[t].resNucleo) / Math.max(1, st[t].total)}%"></div></div>
          <b>${st[t].resNucleo}/${st[t].total}</b><span class="sub">${st[t].exito === null ? "" : `éxito ${Math.round(100 * st[t].exito)}% · ${st[t].errores} error(es)`}</span></div>`).join("")}
      </div>
      <div class="grid2">
        <div class="card"><h3>Resueltos</h3>${resueltos.length ? `<table class="tablero"><tr><th>Problema</th><th>Envíos</th><th>Mejor tiempo</th><th>Pistas</th></tr>
          ${resueltos.map(([s, e]) => `<tr><td><a href="#/problema/${s}">${esc(PROB[s].nombre)}</a></td><td>${e.intentos}</td><td>${e.mejorSeg ? mmss(e.mejorSeg) : "—"}</td>
          <td>${e.pistas || 0}${e.vioSolucion ? " + solución" : ""}</td></tr>`).join("")}</table>` : `<p class="sub">Aún nada.</p>`}</div>
        <div class="card"><h3>Actividad (últimos días con práctica)</h3>
          <div class="calor">${dias.map((d) => `<div title="${d}: ${Store.estado.actividad[d]} acción(es)" style="opacity:${Math.min(1, 0.25 + Store.estado.actividad[d] / 10)}">${d.slice(5)}</div>`).join("") || `<p class="sub">Sin actividad aún.</p>`}</div>
          <h3>Respaldo</h3>
          <p class="sub">El progreso vive en este navegador (localStorage). Expórtalo de vez en cuando.</p>
          <button class="btn sec" id="exportar">Exportar progreso</button>
          <label class="btn sec">Importar… <input type="file" id="importar" accept=".json" hidden></label>
          <button class="btn link" id="borrar">Borrar todo el progreso</button>
        </div>
      </div>`;
    $("#exportar").onclick = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([Store.exportar()], { type: "application/json" }));
      a.download = `arena-ada-progreso-${Store.hoy()}.json`;
      a.click();
    };
    $("#importar").onchange = async (e) => {
      try { Store.importar(await e.target.files[0].text()); vProgreso(); } catch (err) { alert("Archivo inválido: " + err.message); }
    };
    $("#borrar").onclick = () => { if (confirm("¿Borrar TODO el progreso? No se puede deshacer.")) { Store.reiniciarTodo(); vProgreso(); } };
  }

  render();
})();
