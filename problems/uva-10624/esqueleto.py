import sys


def super_numero(n, m):
    digitos = []

    def bt(prefijo):
        largo = len(digitos)
        if largo == m:
            return True
        ok = False
        d = 1 if largo == 0 else 0
        while not ok and d <= 9:
            # TODO: si el nuevo prefijo cumple, agregar d, recursion y quitar si fallo
            d += 1
        return ok

    return "".join(digitos) if bt(0) else "-1"


def main():
    data = sys.stdin.read().split()
    t = int(data[0]) if data else 0
    for c in range(1, t + 1):
        print(f"Case {c}: {super_numero(int(data[2 * c - 1]), int(data[2 * c]))}")


main()
