import sys


def phi(n):
    # g(n): sumar los digitos hasta que quede uno solo
    if n < 10:
        ans = n
    else:
        s = 0
        # TODO: sumar los digitos de n en s (n % 10 y n //= 10)
        ans = 0  # TODO: llamar phi con la suma
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0":
        n = int(linea)
        print(phi(n))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
