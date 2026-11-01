import sys


def phi(n, k):
    # costo[i][j] = peso total comido (sumando todos los casos) si la dulce esta en i..j
    costo = [[0] * (n + 2) for _ in range(n + 2)]
    for largo in range(2, n + 1):
        for i in range(1, n - largo + 2):
            j = i + largo - 1
            mejor = None
            for m in range(i, j + 1):    # m = la primera manzana que se prueba
                c = largo * (k + m) + costo[i][m - 1] + costo[m + 1][j]
                if mejor is None or c < mejor:
                    mejor = c
            costo[i][j] = mejor
    return costo[1][n]


def main():
    casos = int(sys.stdin.readline())
    for caso in range(1, casos + 1):
        n, k = map(int, sys.stdin.readline().split())
        print(f"Case {caso}: {phi(n, k)}")


if __name__ == "__main__":
    main()
