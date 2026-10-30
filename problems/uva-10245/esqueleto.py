import sys


def cercanos(p):
    # p ordenado por x
    if len(p) <= 3:
        # TODO: fuerza bruta
        return float("inf")
    mid = len(p) // 2
    d = min(cercanos(p[:mid]), cercanos(p[mid:]))
    # TODO: franja central ordenada por y; usar while (dy < d) para recorrerla
    return d


def main():
    data = sys.stdin.read().split()
    i = 0
    n = int(data[i]) if data else 0
    while n != 0:
        i += 1
        pts = sorted((float(data[i + 2 * k]), float(data[i + 2 * k + 1])) for k in range(n))
        i += 2 * n
        d = cercanos(pts)
        print("INFINITY" if d >= 10000 else f"{d:.4f}")
        n = int(data[i]) if i < len(data) else 0


main()
