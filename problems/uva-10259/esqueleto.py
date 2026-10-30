import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    salidas = []
    for _ in range(t):
        n, k = int(data[i]), int(data[i + 1]); i += 2
        g = [[int(data[i + r * n + c]) for c in range(n)] for r in range(n)]
        i += n * n
        mejor = [[0] * n for _ in range(n)]
        # TODO: recorrer celdas de mayor a menor valor y calcular mejor[r][c]
        salidas.append(str(mejor[0][0]))
    print("\n\n".join(salidas))


main()
