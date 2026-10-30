import sys


def main():
    for linea in sys.stdin.read().split("\n"):
        l = linea.split()
        if l:
            n, m = int(l[0]), int(l[1])
            jugadas = [int(x) for x in l[2:2 + m]]
            gana = bytearray(n + 1)
            # TODO: llenar gana[1..n]
            print("Stan wins" if gana[n] else "Ollie wins")


main()
