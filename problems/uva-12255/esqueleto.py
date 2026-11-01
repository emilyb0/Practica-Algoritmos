import sys
from math import isqrt


def necesarios(m, k, d, guardias):
    # francotiradores necesarios si todos se ubican a profundidad m (voraz por intervalos)
    intervalos = []
    alcanza = True
    # TODO: para cada guardia, el intervalo del eje x desde donde se le alcanza a distancia d
    if not alcanza:
        ans = float("inf")
    else:
        ans = 0  # TODO: minimo de puntos que tocan todos los intervalos (ordenar por fin)
    return ans


def solve(k, s, d, guardias):
    if necesarios(1, k, d, guardias) > s:
        ans = "IMPOSSIBLE"
    else:
        lo, hi = 1, d
        # TODO: busqueda binaria de la mayor profundidad que sigue alcanzando con s
        ans = str(lo)
    return ans


def main():
    casos = int(sys.stdin.readline())
    for caso in range(1, casos + 1):
        sys.stdin.readline()                       # linea en blanco antes de cada caso
        k, n, s, d = map(int, sys.stdin.readline().split())
        guardias = []
        for _ in range(n):
            x, y = map(int, sys.stdin.readline().split())
            guardias.append((x, y))
        print(f"Case {caso}: {solve(k, s, d, guardias)}")


if __name__ == "__main__":
    main()
