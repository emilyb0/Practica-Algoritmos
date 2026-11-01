import sys


def phi(n, k):
    # costo[i][j] = peso total comido si la dulce esta en i..j
    costo = [[0] * (n + 2) for _ in range(n + 2)]
    for largo in range(2, n + 1):
        for i in range(1, n - largo + 2):
            j = i + largo - 1
            # TODO: probar cada m en i..j como primera manzana:
            #       largo * (k + m) + costo[i][m - 1] + costo[m + 1][j], y quedarse con el minimo
    return costo[1][n]


def main():
    casos = int(sys.stdin.readline())
    for caso in range(1, casos + 1):
        n, k = map(int, sys.stdin.readline().split())
        print(f"Case {caso}: {phi(n, k)}")


if __name__ == "__main__":
    main()
