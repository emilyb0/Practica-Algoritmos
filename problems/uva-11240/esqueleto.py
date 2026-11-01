import sys


def solve(seq):
    actual = seq[0]
    ans, bajar = 1, True    # el primer paso debe ser hacia abajo
    for v in seq[1:]:
        # TODO: si v va en la direccion que toca, sumar 1 y cambiar de direccion
        actual = v          # voraz: siempre me quedo con el ultimo valor
    return ans


def main():
    casos = int(sys.stdin.readline())
    for _ in range(casos):
        linea = list(map(int, sys.stdin.readline().split()))
        n = linea[0]
        seq = linea[1:n + 1]
        print(solve(seq))


if __name__ == "__main__":
    main()
