import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    while i + 1 < len(data) and (data[i] != 0 or data[i + 1] != 0):
        n, m = data[i], data[i + 1]; i += 2
        ady = [[] for _ in range(n)]
        for e in range(m):
            a, b = data[i], data[i + 1]; i += 2
            ady[a].append((b, e))
            ady[b].append((a, e))
        usada = [False] * m
        mejor = 0
        # TODO: bt(u, largo) desde cada nodo
        print(mejor)


main()
