import sys
from bisect import bisect_left, bisect_right

LIM = 1000000


def construir():
    # TODO: criba con el menor factor primo de cada numero hasta LIM
    # TODO: seq = [1]; agregar seq[-1] + NOD(seq[-1]) mientras no pase LIM
    seq = [1]
    return seq


def solve(seq, a, b):
    # TODO: cuantos terminos de seq caen en [a, b] (bisect_left / bisect_right)
    return 0


def main():
    casos = int(sys.stdin.readline())
    if casos > 0:
        seq = construir()
    for c in range(1, casos + 1):
        a, b = map(int, sys.stdin.readline().split())
        print(f"Case {c}: {solve(seq, a, b)}")


if __name__ == "__main__":
    main()
