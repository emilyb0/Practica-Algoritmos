import sys


def main():
    data = sys.stdin.read().split()
    i, out = 0, []
    while i < len(data):
        n, t = int(data[i]), int(data[i + 1]); i += 2
        d = [int(x) for x in data[i:i + 2 * n:2]]
        s = [int(x) for x in data[i + 1:i + 2 * n:2]]
        i += 2 * n
        # el tiempo total decrece cuando c crece: biseccion
        lo, hi = -min(s), 1e7
        for _ in range(200):
            c = (lo + hi) / 2
            tiempo = sum(di / (si + c) for di, si in zip(d, s))
            if tiempo > t:
                lo = c
            else:
                hi = c
        out.append(f"{hi:.4f}")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
