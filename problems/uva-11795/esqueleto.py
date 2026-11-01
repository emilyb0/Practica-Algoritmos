import sys


def phi(X, armas_de, n, mem):
    # formas de destruir exactamente los robots de X (mascara de bits) en un orden valido
    if X in mem:
        ans = mem[X]
    else:
        if X == 0:
            ans = 1    # no destruir nada se hace de una sola forma
        else:
            ans = 0
            for r in range(n):                   # pruebo cada robot r de X como el ultimo
                if X & (1 << r):
                    Y = X ^ (1 << r)             # X sin r: los robots destruidos antes de r
                    # TODO: si con armas_de[Y] se puede matar a r, sumar phi(Y, ...)
        mem[X] = ans
    return ans


def main():
    casos = int(sys.stdin.readline())
    for c in range(1, casos + 1):
        n = int(sys.stdin.readline())
        filas = []
        for _ in range(n + 1):
            fila = sys.stdin.readline().strip()
            filas.append(int(fila[::-1], 2))     # el caracter r pasa a ser el bit r
        mega, armas = filas[0], filas[1:]
        # armas_de[Y] = robots que se pueden matar despues de destruir los de Y
        armas_de = [mega] * (1 << n)
        for Y in range(1, 1 << n):
            bajo = Y & -Y
            armas_de[Y] = armas_de[Y ^ bajo] | armas[bajo.bit_length() - 1]
        X = (1 << n) - 1
        print(f"Case {c}: {phi(X, armas_de, n, dict())}")


if __name__ == "__main__":
    main()
