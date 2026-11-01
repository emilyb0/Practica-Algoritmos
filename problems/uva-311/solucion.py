import sys


def solve(a, b, c, d, e, f):
    # voraz: primero los paquetes grandes, luego se rellenan los huecos
    ans = f + e + d + (c + 3) // 4
    huecos2 = 5 * d + [0, 5, 3, 1][c % 4]       # huecos de 2x2 que dejan los 4x4 y 3x3
    if b > huecos2:
        ans += (b - huecos2 + 8) // 9
    huecos1 = 36 * ans - 36 * f - 25 * e - 16 * d - 9 * c - 4 * b
    if a > huecos1:
        ans += (a - huecos1 + 35) // 36
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0 0 0 0 0 0":
        a, b, c, d, e, f = map(int, linea.split())
        print(solve(a, b, c, d, e, f))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
