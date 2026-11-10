import sys


def choca(x, v, t):
    # antes del tiempo t, alguna particula que va a la derecha alcanza a una que va a la izquierda?
    ans = False
    mas_lejos = None    # posicion mas a la derecha (en el tiempo t) de las que van a la derecha
    i = 0
    while not ans and i < len(x):
        # TODO: si v[i] > 0, actualizar mas_lejos con x[i] + v[i] * t
        # TODO: si v[i] < 0 y x[i] + v[i] * t <= mas_lejos, ya hubo choque
        i += 1
    return ans


def solve(x, v):
    posible = False
    # TODO: posible = existe una particula hacia la izquierda con otra hacia la derecha antes que ella
    if not posible:
        ans = -1.0
    else:
        lo, hi = 0.0, 3e9
        for _ in range(100):
            mid = (lo + hi) / 2
            # TODO: si choca(x, v, mid), el choque es antes: hi = mid; si no, lo = mid
        ans = hi
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":
        n = int(linea)
        x, v = [], []
        for _ in range(n):
            xi, vi = map(int, sys.stdin.readline().split())
            x.append(xi)
            v.append(vi)
        ans = solve(x, v)
        if ans < 0:
            print(-1)
        else:
            print(f"{ans:.20f}")
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
