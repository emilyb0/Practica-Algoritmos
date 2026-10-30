# Arena ADA

Entrenamiento de 3 semanas para la mini competencia de ADA (Análisis y Diseño de Algoritmos):
5 problemas en 3 horas, en Python, con meta de resolver 3.

## Cómo abrirla

### En línea (GitHub Pages)

https://emilyb0.github.io/Practica-Algoritmos/

Tu progreso se guarda en ese navegador y sigue ahí cada vez que vuelvas a abrir el enlace.

### En tu computador

Necesitas Python 3 y conexión a internet (para cargar el editor y Python en el navegador).

```
python arena.py
```

Se abre el navegador en `http://127.0.0.1:8000/`. Para cerrarla, `Ctrl+C` en la terminal.

> No abras `index.html` con doble clic: el juez usa un Web Worker y el navegador lo bloquea
> si la página no se sirve por `http://`. Usa siempre `python arena.py`.

La primera vez que juzgues un código, Python (Pyodide) tarda unos segundos en cargar. Después queda en caché.

## Qué tiene

| Sección | Qué hace |
|---|---|
| **Inicio** | Tareas de hoy según el plan, repasos espaciados pendientes, racha, tema más débil y último simulacro. |
| **Plan 21 días** | Calendario con checklist diario (ver abajo). Puedes cambiar la fecha de inicio. |
| **Práctica** | Filtra por tema, dificultad y conjunto. Cada problema tiene resumen, enlaces al enunciado, ejemplo, recuerdo activo, editor, juez, escalera de pistas y campo Feynman. |
| **Competencia** | 5 problemas aleatorios (uno por tema, dificultades mezcladas), cronómetro de 3 h y marcador con penalización estilo ICPC (minutos hasta el acierto + 20 por envío rechazado). No muestra el tema y no hay pistas. |
| **Bitácora** | Cada envío fallido te pide marcar qué falló (lectura, técnica, caso borde, tiempo, formato, break). Aquí ves los errores más frecuentes y la lista para repasar. |
| **Guías** | Cómo reconocer la técnica, lectura rápida de entrada, plantillas por tema y un quiz de reconocimiento con los 105 problemas del catálogo. |
| **Progreso** | Avance por tema, resueltos con tiempos y pistas usadas, actividad, exportar/importar el progreso. |

### El juez

- Ejecuta tu código con Pyodide (CPython 3.12 en el navegador) leyendo los casos por `stdin`, y compara la salida **exacta**.
- Cada problema tiene el ejemplo del enunciado más casos borde: entrada vacía o solo el terminador, `n = 0`/`n = 1`, empates, valores máximos y un caso grande.
- Veredictos: Correcto, Respuesta incorrecta (con la primera línea distinta), Error de presentación (solo difieren espacios o saltos de línea finales), Error en ejecución (con el traceback), Tiempo excedido, Error de sintaxis.
- **Regla del curso, sin `break`:** el juez revisa tu código y te dice en qué líneas usas `break`. Un envío con `break` no cuenta como resuelto, ni en práctica ni en competencia.
- Los problemas con salida decimal (Pie, Closest Pair, Need for Speed) aceptan una diferencia de hasta 0.0002, como el enunciado original.

### Escalera de pistas

Pista 1 (qué técnica) → Pista 2 (idea clave) → Pista 3 (esqueleto con TODOs). La solución completa solo aparece si la pides y confirmas.

## Los problemas

`data/problemas.json` tiene el catálogo completo: **105 problemas**. Salen de las tareas de ADA de 2024-1, 2024-2, 2025-1, 2025-2 y 2026-1 en camilorocha.info, más algunos vistos en clase y 4 clásicos de UVa marcados como `extra` para completar NP. Cada uno trae: id, nombre, enlace oficial, PDF de la tarea del curso, semestres, tema, dificultad, resumen, pista y resultado de la verificación del enlace.

Para no abrumarte, la Arena usa solo una parte:

| Conjunto | Cantidad | Uso |
|---|---|---|
| `nucleo` | 30 | Los problemas del plan de 21 días (12 fáciles, 13 medios, 5 difíciles). |
| `reserva` | 9 | No aparecen en el plan: se guardan para que los simulacros tengan problemas nuevos. |
| `biblioteca` | 66 | Sin juez. Sirven como lectura extra y para el quiz de reconocimiento. |

Los ejemplos de entrada/salida vienen del PDF de la tarea del profesor, porque su formato a veces cambia respecto a UVa (por ejemplo, varios casos en vez de uno). Lee siempre el enunciado del curso.

## El plan de 21 días

- **Semana 1:** lectura de entrada y fáciles de cada tema (2 problemas por día).
- **Semana 2:** medios y quiz diario de reconocimiento rápido de técnica.
- **Semana 3:** difíciles y un simulacro completo de 3 horas los días 15, 17, 19 y 21.

Técnicas que usa:

- **Práctica intercalada:** cada día mezcla temas distintos.
- **Repetición espaciada:** cada problema fallado vuelve a tus repasos a los 1, 3 y 7 días (en Inicio).
- **Recuerdo activo:** el editor se desbloquea solo cuando escribes en 2 líneas qué técnica usarás y por qué.
- **Técnica Feynman:** cada problema tiene un campo para explicar la solución con tus palabras.
- **Pomodoro:** el reloj de arriba a la derecha alterna 50 min de trabajo y 10 de descanso.

## Tu progreso

Se guarda en `localStorage` del navegador: problemas resueltos, tiempos, borradores de código, bitácora, repasos, racha, simulacros y checklist del plan. Usa siempre el mismo navegador. En **Progreso → Exportar** puedes descargar un respaldo.

La versión en línea y la local (`python arena.py`) guardan su progreso por separado, lo mismo que dos navegadores o dos dispositivos. Para pasar tu progreso de uno a otro, usa **Progreso → Exportar** en el primero e **Importar** en el segundo.

## Estructura

```
arena.py                  servidor local (un solo comando)
index.html, css/, js/     la app (HTML + CSS + JS, sin backend)
  js/judge.js             juez: ejecuta casos y compara salidas
  js/pyworker.js          Web Worker con Pyodide
  js/app.js               vistas e interacción
  js/storage.js           progreso, racha, repasos (localStorage)
  js/plan.js, js/guias.js contenido del plan y de las guías
  js/data.js              datos generados (no editar a mano)
data/problemas.json       catálogo completo (105 problemas)
problems/<id>/            por problema: solucion.py (referencia), esqueleto.py, meta.json, casos.json
tools/
  build_catalog.py        regenera el catálogo (--verify comprueba los enlaces)
  contenido.py            pistas, esqueletos y generadores de casos borde
  build_arena.py          corre las soluciones de referencia y genera js/data.js
  check_solutions.py      verifica referencias contra los ejemplos oficiales y que no usen break
  prueba_navegador.mjs    prueba de punta a punta en Chrome sin interfaz
```

Las soluciones de referencia están en `problems/<id>/solucion.py`. Si las abres antes de intentar, el entrenamiento pierde sentido.

## Cómo se verificó

- `python tools/check_solutions.py`: las 39 soluciones de referencia reproducen el ejemplo oficial de cada problema y ninguna usa `break`.
- Se compararon 13 soluciones contra fuerza bruta en entradas pequeñas aleatorias.
- Con la Arena corriendo (`python arena.py --no-abrir`), `node tools/prueba_navegador.mjs` abre Chrome sin interfaz y comprueba:
  - una solución correcta da **Correcto** y una incorrecta da **Respuesta incorrecta**;
  - el uso de `break` se detecta, el error de sintaxis da CE y un ciclo infinito da tiempo excedido;
  - las 39 referencias pasan todos sus casos dentro de Pyodide;
  - las 65 plantillas y esqueletos compilan y no usan `break`;
  - funcionan el bloqueo por recuerdo activo, la bitácora con sus repasos, la competencia y todas las vistas.

## Si cambias algo

```
python tools/build_catalog.py --verify   # si cambias el catálogo
python tools/build_arena.py              # si cambias soluciones, pistas o casos
python tools/check_solutions.py
```
