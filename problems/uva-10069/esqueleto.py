import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for _ in range(t):
        x, z = data[i], data[i + 1]; i += 2
        dp = [1] + [0] * len(z)
        for c in x:
            # TODO: actualizar dp de derecha a izquierda
            pass
        print(dp[len(z)])


main()
