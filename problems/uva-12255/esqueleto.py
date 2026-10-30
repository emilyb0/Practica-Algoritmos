import sys
from math import isqrt


def necesarios(m, k, d, guardias):
    # TODO: intervalos por guardia y conteo voraz de puntos
    return 0


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]) if data else 0
    i += 1
    for caso in range(1, t + 1):
        k, n, s, d = (int(x) for x in data[i:i + 4]); i += 4
        guardias = [(int(data[i + 2 * j]), int(data[i + 2 * j + 1])) for j in range(n)]
        i += 2 * n
        # TODO: IMPOSSIBLE si con M = 1 no alcanza; si no, busqueda binaria de M
        print(f"Case {caso}: ")


main()
