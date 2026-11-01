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
    # TODO: Kruskal; guardar en usadas los indices de las aristas que entran al arbol
    if len(usadas) != v - 1:
        costo = None    # el grafo no queda conectado
    return costo, usadas


def solve(v, aristas):
    costo, arbol = kruskal(v, aristas, -1)
    if costo is None:
        ans = "No way"
    else:
        segundo = None
        # TODO: para cada arista del arbol, correr kruskal sin ella y quedarse con el menor costo
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
