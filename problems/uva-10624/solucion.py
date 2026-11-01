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
            # desde el digito n, los primeros (largo + 1) digitos deben ser divisibles por (largo + 1)
            if largo + 1 < n or nuevo % (largo + 1) == 0:
                digitos.append(str(d))
                ans = solve(digitos, nuevo, n, m)
                if not ans:
                    digitos.pop()
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
