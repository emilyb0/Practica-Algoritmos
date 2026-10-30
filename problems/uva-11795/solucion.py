import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for caso in range(1, t + 1):
        n = int(data[i]); i += 1
        filas = [int(data[i + r][::-1], 2) for r in range(n + 1)]; i += n + 1
        buster, armas = filas[0], filas[1:]
        total = 1 << n
        # armas_de[mask] = lo que se puede destruir tras destruir los robots de 'mask'
        armas_de = [buster] * total
        for mask in range(1, total):
            bajo = mask & -mask
            armas_de[mask] = armas_de[mask ^ bajo] | armas[bajo.bit_length() - 1]
        dp = [0] * total
        dp[0] = 1
        for mask in range(total):
            if dp[mask]:
                libres = armas_de[mask] & ~mask & (total - 1)
                while libres:
                    bajo = libres & -libres
                    dp[mask | bajo] += dp[mask]
                    libres ^= bajo
        out.append(f"Case {caso}: {dp[total - 1]}")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
