import sys
from collections import deque


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i, caso = 0, 1
    while i < len(data):
        destino = data[i]; i += 1
        ady = [set() for _ in range(21)]
        while data[i] != 0 or data[i + 1] != 0:
            ady[data[i]].add(data[i + 1])
            ady[data[i + 1]].add(data[i])
            i += 2
        i += 2
        ady = [sorted(v) for v in ady]
        alcanza = [False] * 21
        # TODO: BFS desde destino
        rutas, camino, visitado = [], [1], [False] * 21
        visitado[1] = True

        def bt(u):
            # TODO: si u == destino guardar camino; si no, probar vecinos validos
            pass

        bt(1)
        print(f"CASE {caso}:")
        for r in rutas:
            print(r)
        print(f"There are {len(rutas)} routes from the firestation to streetcorner {destino}.")
        caso += 1


main()
