import sys


def phi(n):
    # g(n): sumar los digitos hasta que quede uno solo
    if n < 10:
        ans = n
    else:
        s = 0
        while n > 0:
            s += n % 10
            n //= 10
        ans = phi(s)
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0":
        n = int(linea)
        print(phi(n))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
