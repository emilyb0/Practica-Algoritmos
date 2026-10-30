import sys


def posible(s, w, vh, puertas):
    # Todo se escala por s para trabajar con enteros:
    # en dy metros de bajada el esquiador se mueve a lo sumo vh*dy/s de lado.
    x0, y0 = puertas[0]
    lo, hi = x0 * s, (x0 + w) * s
    ok = True
    k = 1
    while ok and k < len(puertas):
        x, y = puertas[k]
        alcance = vh * (y - y0)
        lo, hi = max(lo - alcance, x * s), min(hi + alcance, (x + w) * s)
        ok = lo <= hi
        y0 = y
        k += 1
    return ok


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for _ in range(t):
        w, vh, n = int(data[i]), int(data[i + 1]), int(data[i + 2]); i += 3
        puertas = [(int(data[i + 2 * k]), int(data[i + 2 * k + 1])) for k in range(n)]
        i += 2 * n
        ns = int(data[i]); i += 1
        esquis = sorted(int(x) for x in data[i:i + ns]); i += ns
        # mayor indice con velocidad factible (mas lento siempre es mas facil)
        lo, hi = -1, ns - 1
        while lo < hi:
            mid = (lo + hi + 1) // 2
            if posible(esquis[mid], w, vh, puertas):
                lo = mid
            else:
                hi = mid - 1
        out.append("IMPOSSIBLE" if lo < 0 else str(esquis[lo]))
    sys.stdout.write("".join(x + "\n" for x in out))


main()
