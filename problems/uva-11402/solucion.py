import sys

# Arbol de segmentos con propagacion perezosa.
# lazy: 0 = nada, 1 = poner unos, 2 = poner ceros, 3 = invertir
INVERTIR = {0: 3, 1: 2, 2: 1, 3: 0}


def main():
    data = sys.stdin.read().split()
    i = 0
    casos = int(data[i]); i += 1
    out = []
    for caso in range(1, casos + 1):
        m = int(data[i]); i += 1
        partes = []
        for _ in range(m):
            partes.append(data[i + 1] * int(data[i])); i += 2
        s = "".join(partes)
        n = len(s)
        tam = 1
        while tam < n:
            tam *= 2
        suma = [0] * (2 * tam)
        largo = [0] * (2 * tam)
        lazy = [0] * (2 * tam)
        for k in range(n):
            suma[tam + k] = 1 if s[k] == "1" else 0
            largo[tam + k] = 1
        for v in range(tam - 1, 0, -1):
            suma[v] = suma[2 * v] + suma[2 * v + 1]
            largo[v] = largo[2 * v] + largo[2 * v + 1]

        def aplicar(v, op):
            if op == 1:
                suma[v] = largo[v]
            elif op == 2:
                suma[v] = 0
            else:
                suma[v] = largo[v] - suma[v]
            if v < tam:
                lazy[v] = op if op != 3 else INVERTIR[lazy[v]]

        def bajar(v):
            if lazy[v]:
                aplicar(2 * v, lazy[v])
                aplicar(2 * v + 1, lazy[v])
                lazy[v] = 0

        def actualizar(v, l, r, a, b, op):
            if a <= l and r <= b:
                aplicar(v, op)
            elif not (b < l or r < a):
                bajar(v)
                m2 = (l + r) // 2
                actualizar(2 * v, l, m2, a, b, op)
                actualizar(2 * v + 1, m2 + 1, r, a, b, op)
                suma[v] = suma[2 * v] + suma[2 * v + 1]

        def consultar(v, l, r, a, b):
            if b < l or r < a:
                return 0
            if a <= l and r <= b:
                return suma[v]
            bajar(v)
            m2 = (l + r) // 2
            return consultar(2 * v, l, m2, a, b) + consultar(2 * v + 1, m2 + 1, r, a, b)

        q = int(data[i]); i += 1
        out.append(f"Case {caso}:")
        nq = 0
        for _ in range(q):
            op, a, b = data[i], int(data[i + 1]), int(data[i + 2]); i += 3
            if op == "S":
                nq += 1
                out.append(f"Q{nq}: {consultar(1, 0, tam - 1, a, b)}")
            else:
                actualizar(1, 0, tam - 1, a, b, {"F": 1, "E": 2, "I": 3}[op])
    sys.stdout.write("".join(x + "\n" for x in out))


main()
