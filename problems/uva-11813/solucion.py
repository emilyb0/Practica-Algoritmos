import sys
import heapq


def dijkstra(ady, n, origen):
    dist = [float("inf")] * n
    dist[origen] = 0
    pq = [(0, origen)]
    while pq:
        du, u = heapq.heappop(pq)
        if du == dist[u]:
            for v, w in ady[u]:
                if du + w < dist[v]:
                    dist[v] = du + w
                    heapq.heappush(pq, (du + w, v))
    return dist


def phi(mask, j, d, todos, mem):
    # TSP: menor distancia para visitar las tiendas que faltan desde el punto j y volver a casa
    # punto 0 = casa, punto k+1 = tienda k
    if (mask, j) in mem:
        ans = mem[(mask, j)]
    else:
        if mask == todos:
            ans = d[j][0]
        else:
            ans = float("inf")
            for k in range(len(d) - 1):
                if not mask & (1 << k):
                    ans = min(ans, d[j][k + 1] + phi(mask | (1 << k), k + 1, d, todos, mem))
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
        # distancias reales entre casa y tiendas (Dijkstra desde cada una)
        dist = [dijkstra(ady, n, p) for p in puntos]
        d = [[dist[a][puntos[b]] for b in range(s + 1)] for a in range(s + 1)]
        print(phi(0, 0, d, (1 << s) - 1, dict()))


if __name__ == "__main__":
    main()
