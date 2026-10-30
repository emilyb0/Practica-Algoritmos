import sys
from bisect import bisect_left, bisect_right

LIM = 1000000


def construir():
    # menor factor primo de cada numero (criba) para factorizar rapido
    spf = list(range(LIM + 1))
    i = 2
    while i * i <= LIM:
        if spf[i] == i:
            for j in range(i * i, LIM + 1, i):
                if spf[j] == j:
                    spf[j] = i
        i += 1
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


def main():
    data = sys.stdin.read().split()
    t = int(data[0]) if data else 0
    seq = construir() if t > 0 else []
    out = []
    for c in range(t):
        a, b = int(data[1 + 2 * c]), int(data[2 + 2 * c])
        out.append(f"Case {c + 1}: {bisect_right(seq, b) - bisect_left(seq, a)}")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
