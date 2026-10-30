import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    m = data[i]; i += 1
    out = []
    for _ in range(m):
        n, k = data[i], data[i + 1]; i += 2
        ady = [set() for _ in range(n + 1)]
        for _ in range(k):
            a, b = data[i], data[i + 1]; i += 2
            if a != b:
                ady[a].add(b)
                ady[b].add(a)
        negro = [False] * (n + 1)
        mejor = []
        actual = []

        def bt(v):
            nonlocal mejor
            # poda: ni pintando todos los restantes se supera al mejor
            if len(actual) + (n - v + 1) > len(mejor):
                if v > n:
                    mejor = actual[:]
                else:
                    # probar negro primero da la solucion lexicograficamente menor
                    if not any(negro[u] for u in ady[v]):
                        negro[v] = True
                        actual.append(v)
                        bt(v + 1)
                        actual.pop()
                        negro[v] = False
                    bt(v + 1)

        bt(1)
        out.append(str(len(mejor)))
        out.append(" ".join(map(str, mejor)))
    sys.stdout.write("".join(x + "\n" for x in out))


main()
