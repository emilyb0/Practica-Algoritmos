import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for caso in range(1, t + 1):
        n, k = int(data[i]), int(data[i + 1]); i += 2
        x = data[i:i + n]; i += n
        y = data[i:i + n]; i += n
        ganancias = sorted(int(b) - int(a) for a, b in zip(x, y))
        # descartar (a lo sumo k) los negocios con perdida, empezando por el peor
        j = 0
        while j < k and j < n and ganancias[j] < 0:
            j += 1
        total = sum(ganancias[j:])
        out.append(f"Case {caso}: {total}" if total > 0 else f"Case {caso}: No Profit")
    sys.stdout.write("".join(v + "\n" for v in out))


main()
