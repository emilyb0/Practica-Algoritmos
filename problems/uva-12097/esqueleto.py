import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for _ in range(t):
        n, f = int(data[i]), int(data[i + 1]); i += 2
        areas = []  # TODO: pi * r^2 para cada radio
        i += n
        lo, hi = 0.0, max(areas)
        for _ in range(100):
            mid = (lo + hi) / 2
            # TODO: contar porciones de tamano mid y mover lo o hi
        print(f"{lo:.4f}")


main()
