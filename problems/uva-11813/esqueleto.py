import sys
import heapq


def dijkstra(ady, n, origen):
    dist = [float("inf")] * n
    dist[origen] = 0
    pq = [(0, origen)]
    # TODO: Dijkstra con heapq
    return dist


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for _ in range(t):
        n, m = int(data[i]), int(data[i + 1]); i += 2
        ady = [[] for _ in range(n)]
        for _ in range(m):
            x, y, d = int(data[i]), int(data[i + 1]), int(data[i + 2]); i += 3
            ady[x].append((y, d))
            ady[y].append((x, d))
        s = int(data[i]); i += 1
        puntos = [0] + [int(x) for x in data[i:i + s]]; i += s
        # TODO: matriz de distancias entre puntos y TSP con mascaras
        print(0)


main()
