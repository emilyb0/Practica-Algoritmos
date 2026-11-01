import sys
import heapq


def dijkstra(ady, n, origen):
    dist = [float("inf")] * n
    dist[origen] = 0
    pq = [(0, origen)]
    # TODO: Dijkstra con heapq (ignorar entradas viejas del monticulo)
    return dist


def phi(mask, j, d, todos, mem):
    # TSP: menor distancia para visitar las tiendas que faltan desde el punto j y volver a casa
    if (mask, j) in mem:
        ans = mem[(mask, j)]
    else:
        if mask == todos:
            ans = 0  # TODO
        else:
            ans = float("inf")
            # TODO: probar cada tienda k que no este en mask
        mem[(mask, j)] = ans
    return ans


def main():
    casos = int(sys.stdin.readline())
    for _ in range(casos):
        n, m = map(int, sys.stdin.readline().split())
        ady = [[] for _ in range(n)]
        for _ in range(m):
            x, y, w = map(int, sys.stdin.readline().split())
            ady[x].append((y, w))
            ady[y].append((x, w))
        s = int(sys.stdin.readline())
        puntos = [0]
        for _ in range(s):
            puntos.append(int(sys.stdin.readline()))
        dist = [dijkstra(ady, n, p) for p in puntos]
        d = [[dist[a][puntos[b]] for b in range(s + 1)] for a in range(s + 1)]
        print(phi(0, 0, d, (1 << s) - 1, dict()))


if __name__ == "__main__":
    main()
