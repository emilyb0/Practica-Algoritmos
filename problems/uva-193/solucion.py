import sys


def solve(v, n, ady, negro, actual, mejor):
    # decide el color del nodo v; mejor guarda la mayor coloracion encontrada
    # poda: ni pintando de negro todos los que faltan se supera al mejor
    if len(actual) + (n - v + 1) > len(mejor):
        if v > n:
            mejor[:] = actual
        else:
            # probar negro primero da la solucion lexicograficamente menor
            puede = True
            for u in ady[v]:
                if negro[u]:
                    puede = False
            if puede:
                negro[v] = True
                actual.append(v)
                solve(v + 1, n, ady, negro, actual, mejor)
                actual.pop()
                negro[v] = False
            solve(v + 1, n, ady, negro, actual, mejor)    # v queda blanco


def main():
    casos = int(sys.stdin.readline())
    for _ in range(casos):
        n, k = map(int, sys.stdin.readline().split())
        ady = [set() for _ in range(n + 1)]
        for _ in range(k):
            a, b = map(int, sys.stdin.readline().split())
            if a != b:
                ady[a].add(b)
                ady[b].add(a)
        mejor = []
        solve(1, n, ady, [False] * (n + 1), [], mejor)
        print(len(mejor))
        print(" ".join(map(str, mejor)))


if __name__ == "__main__":
    main()
