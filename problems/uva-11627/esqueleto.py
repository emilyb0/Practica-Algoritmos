import sys


def posible(s, w, vh, puertas):
    # todo se escala por s para trabajar con enteros:
    # en dy metros de bajada el esquiador se mueve a lo sumo vh*dy/s de lado
    x0, y0 = puertas[0]
    lo, hi = x0 * s, (x0 + w) * s
    ans = True
    k = 1
    while ans and k < len(puertas):
        # TODO: ampliar [lo, hi] por el alcance lateral e intersecar con la puerta k
        k += 1
    return ans


def solve(esquis, w, vh, puertas):
    # busqueda binaria: mayor indice con velocidad factible (mas lento siempre es mas facil)
    lo, hi = -1, len(esquis) - 1
    while lo < hi:
        mid = (lo + hi + 1) // 2
        # TODO: si posible(esquis[mid], ...), lo = mid; si no, hi = mid - 1
        hi = mid - 1
    if lo < 0:
        ans = "IMPOSSIBLE"
    else:
        ans = str(esquis[lo])
    return ans


def main():
    casos = int(sys.stdin.readline())
    for _ in range(casos):
        w, vh, n = map(int, sys.stdin.readline().split())
        puertas = []
        for _ in range(n):
            x, y = map(int, sys.stdin.readline().split())
            puertas.append((x, y))
        s = int(sys.stdin.readline())
        esquis = []
        for _ in range(s):
            esquis.append(int(sys.stdin.readline()))
        esquis.sort()
        print(solve(esquis, w, vh, puertas))


if __name__ == "__main__":
    main()
