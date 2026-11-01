import sys
import math


def porciones(areas, tam):
    # cuantas porciones de tamano tam salen de todas las tortas
    ans = 0
    for a in areas:
        ans += int(a // tam)
    return ans


def solve(areas, personas):
    # biseccion sobre el tamano de la porcion: si alcanza para todos, se puede intentar mas grande
    lo, hi = 0.0, max(areas)
    for _ in range(100):
        mid = (lo + hi) / 2
        if porciones(areas, mid) >= personas:
            lo = mid
        else:
            hi = mid
    return lo


def main():
    casos = int(sys.stdin.readline())
    for _ in range(casos):
        n, f = map(int, sys.stdin.readline().split())
        radios = list(map(int, sys.stdin.readline().split()))
        areas = [math.pi * r * r for r in radios]
        ans = solve(areas, f + 1)    # f amigos + yo
        print(f"{ans:.4f}")


if __name__ == "__main__":
    main()
