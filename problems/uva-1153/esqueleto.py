import sys
import heapq


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    salidas = []
    for _ in range(t):
        n = int(data[i]); i += 1
        pedidos = sorted((int(data[i + 2 * j + 1]), int(data[i + 2 * j])) for j in range(n))
        i += 2 * n
        aceptados, tiempo = [], 0
        for fecha, q in pedidos:
            # TODO: aceptar y, si tiempo > fecha, quitar el mas largo
            pass
        salidas.append(str(len(aceptados)))
    print("\n\n".join(salidas))


main()
