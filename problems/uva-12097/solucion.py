import sys
import math


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for _ in range(t):
        n, f = int(data[i]), int(data[i + 1]); i += 2
        areas = [math.pi * int(r) ** 2 for r in data[i:i + n]]; i += n
        personas = f + 1
        lo, hi = 0.0, max(areas)
        for _ in range(100):
            mid = (lo + hi) / 2
            piezas = sum(int(a // mid) for a in areas)
            if piezas >= personas:
                lo = mid
            else:
                hi = mid
        out.append(f"{lo:.4f}")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
