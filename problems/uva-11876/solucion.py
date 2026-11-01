import sys
from bisect import bisect_left, bisect_right

LIM = 1000000


def construir():
    # spf[x] = menor factor primo de x (criba), para contar divisores rapido
    spf = list(range(LIM + 1))
    i = 2
    while i * i <= LIM:
        if spf[i] == i:
            for j in range(i * i, LIM + 1, i):
                if spf[j] == j:
                    spf[j] = i
        i += 1
    # seq = 1, 1 + NOD(1), ... hasta pasar LIM
    seq = [1]
    while seq[-1] <= LIM:
        x, nod = seq[-1], 1
        while x > 1:
            p, e = spf[x], 0
            while x % p == 0:
                x //= p
                e += 1
            nod *= e + 1
        seq.append(seq[-1] + nod)
    return seq


def solve(seq, a, b):
    # cuantos terminos de seq caen en [a, b] (busqueda binaria)
    return bisect_right(seq, b) - bisect_left(seq, a)


def main():
    casos = int(sys.stdin.readline())
    if casos > 0:
        seq = construir()
    for c in range(1, casos + 1):
        a, b = map(int, sys.stdin.readline().split())
        print(f"Case {c}: {solve(seq, a, b)}")


if __name__ == "__main__":
    main()
