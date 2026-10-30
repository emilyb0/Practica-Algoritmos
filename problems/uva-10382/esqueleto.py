import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    while i < len(data):
        n, l, w = int(data[i]), int(data[i + 1]), int(data[i + 2]); i += 3
        intervalos = []
        for _ in range(n):
            x, r = int(data[i]), int(data[i + 1]); i += 2
            # TODO: si sirve, agregar (x - dx, x + dx)
        intervalos.sort()
        cubierto, usados, j, atascado = 0.0, 0, 0, False
        while cubierto < l and not atascado:
            # TODO: avanzar j entre los intervalos que empiezan <= cubierto, guardar el mayor fin
            atascado = True
        print(-1 if atascado else usados)


main()
