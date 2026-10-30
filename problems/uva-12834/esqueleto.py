import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for caso in range(1, t + 1):
        n, k = int(data[i]), int(data[i + 1]); i += 2
        x = data[i:i + n]; i += n
        y = data[i:i + n]; i += n
        ganancias = sorted(int(b) - int(a) for a, b in zip(x, y))
        # TODO: avanzar un indice j mientras j < k y ganancias[j] < 0
        total = 0
        print(f"Case {caso}: {total}" if total > 0 else f"Case {caso}: No Profit")


main()
