import sys


def solve(n):
    # mayor r con r*r <= n (n puede tener 100 digitos: no usar float)
    lo, hi = 0, 1
    while hi * hi <= n:
        hi *= 2
    while lo < hi:
        mid = (lo + hi + 1) // 2
        # TODO: si mid*mid <= n, lo = mid; si no, hi = mid - 1
        hi = mid - 1
    return lo


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0":
        n = int(linea)
        r = solve(n)
        print(r * r)
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
