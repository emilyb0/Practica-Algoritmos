import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]) if data else 0
    i += 1
    for caso in range(1, t + 1):
        n, tiempo = int(data[i]), int(data[i + 1]); i += 2
        largos = [int(x) for x in data[i:i + n]]; i += n
        cap = min(tiempo - 1, sum(largos))
        dp = [-1] * (cap + 1)
        dp[0] = 0
        # TODO: mochila 0/1 (j de mayor a menor)
        # TODO: elegir el mejor (cantidad, tiempo)
        print(f"Case {caso}: {0} {0}")


main()
