import sys


def phi(x, z):
    # dp[j] = formas de formar z[:j] con lo que va leido de x
    m = len(z)
    dp = [1] + [0] * m
    for c in x:
        for j in range(m, 0, -1):    # de derecha a izquierda para no usar c dos veces
            pass  # TODO: si z[j - 1] == c, sumar dp[j - 1] a dp[j]
    return dp[m]


def main():
    casos = int(sys.stdin.readline())
    for _ in range(casos):
        x = sys.stdin.readline().strip()
        z = sys.stdin.readline().strip()
        print(phi(x, z))


if __name__ == "__main__":
    main()
