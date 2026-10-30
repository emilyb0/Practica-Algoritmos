import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    t = data[i]; i += 1
    out = []
    for _ in range(t):
        i += 2  # tamano del mundo (no se necesita)
        sx, sy = data[i], data[i + 1]; i += 2
        b = data[i]; i += 1
        pts = [(sx, sy)] + [(data[i + 2 * k], data[i + 2 * k + 1]) for k in range(b)]
        i += 2 * b
        d = [[abs(p[0] - q[0]) + abs(p[1] - q[1]) for q in pts] for p in pts]
        INF = float("inf")
        # dp[mascara][ultimo] = menor distancia visitando 'mascara' y terminando en 'ultimo'
        dp = [[INF] * b for _ in range(1 << b)]
        for j in range(b):
            dp[1 << j][j] = d[0][j + 1]
        for mask in range(1, 1 << b):
            for j in range(b):
                if dp[mask][j] < INF:
                    for k in range(b):
                        if not mask & (1 << k):
                            c = dp[mask][j] + d[j + 1][k + 1]
                            if c < dp[mask | (1 << k)][k]:
                                dp[mask | (1 << k)][k] = c
        res = min(dp[(1 << b) - 1][j] + d[j + 1][0] for j in range(b)) if b > 0 else 0
        out.append(f"The shortest path has length {res}")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
