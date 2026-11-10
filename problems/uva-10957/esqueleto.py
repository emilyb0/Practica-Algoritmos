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
                # TODO: si b ya esta en fila[r], col[c] o cj[caja(r, c)], no es legal
                fila[r] |= b
                col[c] |= b
                cj[caja(r, c)] |= b
    return ans, fila, col, cj


def solve(vacias, fila, col, cj):
    # cuenta soluciones, pero se detiene al llegar a 2
    if len(vacias) == 0:
        ans = 1
    else:
        # TODO: escoger la casilla vacia con menos opciones (opciones = TODOS & ~(fila | col | caja))
        r, c = vacias[0]
        opciones = TODOS & ~(fila[r] | col[c] | cj[caja(r, c)])
        resto = vacias[1:]
        ans = 0
        k = 1
        while ans < 2 and k <= 9:
            # TODO: si k es opcion: marcarlo en fila, col y caja, sumar solve(resto, ...) y desmarcarlo
            k += 1
    return ans


def clasificar(T):
    ok, fila, col, cj = legal(T)
    if not ok:
        ans = "Illegal"
    else:
        vacias = [(r, c) for r in range(9) for c in range(9) if T[r][c] == 0]
        n = solve(vacias, fila, col, cj)
        ans = "Impossible"  # TODO: 0 -> Impossible, 1 -> Unique, 2 -> Ambiguous
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
