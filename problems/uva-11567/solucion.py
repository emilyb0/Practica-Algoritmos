import sys


def operaciones(s):
    # se trabaja hacia atras: de s hasta 0
    ops = 0
    while s > 0:
        if s % 2 == 0:
            s //= 2
        elif s == 3 or s % 4 == 1:
            s -= 1
        else:
            s += 1
        ops += 1
    return ops


def main():
    out = [str(operaciones(int(x))) for x in sys.stdin.read().split()]
    sys.stdout.write("".join(x + "\n" for x in out))


main()
