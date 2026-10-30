import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    m = data[i]; i += 1
    for _ in range(m):
        n, k = data[i], data[i + 1]; i += 2
        ady = [set() for _ in range(n + 1)]
        for _ in range(k):
            a, b = data[i], data[i + 1]; i += 2
            ady[a].add(b)
            ady[b].add(a)
        negro = [False] * (n + 1)
        mejor, actual = [], []

        def bt(v):
            nonlocal mejor
            # TODO: poda; si v > n actualizar mejor; si no, probar negro y luego blanco
            pass

        bt(1)
        print(len(mejor))
        print(" ".join(map(str, mejor)))


main()
