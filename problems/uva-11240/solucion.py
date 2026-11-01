import sys


def solve(seq):
    actual = seq[0]
    ans, bajar = 1, True    # el primer paso debe ser hacia abajo
    for v in seq[1:]:
        if (bajar and v < actual) or (not bajar and v > actual):
            ans += 1
            bajar = not bajar
        # voraz: si no avanzo, me quedo con el mejor extremo para el siguiente paso
        actual = v
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
