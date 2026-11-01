import sys


def solve(i, p, n, sale, objetivo):
    # p[0..i] ya fijados; al fijar p[i+1] se puede verificar la celda i
    if i == n - 1:
        # faltan las dos celdas que dan la vuelta al circulo
        ok_ultima = sale[p[n - 2] * 4 + p[n - 1] * 2 + p[0]] == objetivo[n - 1]
        ok_primera = sale[p[n - 1] * 4 + p[0] * 2 + p[1]] == objetivo[0]
        ans = ok_ultima and ok_primera
    else:
        ans = False
        b = 0
        while not ans and b <= 1:
            p[i + 1] = b
            if i < 1 or sale[p[i - 1] * 4 + p[i] * 2 + p[i + 1]] == objetivo[i]:
                ans = solve(i + 1, p, n, sale, objetivo)
            b += 1
    return ans


def alcanzable(regla, n, estado):
    # se busca un estado previo p (circular) tal que regla(p[i-1], p[i], p[i+1]) == estado[i]
    objetivo = [int(c) for c in estado]
    sale = [(regla >> v) & 1 for v in range(8)]
    p = [0] * n
    ans = False
    inicio = 0
    while not ans and inicio < 2:
        p[0] = inicio
        ans = solve(0, p, n, sale, objetivo)
        inicio += 1
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":
        r, n, s = linea.split()
        if alcanzable(int(r), int(n), s):
            print("REACHABLE")
        else:
            print("GARDEN OF EDEN")
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
