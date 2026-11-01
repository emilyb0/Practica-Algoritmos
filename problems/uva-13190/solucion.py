import sys
import heapq


def solve(meds, k):
    # monticulo con (proxima toma, prioridad, frecuencia, nombre): siempre sale la toma mas cercana
    heap = []
    for p in range(len(meds)):
        nombre, f = meds[p]
        heap.append((f, p, f, nombre))
    heapq.heapify(heap)
    ans = []
    for _ in range(k):
        tiempo, p, f, nombre = heapq.heappop(heap)
        ans.append(f"{tiempo} {nombre}")
        heapq.heappush(heap, (tiempo + f, p, f, nombre))
    return ans


def main():
    casos = int(sys.stdin.readline())
    for _ in range(casos):
        n, k = map(int, sys.stdin.readline().split())
        meds = []
        for _ in range(n):
            nombre, f = sys.stdin.readline().split()
            meds.append((nombre, int(f)))
        ans = solve(meds, k)
        for toma in ans:
            print(toma)


if __name__ == "__main__":
    main()
