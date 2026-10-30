# Arena ADA

Entrenamiento de 3 semanas para la mini competencia de ADA: 5 problemas en 3 horas, en Python.

## Cómo abrirla

- **En línea:** https://emilyb0.github.io/Practica-Algoritmos/
- **En tu computador:** `python arena.py` (necesita internet para cargar el editor y Python).

Tu progreso se guarda en el navegador. Para pasarlo a otro navegador o dispositivo, usa **Progreso → Exportar / Importar**.

## Qué tiene

- **Práctica** por tema y dificultad, con juez en el navegador (Pyodide), pistas y casos borde.
- **Competencia** de 3 horas con 5 problemas y penalización estilo ICPC.
- **Plan de 21 días** con repasos espaciados, bitácora de errores y Pomodoro.
- **Guías** para reconocer la técnica, leer la entrada y plantillas por tema.

Regla del curso: no se permite `break`. El juez avisa si lo usas.

## Estructura

```
index.html, css/, js/   la app
data/problemas.json     catálogo de problemas
problems/<id>/          solución de referencia, esqueleto y casos
tools/                  scripts para regenerar datos y probar
```
