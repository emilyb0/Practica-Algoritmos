import sys
import heapq


def solve(meds, k):
    # monticulo con (proxima toma, prioridad, frecuencia, nombre)
    heap = []
    # TODO: meter cada medicamento con su primera toma (en el minuto f)
    ans = []
    for _ in range(k):
        pass  # TODO: sacar la toma mas cercana, guardarla en ans y volver a meterla con tiempo + f
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
