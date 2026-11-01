import sys
import heapq


def solve(pedidos):
    # pedidos = [(fecha limite, duracion)] ordenados por fecha limite
    aceptados = []    # monticulo de maximos (duraciones con signo negativo)
    tiempo = 0
    for fecha, q in pedidos:
        pass  # TODO: aceptar el pedido; si me paso de la fecha, quitar el mas largo
    return len(aceptados)


def main():
    casos = int(sys.stdin.readline())
    for caso in range(casos):
        sys.stdin.readline()                      # linea en blanco antes de cada caso
        n = int(sys.stdin.readline())
        pedidos = []
        for _ in range(n):
            q, d = map(int, sys.stdin.readline().split())
            pedidos.append((d, q))
        pedidos.sort()
        if caso > 0:
            print()                               # linea en blanco entre salidas
        print(solve(pedidos))


if __name__ == "__main__":
    main()
