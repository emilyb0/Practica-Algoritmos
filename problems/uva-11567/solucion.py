import sys


def solve(s):
    # se trabaja hacia atras: de s hasta 0
    ans = 0
    while s > 0:
        if s % 2 == 0:
            s //= 2
        elif s == 3 or s % 4 == 1:
            s -= 1
        else:
            s += 1
        ans += 1
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":
        print(solve(int(linea)))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
