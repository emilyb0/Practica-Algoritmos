import sys
import math


def porciones(areas, tam):
    # cuantas porciones de tamano tam salen de todas las tortas
    ans = 0
    # TODO
    return ans


def solve(areas, personas):
    lo, hi = 0.0, max(areas)
    for _ in range(100):
        mid = (lo + hi) / 2
        # TODO: si porciones(areas, mid) alcanza para todos, mover lo; si no, mover hi
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
