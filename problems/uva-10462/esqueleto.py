import sys


def kruskal(v, aristas, prohibida):
    padre = list(range(v + 1))

    def raiz(a):
        while padre[a] != a:
            a = padre[a]
        return a

    costo, usadas = 0, []
    # TODO: recorrer aristas ordenadas (saltando 'prohibida') y unir componentes
    return (costo, usadas) if len(usadas) == v - 1 else (None, usadas)


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for caso in range(1, t + 1):
        v, e = int(data[i]), int(data[i + 1]); i += 2
        aristas = sorted((int(data[i + 3 * j + 2]), int(data[i + 3 * j]), int(data[i + 3 * j + 1])) for j in range(e))
        i += 3 * e
        # TODO: "No way", "No second way" o el segundo costo
        print(f"Case #{caso} : ")


main()
