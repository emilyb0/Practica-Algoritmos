import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for _ in range(t):
        n, k = int(data[i]), int(data[i + 1]); i += 2
        g = [[int(data[i + r * n + c]) for c in range(n)] for r in range(n)]
        i += n * n
        # mejor[r][c] = monedas maximas empezando en (r, c).
        # Se calcula de mayor a menor valor: los saltos solo van a celdas con mas monedas.
        celdas = sorted(((g[r][c], r, c) for r in range(n) for c in range(n)), reverse=True)
        mejor = [[0] * n for _ in range(n)]
        for v, r, c in celdas:
            extra = 0
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                for paso in range(1, k + 1):
                    rr, cc = r + dr * paso, c + dc * paso
                    if 0 <= rr < n and 0 <= cc < n and g[rr][cc] > v:
                        extra = max(extra, mejor[rr][cc])
            mejor[r][c] = v + extra
        out.append(str(mejor[0][0]))
    sys.stdout.write("\n\n".join(out) + ("\n" if out else ""))


main()
