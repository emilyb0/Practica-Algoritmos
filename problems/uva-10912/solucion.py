import sys

MAXS = 351  # 1 + 2 + ... + 26


def tabla():
    # dp[l][s] = cadenas estrictamente crecientes de largo l y suma s
    dp = [[0] * (MAXS + 1) for _ in range(27)]
    dp[0][0] = 1
    for letra in range(1, 27):
        for l in range(letra, 0, -1):
            for s in range(MAXS, letra - 1, -1):
                dp[l][s] += dp[l - 1][s - letra]
    return dp


def main():
    data = sys.stdin.read().split()
    dp = tabla()
    i, caso, out = 0, 1, []
    seguir = len(data) >= 2 and not (data[0] == "0" and data[1] == "0")
    while seguir:
        l, s = int(data[i]), int(data[i + 1])
        r = dp[l][s] if l <= 26 and s <= MAXS else 0
        out.append(f"Case {caso}: {r}")
        caso += 1
        i += 2
        seguir = i + 1 < len(data) and not (data[i] == "0" and data[i + 1] == "0")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
