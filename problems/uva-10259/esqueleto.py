import sys


def phi(g, n, k, r, c, mem):
    # maximo de monedas empezando en (r, c); solo se salta a celdas con mas monedas
    if (r, c) in mem:
        ans = mem[(r, c)]
    else:
        extra = 0
        # TODO: para cada direccion y cada paso de 1 a k, si la celda existe y tiene mas monedas,
        #       extra = max(extra, phi(... de esa celda ...))
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
