import sys

TODOS = (1 << 10) - 2    # bits 1..9 encendidos


def caja(r, c):
    return 3 * (r // 3) + c // 3


def legal(T):
    # ningun digito se repite en una fila, columna o caja
    fila, col, cj = [0] * 9, [0] * 9, [0] * 9
    ans = True
    for r in range(9):
        for c in range(9):
            k = T[r][c]
            if k != 0:
                b = 1 << k
                if fila[r] & b or col[c] & b or cj[caja(r, c)] & b:
                    ans = False
                fila[r] |= b
                col[c] |= b
                cj[caja(r, c)] |= b
    return ans, fila, col, cj


def solve(vacias, fila, col, cj):
    # cuenta soluciones, pero se detiene al llegar a 2 (con eso ya es ambiguo)
    if len(vacias) == 0:
        ans = 1
    else:
        # se llena primero la casilla con menos opciones (poda fuerte)
        mejor, opciones_mejor = 0, None
        for idx in range(len(vacias)):
            r, c = vacias[idx]
            ops = TODOS & ~(fila[r] | col[c] | cj[caja(r, c)])
            if opciones_mejor is None or bin(ops).count("1") < bin(opciones_mejor).count("1"):
                mejor, opciones_mejor = idx, ops
        r, c = vacias[mejor]
        resto = vacias[:mejor] + vacias[mejor + 1:]
        ans = 0
        k = 1
        while ans < 2 and k <= 9:
            b = 1 << k
            if opciones_mejor & b:
                fila[r] |= b
                col[c] |= b
                cj[caja(r, c)] |= b
                ans += solve(resto, fila, col, cj)
                fila[r] &= ~b
                col[c] &= ~b
                cj[caja(r, c)] &= ~b
            k += 1
    return ans


def clasificar(T):
    ok, fila, col, cj = legal(T)
    if not ok:
        ans = "Illegal"
    else:
        vacias = [(r, c) for r in range(9) for c in range(9) if T[r][c] == 0]
        n = solve(vacias, fila, col, cj)
        if n == 0:
            ans = "Impossible"
        elif n == 1:
            ans = "Unique"
        else:
            ans = "Ambiguous"
    return ans


def main():
    caso = 1
    linea = sys.stdin.readline()
    while linea != "":
        if linea.strip() != "":          # las lineas en blanco separan los tableros
            T = [list(map(int, linea.split()))]
            for _ in range(8):
                T.append(list(map(int, sys.stdin.readline().split())))
            print(f"Case {caso}: {clasificar(T)}.")
            caso += 1
        linea = sys.stdin.readline()


if __name__ == "__main__":
    main()
