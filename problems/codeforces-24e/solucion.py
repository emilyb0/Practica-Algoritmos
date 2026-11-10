import sys


def choca(x, v, t):
    # antes del tiempo t, alguna particula que va a la derecha alcanza a una que va a la izquierda?
    ans = False
    mas_lejos = None    # posicion mas a la derecha (en el tiempo t) de las que van a la derecha
    i = 0
    while not ans and i < len(x):
        if v[i] > 0:
            p = x[i] + v[i] * t
            if mas_lejos is None or p > mas_lejos:
                mas_lejos = p
        elif mas_lejos is not None and x[i] + v[i] * t <= mas_lejos:
            ans = True
        i += 1
    return ans


def solve(x, v):
    # biseccion sobre el tiempo: "ya hubo choque en t" es monotono
    hay_derecha = False
    posible = False
    for i in range(len(x)):
        if v[i] > 0:
            hay_derecha = True
        elif hay_derecha:
            posible = True    # una que va a la izquierda tiene a su izquierda una que va a la derecha
    if not posible:
        ans = -1.0
    else:
        lo, hi = 0.0, 3e9
        for _ in range(100):
            mid = (lo + hi) / 2
            if choca(x, v, mid):
                hi = mid
            else:
                lo = mid
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
