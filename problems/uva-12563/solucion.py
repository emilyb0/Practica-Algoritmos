import sys


def solve(largos, tiempo):
    # mochila 0/1: dp[j] = maximo de canciones que suman exactamente j segundos (-1 si imposible)
    # se deja al menos 1 segundo libre para "Jin Ge Jin Qu"
    cap = min(tiempo - 1, sum(largos))
    dp = [-1] * (cap + 1)
    dp[0] = 0
    for x in largos:
        for j in range(cap, x - 1, -1):
            if dp[j - x] >= 0 and dp[j - x] + 1 > dp[j]:
                dp[j] = dp[j - x] + 1
    # mas canciones; si empatan, mas tiempo
    canciones, segundos = 0, 0
    for j in range(cap + 1):
        if dp[j] > canciones or (dp[j] == canciones and dp[j] >= 0):
            canciones, segundos = dp[j], j
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
