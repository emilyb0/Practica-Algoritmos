import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for caso in range(1, t + 1):
        n = int(data[i]); i += 1
        filas = [int(data[i + r][::-1], 2) for r in range(n + 1)]; i += n + 1
        total = 1 << n
        dp = [0] * total
        dp[0] = 1
        # TODO: armas por mascara y transiciones
        print(f"Case {caso}: {dp[total - 1]}")


main()
