"""Verifica las soluciones de referencia.

- Corre problems/<id>/solucion.py con cada ejemplo oficial y compara la salida exacta.
- Revisa que ninguna solucion, esqueleto o plantilla use `break`.

Uso: python tools/check_solutions.py [id ...]
"""
import ast
import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROBLEMS = ROOT / "problems"
sys.path.insert(0, str(ROOT / "tools"))
from contenido import CONTENIDO  # noqa: E402


def iguales(obtenida, esperada, comparador):
    if obtenida == esperada:
        return True
    if comparador.startswith("tolerancia"):
        eps = float(comparador.split(":")[1])
        a, b = obtenida.split(), esperada.split()

        def cerca(x, y):
            try:
                return abs(float(x) - float(y)) <= eps + 1e-9
            except ValueError:
                return x == y
        return len(a) == len(b) and all(cerca(x, y) for x, y in zip(a, b))
    return False


def usa_break(codigo):
    return [n.lineno for n in ast.walk(ast.parse(codigo)) if isinstance(n, ast.Break)]


def correr(sol, entrada, timeout=60):
    t0 = time.perf_counter()
    r = subprocess.run([sys.executable, str(sol)], input=entrada, capture_output=True,
                       text=True, timeout=timeout, encoding="utf-8")
    return r.stdout, r.stderr, time.perf_counter() - t0


def main():
    ids = sys.argv[1:] or sorted(p.name for p in PROBLEMS.iterdir() if (p / "solucion.py").exists())
    fallas = 0
    for pid in ids:
        d = PROBLEMS / pid
        for nombre in ("solucion.py", "esqueleto.py"):
            f = d / nombre
            if f.exists():
                lineas = usa_break(f.read_text(encoding="utf-8"))
                if lineas:
                    print(f"[BREAK] {pid}/{nombre} lineas {lineas}")
                    fallas += 1
        meta = json.loads((d / "meta.json").read_text(encoding="utf-8"))
        for k, ej in enumerate(meta["ejemplos"]):
            out, err, seg = correr(d / "solucion.py", ej["entrada"])
            ok = iguales(out, ej["salida"], CONTENIDO[pid].get("comparador", "exacto"))
            if not ok:
                fallas += 1
                print(f"[FALLA] {pid} ejemplo {k + 1} ({seg:.2f}s)\n--- esperado\n{ej['salida']}--- obtenido\n{out}{err}")
            else:
                print(f"[ok] {pid} ejemplo {k + 1} ({seg:.2f}s)")
    print("TODO BIEN" if fallas == 0 else f"{fallas} problema(s)")
    sys.exit(1 if fallas else 0)


if __name__ == "__main__":
    main()
