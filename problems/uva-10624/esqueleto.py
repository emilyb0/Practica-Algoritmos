import sys


def solve(digitos, prefijo, n, m):
    # prefijo = valor de los digitos ya puestos; True si se pudo completar hasta m digitos
    largo = len(digitos)
    if largo == m:
        ans = True
    else:
        ans = False
        if largo == 0:
            d = 1    # el primer digito no puede ser 0
        else:
            d = 0
        while not ans and d <= 9:
            nuevo = prefijo * 10 + d
            # TODO: si largo + 1 < n o nuevo es divisible por largo + 1:
            #       agregar d, llamar solve y quitar d si no funciono
            d += 1
    return ans


def main():
    casos = int(sys.stdin.readline())
    for c in range(1, casos + 1):
        n, m = map(int, sys.stdin.readline().split())
        digitos = []
        if solve(digitos, 0, n, m):
            print(f"Case {c}: {''.join(digitos)}")
        else:
            print(f"Case {c}: -1")


if __name__ == "__main__":
    main()
