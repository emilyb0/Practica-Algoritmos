import sys


def super_numero(n, m):
    digitos = []

    def bt(prefijo):
        # prefijo = valor numerico de los digitos ya puestos
        largo = len(digitos)
        if largo == m:
            return True
        ok = False
        d = 1 if largo == 0 else 0
        while not ok and d <= 9:
            nuevo = prefijo * 10 + d
            if largo + 1 < n or nuevo % (largo + 1) == 0:
                digitos.append(str(d))
                ok = bt(nuevo)
                if not ok:
                    digitos.pop()
            d += 1
        return ok

    return "".join(digitos) if bt(0) else "-1"


def main():
    data = sys.stdin.read().split()
    t = int(data[0]) if data else 0
    out = []
    for c in range(1, t + 1):
        n, m = int(data[2 * c - 1]), int(data[2 * c])
        out.append(f"Case {c}: {super_numero(n, m)}")
    sys.stdout.write("".join(x + "\n" for x in out))


main()
