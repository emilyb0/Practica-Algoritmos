import sys


def fuerza_bruta(p):
    d = float("inf")
    for i in range(len(p)):
        for j in range(i + 1, len(p)):
            d = min(d, ((p[i][0] - p[j][0]) ** 2 + (p[i][1] - p[j][1]) ** 2) ** 0.5)
    return d


def cercanos(p):
    # p esta ordenado por x
    if len(p) <= 3:
        return fuerza_bruta(p)
    mid = len(p) // 2
    xm = p[mid][0]
    d = min(cercanos(p[:mid]), cercanos(p[mid:]))
    franja = sorted((q for q in p if abs(q[0] - xm) < d), key=lambda q: q[1])
    for i in range(len(franja)):
        j = i + 1
        while j < len(franja) and franja[j][1] - franja[i][1] < d:
            dx, dy = franja[i][0] - franja[j][0], franja[i][1] - franja[j][1]
            d = min(d, (dx * dx + dy * dy) ** 0.5)
            j += 1
    return d


def main():
    data = sys.stdin.read().split()
    i, out = 0, []
    n = int(data[i]) if data else 0
    while n != 0:
        i += 1
        pts = sorted((float(data[i + 2 * k]), float(data[i + 2 * k + 1])) for k in range(n))
        i += 2 * n
        d = cercanos(pts) if n > 1 else float("inf")
        out.append("INFINITY" if d >= 10000 else f"{d:.4f}")
        n = int(data[i]) if i < len(data) else 0
    sys.stdout.write("".join(x + "\n" for x in out))


main()
