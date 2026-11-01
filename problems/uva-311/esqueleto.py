import sys


def solve(a, b, c, d, e, f):
    # voraz: primero los paquetes grandes, luego se rellenan los huecos
    ans = f + e + d + (c + 3) // 4
    # TODO: huecos de 2x2 que dejan los 4x4 y los 3x3; si no alcanzan para b, abrir cajas nuevas
    # TODO: huecos de 1x1 que quedan; si no alcanzan para a, abrir cajas nuevas
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0 0 0 0 0 0":
        a, b, c, d, e, f = map(int, linea.split())
        print(solve(a, b, c, d, e, f))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
