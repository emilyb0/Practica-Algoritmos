import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    while i + 5 < len(data) and any(data[i:i + 6]):
        a, b, c, d, e, f = data[i:i + 6]
        i += 6
        cajas = f + e + d + (c + 3) // 4
        # TODO: huecos de 2x2 y de 1x1
        print(cajas)


main()
