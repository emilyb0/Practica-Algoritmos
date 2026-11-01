import sys
from collections import deque


def alcanzables(ady, destino):
    # esquinas desde las que se puede llegar al destino (BFS), para podar
    ans = [False] * 21
    ans[destino] = True
    cola = deque([destino])
    while cola:
        u = cola.popleft()
        for v in ady[u]:
            if not ans[v]:
                ans[v] = True
                cola.append(v)
    return ans


def solve(u, destino, ady, alcanza, visitado, camino, rutas):
    if u == destino:
        rutas.append(" ".join(map(str, camino)))
    else:
        for v in ady[u]:
            if not visitado[v] and alcanza[v]:
                visitado[v] = True
                camino.append(v)
                solve(v, destino, ady, alcanza, visitado, camino, rutas)
                camino.pop()
                visitado[v] = False


def main():
    caso = 1
    linea = sys.stdin.readline().strip()
    while linea != "":
        destino = int(linea)
        ady = [set() for _ in range(21)]
        linea = sys.stdin.readline().strip()
        while linea != "0 0":
            a, b = map(int, linea.split())
            ady[a].add(b)
            ady[b].add(a)
            linea = sys.stdin.readline().strip()
        ady = [sorted(v) for v in ady]    # en orden para imprimir las rutas en orden
        alcanza = alcanzables(ady, destino)
        rutas = []
        visitado = [False] * 21
        visitado[1] = True
        if alcanza[1]:
            solve(1, destino, ady, alcanza, visitado, [1], rutas)
        print(f"CASE {caso}:")
        for ruta in rutas:
            print(ruta)
        print(f"There are {len(rutas)} routes from the firestation to streetcorner {destino}.")
        caso += 1
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
