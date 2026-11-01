"""Construye js/data.js (los datos que usa la app) a partir de:
  data/problemas.json          catalogo completo
  problems/<id>/meta.json      conjunto (nucleo/reserva) y ejemplos oficiales
  problems/<id>/solucion.py    solucion de referencia (genera las salidas esperadas)
  problems/<id>/esqueleto.py   esqueleto con TODOs (pista 3)
  tools/contenido.py           pistas y casos borde

Tambien escribe problems/<id>/casos.json para consultarlos.
Uso: python tools/build_arena.py
"""
import ast
import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from contenido import CONTENIDO  # noqa: E402


def slug(pid):
    return pid.lower().replace(" ", "-")


def correr(sol, entrada):
    t0 = time.perf_counter()
    r = subprocess.run([sys.executable, str(sol)], input=entrada, capture_output=True,
                       text=True, timeout=120, encoding="utf-8")
    if r.returncode != 0:
        raise RuntimeError(f"{sol} fallo:\n{r.stderr}")
    return r.stdout, time.perf_counter() - t0


def tiene_break(codigo):
    return any(isinstance(n, ast.Break) for n in ast.walk(ast.parse(codigo)))


def main():
    catalogo = json.loads((ROOT / "data" / "problemas.json").read_text(encoding="utf-8"))
    arena, biblioteca = [], []
    for p in catalogo["problemas"]:
        d = ROOT / "problems" / slug(p["id"])
        if not (d / "meta.json").exists():
            biblioteca.append(p)
            continue
        meta = json.loads((d / "meta.json").read_text(encoding="utf-8"))
        c = CONTENIDO[d.name]
        sol_path = d / "solucion.py"
        solucion = sol_path.read_text(encoding="utf-8")
        esqueleto = (d / "esqueleto.py").read_text(encoding="utf-8")
        for nombre, codigo in (("solucion", solucion), ("esqueleto", esqueleto)):
            if tiene_break(codigo):
                sys.exit(f"{d.name}: el {nombre} usa break")

        casos = []
        for k, ej in enumerate(meta["ejemplos"], 1):
            casos.append({"nombre": f"ejemplo {k}" if len(meta["ejemplos"]) > 1 else "ejemplo del enunciado",
                          "entrada": ej["entrada"], "salida": ej["salida"], "ejemplo": True})
        lento = 0.0
        for nombre, entrada in c["casos"]():
            salida, seg = correr(sol_path, entrada)
            lento = max(lento, seg)
            casos.append({"nombre": nombre, "entrada": entrada, "salida": salida, "ejemplo": False})
        (d / "casos.json").write_text(json.dumps(casos, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"{d.name:12s} {meta['conjunto']:8s} {len(casos)} casos, caso mas lento {lento:.2f}s")

        arena.append({**p, "slug": d.name, "conjunto": meta["conjunto"],
                      "pistas": [c["pista1"], c["pista2"]], "esqueleto": esqueleto,
                      "solucion": solucion, "casos": casos,
                      "limite": c.get("limite", 10), "comparador": c.get("comparador", "exacto")})

    datos = {"temas": catalogo["temas"], "arena": arena,
             "biblioteca": [{k: p[k] for k in ("id", "nombre", "enlace", "enunciado_curso", "semestres",
                                                "tema", "dificultad", "resumen", "pista")} for p in biblioteca]}
    js = "// Generado por tools/build_arena.py. No editar a mano.\nwindow.ARENA_DATA = " + \
         json.dumps(datos, ensure_ascii=False) + ";\n"
    (ROOT / "js" / "data.js").write_text(js, encoding="utf-8")
    nucleo = sum(1 for a in arena if a["conjunto"] == "nucleo")
    print(f"\njs/data.js: {nucleo} nucleo, {len(arena) - nucleo} reserva, {len(biblioteca)} en biblioteca "
          f"({len(js) / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
