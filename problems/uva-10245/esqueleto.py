import sys


def fuerza_bruta(p):
    ans = float("inf")
    for i in range(len(p)):
        for j in range(i + 1, len(p)):
            ans = min(ans, ((p[i][0] - p[j][0]) ** 2 + (p[i][1] - p[j][1]) ** 2) ** 0.5)
    return ans


def phi(p):
    # p ordenado por x: distancia minima entre dos puntos de p
    if len(p) <= 3:
        ans = fuerza_bruta(p)
    else:
        mid = len(p) // 2
        xm = p[mid][0]
        ans = min(phi(p[:mid]), phi(p[mid:]))
        # TODO: franja = puntos con |x - xm| < ans, ordenados por y
        # TODO: comparar cada punto de la franja con los siguientes mientras la diferencia en y sea < ans
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0":
        n = int(linea)
        pts = []
        for _ in range(n):
            x, y = map(float, sys.stdin.readline().split())
            pts.append((x, y))
        pts.sort()
        if n > 1:
            ans = phi(pts)
        else:
            ans = float("inf")
        if ans >= 10000:
            print("INFINITY")
        else:
            print(f"{ans:.4f}")
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
