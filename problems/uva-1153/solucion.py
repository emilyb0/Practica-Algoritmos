import sys
import heapq


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for _ in range(t):
        n = int(data[i]); i += 1
        pedidos = sorted((int(data[i + 2 * j + 1]), int(data[i + 2 * j])) for j in range(n))
        i += 2 * n
        aceptados = []  # monticulo de maximos (con signo negativo)
        tiempo = 0
        for fecha, q in pedidos:
            heapq.heappush(aceptados, -q)
            tiempo += q
            if tiempo > fecha:
                tiempo += heapq.heappop(aceptados)  # quita el pedido mas largo
        out.append(str(len(aceptados)))
    sys.stdout.write("\n\n".join(out) + ("\n" if out else ""))


main()
