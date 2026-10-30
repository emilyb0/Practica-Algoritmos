import sys


def raiz_entera(n):
    lo, hi = 0, 1
    while hi * hi <= n:
        hi *= 2
    # TODO: busqueda binaria del mayor r con r*r <= n
    return lo


def main():
    data = sys.stdin.read().split()
    i = 0
    while i < len(data) and data[i] != "0":
        r = raiz_entera(int(data[i]))
        print(r * r)
        i += 1


main()
