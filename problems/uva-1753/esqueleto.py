import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    while i < len(data):
        n, t = int(data[i]), int(data[i + 1]); i += 2
        d = [int(x) for x in data[i:i + 2 * n:2]]
        s = [int(x) for x in data[i + 1:i + 2 * n:2]]
        i += 2 * n
        lo, hi = -min(s), 1e7
        for _ in range(200):
            c = (lo + hi) / 2
            # TODO: calcular el tiempo total con c y mover lo o hi
        print(f"{hi:.4f}")


main()
