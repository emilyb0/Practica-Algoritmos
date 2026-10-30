import sys


def operaciones(s):
    ops = 0
    while s > 0:
        # TODO: decision voraz
        s -= 1
        ops += 1
    return ops


def main():
    for x in sys.stdin.read().split():
        print(operaciones(int(x)))


main()
