import sys
from bisect import bisect_left, bisect_right


def nod(x):
    # TODO: numero de divisores de x (factorizando)
    return 1


def main():
    data = sys.stdin.read().split()
    t = int(data[0]) if data else 0
    seq = [1]
    while seq[-1] <= 1000000:
        seq.append(seq[-1] + nod(seq[-1]))
    for c in range(1, t + 1):
        a, b = int(data[2 * c - 1]), int(data[2 * c])
        # TODO: contar con bisect
        print(f"Case {c}: {0}")


main()
