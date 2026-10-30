import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for _ in range(t):
        x, z = data[i], data[i + 1]; i += 2
        m = len(z)
        # dp[j] = formas de formar z[:j] con lo leido de x
        dp = [1] + [0] * m
        for c in x:
            for j in range(m, 0, -1):
                if z[j - 1] == c:
                    dp[j] += dp[j - 1]
        out.append(str(dp[m]))
    sys.stdout.write("".join(x + "\n" for x in out))


main()
