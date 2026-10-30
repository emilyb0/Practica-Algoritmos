import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]) if data else 0
    i += 1
    out = []
    for caso in range(1, t + 1):
        n, tiempo = int(data[i]), int(data[i + 1]); i += 2
        largos = [int(x) for x in data[i:i + n]]; i += n
        cap = min(tiempo - 1, sum(largos))
        # dp[j] = maximo de canciones que suman exactamente j segundos (-1 si imposible)
        dp = [-1] * (cap + 1)
        dp[0] = 0
        for x in largos:
            for j in range(cap, x - 1, -1):
                if dp[j - x] >= 0 and dp[j - x] + 1 > dp[j]:
                    dp[j] = dp[j - x] + 1
        mejor_c, mejor_t = 0, 0
        for j in range(cap + 1):
            if dp[j] > mejor_c or (dp[j] == mejor_c and dp[j] >= 0):
                mejor_c, mejor_t = dp[j], j
        out.append(f"Case {caso}: {mejor_c + 1} {mejor_t + 678}")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
