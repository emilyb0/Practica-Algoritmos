import sys
from math import isqrt


def necesarios(m, k, d, guardias):
    # francotiradores necesarios si todos se ubican a profundidad m (voraz por intervalos)
    intervalos = []
    alcanza = True
    for x, y in guardias:
        h = y - k + m
        if h > d:
            alcanza = False
        else:
            w = isqrt(d * d - h * h)
            intervalos.append((x + w, x - w))    # (fin, inicio)
    if not alcanza:
        ans = float("inf")
    else:
        intervalos.sort()
        ans, ultimo = 0, None
        for fin, ini in intervalos:
            if ultimo is None or ini > ultimo:
                ans += 1
                ultimo = fin
    return ans


def solve(k, s, d, guardias):
    if necesarios(1, k, d, guardias) > s:
        ans = "IMPOSSIBLE"
    else:
        # busqueda binaria: la mayor profundidad que sigue alcanzando con s francotiradores
        lo, hi = 1, d
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if necesarios(mid, k, d, guardias) <= s:
                lo = mid
            else:
                hi = mid - 1
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
