import sys


def solve(intervalos, l):
    # cubrir [0, l] con la menor cantidad de intervalos (ordenados por inicio)
    cubierto, ans, j, atascado = 0.0, 0, 0, False
    while cubierto < l and not atascado:
        # voraz: de los que empiezan antes de lo cubierto, el que llega mas lejos
        mejor = cubierto
        while j < len(intervalos) and intervalos[j][0] <= cubierto:
            mejor = max(mejor, intervalos[j][1])
            j += 1
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
            if 2 * r > w:    # si no cubre el ancho no sirve
                dx = (r * r - w * w / 4) ** 0.5
                intervalos.append((x - dx, x + dx))
        intervalos.sort()
        print(solve(intervalos, l))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
