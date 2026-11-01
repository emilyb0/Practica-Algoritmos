import sys


def solve(g, n, r, c, actual, palabras):
    actual.append(g[r][c])
    if len(actual) >= 3:
        palabras.add("".join(actual))
    for dr in (-1, 0, 1):
        for dc in (-1, 0, 1):
            rr, cc = r + dr, c + dc
            # solo letras estrictamente mayores: no hace falta marcar visitados
            if 0 <= rr < n and 0 <= cc < n and g[rr][cc] > g[r][c]:
                solve(g, n, rr, cc, actual, palabras)
    actual.pop()


def main():
    casos = int(sys.stdin.readline())
    for caso in range(casos):
        sys.stdin.readline()                       # linea en blanco antes de cada caso
        n = int(sys.stdin.readline())
        g = []
        for _ in range(n):
            g.append(sys.stdin.readline().strip())
        palabras = set()
        for r in range(n):
            for c in range(n):
                solve(g, n, r, c, [], palabras)
        if caso > 0:
            print()                                # linea en blanco entre salidas
        for p in sorted(palabras, key=lambda p: (len(p), p)):
            print(p)


if __name__ == "__main__":
    main()
