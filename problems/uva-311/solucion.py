import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i, out = 0, []
    while i + 5 < len(data) and any(data[i:i + 6]):
        a, b, c, d, e, f = data[i:i + 6]
        i += 6
        # voraz: primero los grandes, luego se rellenan los huecos
        cajas = f + e + d + (c + 3) // 4
        huecos2 = 5 * d + [0, 5, 3, 1][c % 4]
        if b > huecos2:
            cajas += (b - huecos2 + 8) // 9
        huecos1 = 36 * cajas - 36 * f - 25 * e - 16 * d - 9 * c - 4 * b
        if a > huecos1:
            cajas += (a - huecos1 + 35) // 36
        out.append(str(cajas))
    sys.stdout.write("".join(x + "\n" for x in out))


main()
