import sys


def posible(s, w, vh, puertas):
    # TODO: propagar [lo, hi] puerta a puerta (escalado por s)
    return True


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for _ in range(t):
        w, vh, n = int(data[i]), int(data[i + 1]), int(data[i + 2]); i += 3
        puertas = [(int(data[i + 2 * k]), int(data[i + 2 * k + 1])) for k in range(n)]
        i += 2 * n
        ns = int(data[i]); i += 1
        esquis = sorted(int(x) for x in data[i:i + ns]); i += ns
        # TODO: busqueda binaria del mayor indice factible
        print("IMPOSSIBLE")


main()
