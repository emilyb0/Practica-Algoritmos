import sys


def raiz(padre, a):
    while padre[a] != a:
        padre[a] = padre[padre[a]]
        a = padre[a]
    return a


def kruskal(v, aristas, prohibida):
    # aristas ordenadas por costo; se ignora la arista con indice 'prohibida'
    padre = list(range(v + 1))
    costo, usadas = 0, []
    for idx in range(len(aristas)):
        c, a, b = aristas[idx]
        if idx != prohibida:
            ra, rb = raiz(padre, a), raiz(padre, b)
            if ra != rb:
                padre[ra] = rb
                costo += c
                usadas.append(idx)
    if len(usadas) != v - 1:
        costo = None    # el grafo no queda conectado
    return costo, usadas


def solve(v, aristas):
    costo, arbol = kruskal(v, aristas, -1)
    if costo is None:
        ans = "No way"
    else:
        # segundo mejor: quitar una a una las aristas del arbol minimo
        segundo = None
        for idx in arbol:
            c, _ = kruskal(v, aristas, idx)
            if c is not None and (segundo is None or c < segundo):
                segundo = c
        if segundo is None:
            ans = "No second way"
        else:
            ans = str(segundo)
    return ans


def main():
    casos = int(sys.stdin.readline())
    for caso in range(1, casos + 1):
        v, e = map(int, sys.stdin.readline().split())
        aristas = []
        for _ in range(e):
            a, b, c = map(int, sys.stdin.readline().split())
            aristas.append((c, a, b))
        aristas.sort()
        print(f"Case #{caso} : {solve(v, aristas)}")


if __name__ == "__main__":
    main()
