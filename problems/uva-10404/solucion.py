import sys


def main():
    lineas = [l.split() for l in sys.stdin.read().split("\n") if l.strip()]
    juegos = []
    for l in lineas:
        n, m = int(l[0]), int(l[1])
        juegos.append((n, tuple(sorted(int(x) for x in l[2:2 + m]))))
    # una tabla por conjunto de jugadas, hasta el mayor n pedido
    tablas = {}
    for n, jugadas in juegos:
        tablas[jugadas] = max(tablas.get(jugadas, 0), n)
    for jugadas, tope in tablas.items():
        gana = bytearray(tope + 1)  # gana[s] = 1 si quien mueve con s piedras gana
        for s in range(1, tope + 1):
            g = 0
            j = 0
            while g == 0 and j < len(jugadas) and jugadas[j] <= s:
                if not gana[s - jugadas[j]]:
                    g = 1
                j += 1
            gana[s] = g
        tablas[jugadas] = gana
    out = ["Stan wins" if tablas[j][n] else "Ollie wins" for n, j in juegos]
    sys.stdout.write("".join(x + "\n" for x in out))


main()
