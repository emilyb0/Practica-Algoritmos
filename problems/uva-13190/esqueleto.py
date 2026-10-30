import sys
import heapq


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for _ in range(t):
        n, k = int(data[i]), int(data[i + 1]); i += 2
        heap = []
        for p in range(n):
            nombre, f = data[i], int(data[i + 1]); i += 2
            # TODO: agregar (primer tiempo, prioridad p, f, nombre)
        heapq.heapify(heap)
        for _ in range(k):
            # TODO: sacar el menor, agregar "tiempo nombre" a out y reinsertarlo
            pass
    print("\n".join(out))


main()
