import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    bloques = []
    for _ in range(t):
        n = int(data[i]); i += 1
        g = data[i:i + n]; i += n
        palabras = set()
        actual = []

        def bt(r, c):
            actual.append(g[r][c])
            if len(actual) >= 3:
                palabras.add("".join(actual))
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    rr, cc = r + dr, c + dc
                    # solo letras estrictamente mayores: no hace falta marcar visitados
                    if 0 <= rr < n and 0 <= cc < n and g[rr][cc] > g[r][c]:
                        bt(rr, cc)
            actual.pop()

        for r in range(n):
            for c in range(n):
                bt(r, c)
        bloques.append("".join(p + "\n" for p in sorted(palabras, key=lambda p: (len(p), p))))
    sys.stdout.write("\n".join(bloques))


main()
