import sys


def solve(p, x):
    # p en centesimas de porcentaje (enteros); x = indice del dueno (desde 0)
    mio = p[x]
    if mio > 5000:
        ans = "100.00"
    else:
        posibles = [False] * 10001
        posibles[0] = True
        # TODO: mochila 0/1 con los otros accionistas: posibles[s] = alguna coalicion suma s
        otros = 5001 - mio
        # TODO: subir otros hasta encontrar una suma posible
        total = otros + mio
        r = (2 * mio * 10000 + total) // (2 * total)    # redondeo a 2 decimales
        ans = f"{r // 100}.{r % 100:02d}"
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0 0":
        n, x = map(int, linea.split())
        p = []
        for _ in range(n):
            # porcentajes a enteros para evitar errores de punto flotante
            p.append(int(round(float(sys.stdin.readline()) * 100)))
        print(solve(p, x - 1))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
