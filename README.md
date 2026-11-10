# Arena ADA

Entrenamiento para el examen de ADA en Python: 4 problemas (dividir y conquistar, backtracking, programación dinámica y voraces) en 2 horas 20 minutos. Con 2 aceptados la nota es 5.0, y cada aceptado adicional es bono.

## Cómo abrirla

- **En línea:** https://emilyb0.github.io/Practica-Algoritmos/
- **En tu computador:** `python arena.py` (necesita internet para cargar el editor y Python).

Tu progreso se guarda en el navegador. Para pasarlo a otro navegador o dispositivo, usa **Progreso → Exportar / Importar**.

## Qué tiene

- **Módulos sin fechas.** Bloques de 40 a 60 minutos, cada uno con qué hacer y cuándo cuenta como terminado: lectura de entrada, un módulo por técnica (repaso con animación, plantilla, fáciles, medio y difícil), reconocimiento a ciegas y simulacros. Nada está bloqueado, y si cierras la página retomas donde quedaste.
- **¿Qué hago ahora?** Dices cuánto tiempo tienes y la Arena arma la sesión: primero los repasos de lo que fallaste en sesiones anteriores, luego el bloque que dejaste a medias, después temas intercalados empezando por el más débil.
- **Práctica** por tema y dificultad, con juez en el navegador (Pyodide), escalera de pistas y modo a ciegas que oculta el tema.
- **Rúbrica del examen** en cada problema: nota estimada, por qué cae en su rango y una autoevaluación corta.
- **Simulacro** de 2 h 20 min: una fase de lectura donde estimas la dificultad y ordenas los problemas, avisos de estrategia y un reporte con la nota, el bono, el tiempo por problema y lo que falló.
- **Guías:** animaciones paso a paso de cada técnica con preguntas de predicción, cómo reconocer la técnica y la dificultad, patrones de lectura, y plantillas y esqueletos por tema.

Regla del curso: no se permite `break`. El juez avisa si lo usas.

Todo el código (soluciones, esqueletos y plantillas) sigue la misma estructura: `main` lee la entrada con `sys.stdin.readline()` e imprime, y una función (`phi`, `solve`) resuelve con el algoritmo y retorna la respuesta.

## Estructura

```
index.html, css/, js/   la app
data/problemas.json     catálogo de problemas
problems/<id>/          solución de referencia, esqueleto y casos
tools/                  scripts para regenerar datos y probar
```

Para probar todo: `python tools/check_solutions.py` y, con la Arena corriendo, `node tools/prueba_navegador.mjs`.
