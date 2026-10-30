import sys
import heapq


def dijkstra(ady, n, origen):
    dist = [float("inf")] * n
    dist[origen] = 0
    pq = [(0, origen)]
    while pq:
        d, u = heapq.heappop(pq)
        if d == dist[u]:
            for v, w in ady[u]:
                if d + w < dist[v]:
                    dist[v] = d + w
                    heapq.heappush(pq, (d + w, v))
    return dist


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for _ in range(t):
        n, m = int(data[i]), int(data[i + 1]); i += 2
        ady = [[] for _ in range(n)]
        for _ in range(m):
            x, y, d = int(data[i]), int(data[i + 1]), int(data[i + 2]); i += 3
            ady[x].append((y, d))
            ady[y].append((x, d))
        s = int(data[i]); i += 1
        puntos = [0] + [int(x) for x in data[i:i + s]]; i += s
        dist = [dijkstra(ady, n, p) for p in puntos]
        d = [[dist[a][puntos[b]] for b in range(s + 1)] for a in range(s + 1)]
        # TSP con mascara de bits sobre las tiendas: dp[mascara][ultima]
        INF = float("inf")
        todas = (1 << s) - 1
        dp = [[INF] * s for _ in range(1 << s)]
        for j in range(s):
            dp[1 << j][j] = d[0][j + 1]
        for mask in range(1, 1 << s):
            for j in range(s):
                if dp[mask][j] < INF:
                    for nxt in range(s):
                        if not mask & (1 << nxt):
                            nm = mask | (1 << nxt)
                            c = dp[mask][j] + d[j + 1][nxt + 1]
                            if c < dp[nm][nxt]:
                                dp[nm][nxt] = c
        out.append(str(min(dp[todas][j] + d[j + 1][0] for j in range(s))))
    sys.stdout.write("".join(x + "\n" for x in out))


main()
