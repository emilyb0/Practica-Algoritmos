import sys


def kruskal(v, aristas, prohibida):
    padre = list(range(v + 1))

    def raiz(a):
        while padre[a] != a:
            padre[a] = padre[padre[a]]
            a = padre[a]
        return a

    costo, usadas = 0, []
    for idx, (c, a, b) in enumerate(aristas):
        if idx != prohibida:
            ra, rb = raiz(a), raiz(b)
            if ra != rb:
                padre[ra] = rb
                costo += c
                usadas.append(idx)
    return (costo, usadas) if len(usadas) == v - 1 else (None, usadas)


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for caso in range(1, t + 1):
        v, e = int(data[i]), int(data[i + 1]); i += 2
        aristas = sorted((int(data[i + 3 * j + 2]), int(data[i + 3 * j]), int(data[i + 3 * j + 1])) for j in range(e))
        i += 3 * e
        costo, arbol = kruskal(v, aristas, -1)
        if costo is None:
            r = "No way"
        else:
            segundo = None
            for idx in arbol:
                c, _ = kruskal(v, aristas, idx)
                if c is not None and (segundo is None or c < segundo):
                    segundo = c
            r = "No second way" if segundo is None else str(segundo)
        out.append(f"Case #{caso} : {r}")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
