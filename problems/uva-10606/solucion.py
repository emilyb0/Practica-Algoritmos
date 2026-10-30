import sys


def raiz_entera(n):
    # mayor r con r*r <= n, por busqueda binaria
    lo, hi = 0, 1
    while hi * hi <= n:
        hi *= 2
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if mid * mid <= n:
            lo = mid
        else:
            hi = mid - 1
    return lo


def main():
    data = sys.stdin.read().split()
    i, out = 0, []
    while i < len(data) and data[i] != "0":
        r = raiz_entera(int(data[i]))
        out.append(str(r * r))
        i += 1
    sys.stdout.write("".join(x + "\n" for x in out))


main()
