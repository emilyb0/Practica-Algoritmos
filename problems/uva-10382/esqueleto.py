import sys


def solve(intervalos, l):
    # cubrir [0, l] con la menor cantidad de intervalos (ordenados por inicio)
    cubierto, ans, j, atascado = 0.0, 0, 0, False
    while cubierto < l and not atascado:
        mejor = cubierto
        # TODO: de los intervalos que empiezan <= cubierto, guardar en mejor el fin mas lejano
        if mejor == cubierto:
            atascado = True
        else:
            ans += 1
            cubierto = mejor
    if atascado:
        ans = -1
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":
        n, l, w = map(int, linea.split())
        intervalos = []
        for _ in range(n):
            x, r = map(int, sys.stdin.readline().split())
            # TODO: si el circulo cubre todo el ancho, agregar el intervalo (x - dx, x + dx)
        intervalos.sort()
        print(solve(intervalos, l))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
