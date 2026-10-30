import sys


def alcanzable(regla, n, estado):
    # se busca un estado previo p (circular) tal que regla(p[i-1], p[i], p[i+1]) == estado[i]
    objetivo = [int(c) for c in estado]
    sale = [(regla >> v) & 1 for v in range(8)]
    p = [0] * n

    def bt(i):
        # p[0..i] ya fijados; al fijar p[i+1] se puede verificar la celda i
        if i == n - 1:
            # faltan las dos celdas que dan la vuelta al circulo
            ok_ultima = sale[p[n - 2] * 4 + p[n - 1] * 2 + p[0]] == objetivo[n - 1]
            ok_primera = sale[p[n - 1] * 4 + p[0] * 2 + p[1]] == objetivo[0]
            return ok_ultima and ok_primera
        ok = False
        b = 0
        while not ok and b <= 1:
            p[i + 1] = b
            if i < 1 or sale[p[i - 1] * 4 + p[i] * 2 + p[i + 1]] == objetivo[i]:
                ok = bt(i + 1)
            b += 1
        return ok

    encontrado = False
    inicio = 0
    while not encontrado and inicio < 2:
        p[0] = inicio
        encontrado = bt(0)
        inicio += 1
    return encontrado


def main():
    data = sys.stdin.read().split()
    out = []
    for i in range(0, len(data) - 2, 3):
        r, n, s = int(data[i]), int(data[i + 1]), data[i + 2]
        out.append("REACHABLE" if alcanzable(r, n, s) else "GARDEN OF EDEN")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
