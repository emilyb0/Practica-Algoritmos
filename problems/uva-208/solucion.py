import sys
from collections import deque


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i, caso, out = 0, 1, []
    while i < len(data):
        destino = data[i]; i += 1
        ady = [set() for _ in range(21)]
        while data[i] != 0 or data[i + 1] != 0:
            a, b = data[i], data[i + 1]
            ady[a].add(b)
            ady[b].add(a)
            i += 2
        i += 2
        ady = [sorted(v) for v in ady]
        # poda: solo sirven esquinas desde las que se puede llegar al destino
        alcanza = [False] * 21
        alcanza[destino] = True
        cola = deque([destino])
        while cola:
            u = cola.popleft()
            for v in ady[u]:
                if not alcanza[v]:
                    alcanza[v] = True
                    cola.append(v)
        rutas = []
        camino, visitado = [1], [False] * 21
        visitado[1] = True

        def bt(u):
            if u == destino:
                rutas.append(" ".join(map(str, camino)))
            else:
                for v in ady[u]:
                    if not visitado[v] and alcanza[v]:
                        visitado[v] = True
                        camino.append(v)
                        bt(v)
                        camino.pop()
                        visitado[v] = False

        if alcanza[1]:
            bt(1)
        out.append(f"CASE {caso}:")
        out.extend(rutas)
        out.append(f"There are {len(rutas)} routes from the firestation to streetcorner {destino}.")
        caso += 1
    sys.stdout.write("".join(x + "\n" for x in out))


main()
