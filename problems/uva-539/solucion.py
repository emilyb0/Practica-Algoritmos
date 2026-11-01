import sys


def solve(u, ady, usada):
    # camino mas largo saliendo de u sin repetir aristas
    ans = 0
    for v, e in ady[u]:
        if not usada[e]:
            usada[e] = True
            ans = max(ans, 1 + solve(v, ady, usada))
            usada[e] = False
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0 0":
        n, m = map(int, linea.split())
        ady = [[] for _ in range(n)]
        for e in range(m):
            a, b = map(int, sys.stdin.readline().split())
            ady[a].append((b, e))
            ady[b].append((a, e))
        ans = 0
        for u in range(n):
            ans = max(ans, solve(u, ady, [False] * m))
        print(ans)
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
