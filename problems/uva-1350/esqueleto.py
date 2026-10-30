import sys


def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    pesos = [1, 2]
    # TODO: completar pesos con la recurrencia hasta superar 10^9
    for c in range(1, t + 1):
        k = int(data[c])
        digitos = []
        # TODO: desde el mayor peso <= k hacia abajo, poner "1" si cabe (y restar) o "0"
        print("".join(digitos))


main()
