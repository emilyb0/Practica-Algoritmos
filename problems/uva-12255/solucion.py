import sys
from math import isqrt


def necesarios(m, k, d, guardias):
    # francotiradores necesarios si todos se ubican a profundidad m
    intervalos = []
    ok = True
    for x, y in guardias:
        h = y - k + m
        if h > d:
            ok = False
        else:
            w = isqrt(d * d - h * h)
            intervalos.append((x + w, x - w))
    if not ok:
        return float("inf")
    intervalos.sort()
    usados, ultimo = 0, None
    for fin, ini in intervalos:
        if ultimo is None or ini > ultimo:
            usados += 1
            ultimo = fin
    return usados


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]) if data else 0
    i += 1
    out = []
    for caso in range(1, t + 1):
        k, n, s, d = (int(x) for x in data[i:i + 4]); i += 4
        guardias = [(int(data[i + 2 * j]), int(data[i + 2 * j + 1])) for j in range(n)]
        i += 2 * n
        if necesarios(1, k, d, guardias) > s:
            out.append(f"Case {caso}: IMPOSSIBLE")
        else:
            lo, hi = 1, d
            while lo < hi:
                mid = (lo + hi + 1) // 2
                if necesarios(mid, k, d, guardias) <= s:
                    lo = mid
                else:
                    hi = mid - 1
            out.append(f"Case {caso}: {lo}")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
