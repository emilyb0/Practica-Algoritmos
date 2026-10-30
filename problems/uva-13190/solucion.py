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
            heap.append((f, p, f, nombre))
        heapq.heapify(heap)
        for _ in range(k):
            tiempo, p, f, nombre = heapq.heappop(heap)
            out.append(f"{tiempo} {nombre}")
            heapq.heappush(heap, (tiempo + f, p, f, nombre))
    sys.stdout.write("".join(x + "\n" for x in out))


main()
