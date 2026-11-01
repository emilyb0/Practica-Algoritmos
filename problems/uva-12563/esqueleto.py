import sys


def solve(largos, tiempo):
    # mochila 0/1: dp[j] = maximo de canciones que suman exactamente j segundos (-1 si imposible)
    cap = min(tiempo - 1, sum(largos))    # se deja 1 segundo para "Jin Ge Jin Qu"
    dp = [-1] * (cap + 1)
    dp[0] = 0
    for x in largos:
        for j in range(cap, x - 1, -1):
            pass  # TODO: si dp[j - x] es posible, dp[j] = max(dp[j], dp[j - x] + 1)
    canciones, segundos = 0, 0
    # TODO: recorrer dp y quedarse con mas canciones; si empatan, mas segundos
    return canciones + 1, segundos + 678


def main():
    casos = int(sys.stdin.readline())
    for caso in range(1, casos + 1):
        n, t = map(int, sys.stdin.readline().split())
        largos = list(map(int, sys.stdin.readline().split()))
        canciones, segundos = solve(largos, t)
        print(f"Case {caso}: {canciones} {segundos}")


if __name__ == "__main__":
    main()
