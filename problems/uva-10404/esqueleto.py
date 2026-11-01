import sys


def phi(n, jugadas):
    # gana[s] = 1 si quien mueve con s piedras gana
    gana = bytearray(n + 1)
    for s in range(1, n + 1):
        g = 0
        # TODO: g = 1 si alguna jugada deja al rival en una posicion perdedora (usar while con bandera)
        gana[s] = g
    return gana


def main():
    tablas = dict()    # se reutiliza la tabla si el mismo juego aparece otra vez
    linea = sys.stdin.readline().strip()
    while linea != "":
        datos = list(map(int, linea.split()))
        n, m = datos[0], datos[1]
        jugadas = tuple(sorted(datos[2:2 + m]))
        if jugadas not in tablas or len(tablas[jugadas]) <= n:
            tablas[jugadas] = phi(n, jugadas)
        if tablas[jugadas][n]:
            print("Stan wins")
        else:
            print("Ollie wins")
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
