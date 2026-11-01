import sys

# Arbol de segmentos con propagacion perezosa.
# lazy: 0 = nada, 1 = poner unos, 2 = poner ceros, 3 = invertir
INVERTIR = {0: 3, 1: 2, 2: 1, 3: 0}


def aplicar(v, op):
    # TODO: actualizar suma[v] segun op (1: todo unos, 2: todo ceros, 3: invertir)
    # TODO: si v no es hoja, guardar op en lazy[v] (si op es invertir, combinar con INVERTIR)
    pass


def bajar(v):
    # pasa la operacion pendiente a los dos hijos
    if lazy[v] != 0:
        aplicar(2 * v, lazy[v])
        aplicar(2 * v + 1, lazy[v])
        lazy[v] = 0


def actualizar(v, l, r, a, b, op):
    if a <= l and r <= b:
        aplicar(v, op)
    elif not (b < l or r < a):
        pass  # TODO: bajar, actualizar los dos hijos y recalcular suma[v]


def consultar(v, l, r, a, b):
    # cuantos 1 hay en [a, b] dentro del nodo v que cubre [l, r]
    if b < l or r < a:
        ans = 0
    elif a <= l and r <= b:
        ans = suma[v]
    else:
        ans = 0  # TODO: bajar y sumar la consulta de los dos hijos
    return ans


def construir(s):
    global suma, largo, lazy, tam
    n = len(s)
    tam = 1
    while tam < n:
        tam *= 2
    suma = [0] * (2 * tam)
    largo = [0] * (2 * tam)
    lazy = [0] * (2 * tam)
    for k in range(n):
        suma[tam + k] = int(s[k])
        largo[tam + k] = 1
    for v in range(tam - 1, 0, -1):
        suma[v] = suma[2 * v] + suma[2 * v + 1]
        largo[v] = largo[2 * v] + largo[2 * v + 1]


def main():
    casos = int(sys.stdin.readline())
    for c in range(1, casos + 1):
        m = int(sys.stdin.readline())
        partes = []
        for _ in range(m):
            veces = int(sys.stdin.readline())
            patron = sys.stdin.readline().strip()
            partes.append(patron * veces)
        construir("".join(partes))
        q = int(sys.stdin.readline())
        print(f"Case {c}:")
        nq = 0
        for _ in range(q):
            op, a, b = sys.stdin.readline().split()
            a, b = int(a), int(b)
            if op == "S":
                nq += 1
                print(f"Q{nq}: {consultar(1, 0, tam - 1, a, b)}")
            else:
                actualizar(1, 0, tam - 1, a, b, {"F": 1, "E": 2, "I": 3}[op])


if __name__ == "__main__":
    main()
