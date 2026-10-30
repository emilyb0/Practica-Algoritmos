import sys


def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    for caso in range(1, t + 1):
        n, k = int(data[2 * caso - 1]), int(data[2 * caso])
        costo = [[0] * (n + 2) for _ in range(n + 2)]
        for largo in range(2, n + 1):
            for i in range(1, n - largo + 2):
                j = i + largo - 1
                # TODO: probar cada m en i..j y quedarse con el minimo
        print(f"Case {caso}: {costo[1][n]}")


main()
