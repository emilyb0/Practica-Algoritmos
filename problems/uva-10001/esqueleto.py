import sys


def solve(i, p, n, sale, objetivo):
    # p[0..i] ya fijados; al fijar p[i+1] se puede verificar la celda i
    if i == n - 1:
        ans = False  # TODO: verificar las celdas n-1 y 0 (dan la vuelta al circulo)
    else:
        ans = False
        b = 0
        while not ans and b <= 1:
            p[i + 1] = b
            # TODO: si i < 1 o la celda i ya da objetivo[i], seguir con solve(i + 1, ...)
            b += 1
    return ans


def alcanzable(regla, n, estado):
    objetivo = [int(c) for c in estado]
    sale = [(regla >> v) & 1 for v in range(8)]    # sale[4*izq + 2*centro + der]
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
