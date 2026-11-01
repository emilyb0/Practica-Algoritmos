import sys


def solve(p, x):
    # p en centesimas de porcentaje (enteros); x = indice del dueno (desde 0)
    mio = p[x]
    if mio > 5000:
        ans = "100.00"
    else:
        # posibles[s] = alguna coalicion de los otros suma s (mochila 0/1)
        posibles = [False] * 10001
        posibles[0] = True
        for j in range(len(p)):
            if j != x:
                for s in range(10000, p[j] - 1, -1):
                    if posibles[s - p[j]]:
                        posibles[s] = True
        # menor suma de los otros que, junto con la mia, supere el 50%
        otros = 5001 - mio
        while not posibles[otros]:
            otros += 1
        total = otros + mio
        # mio / total * 100 redondeado a 2 decimales (mitad hacia arriba)
        r = (2 * mio * 10000 + total) // (2 * total)
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
