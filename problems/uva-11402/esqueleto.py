import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    casos = int(data[i]); i += 1
    for caso in range(1, casos + 1):
        m = int(data[i]); i += 1
        partes = []
        for _ in range(m):
            partes.append(data[i + 1] * int(data[i])); i += 2
        s = "".join(partes)
        # TODO: construir arboles suma[], largo[], lazy[] de tamano 2*tam
        q = int(data[i]); i += 1
        print(f"Case {caso}:")
        nq = 0
        for _ in range(q):
            op, a, b = data[i], int(data[i + 1]), int(data[i + 2]); i += 3
            if op == "S":
                nq += 1
                # TODO: consultar(a, b)
                print(f"Q{nq}: {0}")
            else:
                # TODO: actualizar(a, b, op) bajando lazy antes de recorrer hijos
                pass


main()
