import sys


def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    out = []
    for caso in range(1, t + 1):
        n, k = int(data[2 * caso - 1]), int(data[2 * caso])
        # costo[i][j] = peso total comido (sumando todos los casos) si la dulce esta en i..j
        costo = [[0] * (n + 2) for _ in range(n + 2)]
        for largo in range(2, n + 1):
            for i in range(1, n - largo + 2):
                j = i + largo - 1
                mejor = None
                for m in range(i, j + 1):
                    c = largo * (k + m) + costo[i][m - 1] + costo[m + 1][j]
                    if mejor is None or c < mejor:
                        mejor = c
                costo[i][j] = mejor
        out.append(f"Case {caso}: {costo[1][n]}")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
