import sys


def phi(g, n, k, r, c, mem):
    # maximo de monedas empezando en (r, c); solo se salta a celdas con mas monedas
    if (r, c) in mem:
        ans = mem[(r, c)]
    else:
        extra = 0
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            for paso in range(1, k + 1):
                rr, cc = r + dr * paso, c + dc * paso
                if 0 <= rr < n and 0 <= cc < n and g[rr][cc] > g[r][c]:
                    extra = max(extra, phi(g, n, k, rr, cc, mem))
        ans = g[r][c] + extra
        mem[(r, c)] = ans
    return ans


def main():
    casos = int(sys.stdin.readline())
    for caso in range(casos):
        sys.stdin.readline()                     # linea en blanco antes de cada caso
        n, k = map(int, sys.stdin.readline().split())
        g = []
        for _ in range(n):
            g.append(list(map(int, sys.stdin.readline().split())))
        if caso > 0:
            print()                              # linea en blanco entre salidas
        print(phi(g, n, k, 0, 0, dict()))


if __name__ == "__main__":
    main()
