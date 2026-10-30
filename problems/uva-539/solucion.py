import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i, out = 0, []
    while i + 1 < len(data) and (data[i] != 0 or data[i + 1] != 0):
        n, m = data[i], data[i + 1]; i += 2
        ady = [[] for _ in range(n)]
        for e in range(m):
            a, b = data[i], data[i + 1]; i += 2
            ady[a].append((b, e))
            ady[b].append((a, e))
        usada = [False] * m
        mejor = 0

        def bt(u, largo):
            nonlocal mejor
            mejor = max(mejor, largo)
            for v, e in ady[u]:
                if not usada[e]:
                    usada[e] = True
                    bt(v, largo + 1)
                    usada[e] = False

        for u in range(n):
            bt(u, 0)
        out.append(str(mejor))
    sys.stdout.write("".join(x + "\n" for x in out))


main()
