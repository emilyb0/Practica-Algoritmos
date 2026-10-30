import sys


def main():
    data = sys.stdin.read().split()
    i, out = 0, []
    n, x = (int(data[0]), int(data[1])) if len(data) >= 2 else (0, 0)
    while n != 0:
        i += 2
        # porcentajes a enteros (centesimas) para evitar errores de punto flotante
        p = [int(round(float(v) * 100)) for v in data[i:i + n]]
        i += n
        mio = p[x - 1]
        if mio > 5000:
            out.append("100.00")
        else:
            # posibles[s] = alguna coalicion de los otros suma s (mochila 0/1)
            posibles = [False] * 10001
            posibles[0] = True
            for j in range(n):
                if j != x - 1:
                    for s in range(10000, p[j] - 1, -1):
                        if posibles[s - p[j]]:
                            posibles[s] = True
            # menor suma de los otros que, junto con la mia, supere 50%
            otros = 5001 - mio
            while not posibles[otros]:
                otros += 1
            total = otros + mio
            # mio / total * 100, redondeado a 2 decimales (mitad hacia arriba)
            r = (2 * mio * 10000 + total) // (2 * total)
            out.append(f"{r // 100}.{r % 100:02d}")
        n, x = (int(data[i]), int(data[i + 1])) if i + 1 < len(data) else (0, 0)
    sys.stdout.write("".join(v + "\n" for v in out))


main()
