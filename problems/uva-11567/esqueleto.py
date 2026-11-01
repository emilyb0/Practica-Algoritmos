import sys


def solve(s):
    # se trabaja hacia atras: de s hasta 0
    ans = 0
    while s > 0:
        # TODO: si s es par, dividir; si es impar, decidir entre s - 1 y s + 1 (mirar s % 4)
        s -= 1
        ans += 1
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":
        print(solve(int(linea)))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
