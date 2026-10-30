import sys


def alcanzable(regla, n, estado):
    objetivo = [int(c) for c in estado]
    sale = [(regla >> v) & 1 for v in range(8)]
    p = [0] * n

    def bt(i):
        if i == n - 1:
            # TODO: verificar celdas n-1 y 0 (dan la vuelta)
            return False
        ok, b = False, 0
        while not ok and b <= 1:
            p[i + 1] = b
            # TODO: si i >= 1, la celda i debe dar objetivo[i]
            b += 1
        return ok

    # TODO: probar p[0] = 0 y p[0] = 1
    return False


def main():
    data = sys.stdin.read().split()
    for i in range(0, len(data) - 2, 3):
        r, n, s = int(data[i]), int(data[i + 1]), data[i + 2]
        print("REACHABLE" if alcanzable(r, n, s) else "GARDEN OF EDEN")


main()
