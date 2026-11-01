import sys


def phi(mask, j, d, todos, mem):
    # menor distancia para visitar los beepers que faltan (fuera de mask) desde el punto j y volver al inicio
    # punto 0 = inicio, punto k+1 = beeper k
    if (mask, j) in mem:
        ans = mem[(mask, j)]
    else:
        if mask == todos:
            ans = d[j][0]
        else:
            ans = float("inf")
            for k in range(len(d) - 1):
                if not mask & (1 << k):
                    ans = min(ans, d[j][k + 1] + phi(mask | (1 << k), k + 1, d, todos, mem))
        mem[(mask, j)] = ans
    return ans


def main():
    casos = int(sys.stdin.readline())
    for _ in range(casos):
        sys.stdin.readline()                       # tamano del mundo (no se necesita)
        sx, sy = map(int, sys.stdin.readline().split())
        b = int(sys.stdin.readline())
        pts = [(sx, sy)]
        for _ in range(b):
            x, y = map(int, sys.stdin.readline().split())
            pts.append((x, y))
        d = [[abs(p[0] - q[0]) + abs(p[1] - q[1]) for q in pts] for p in pts]
        ans = phi(0, 0, d, (1 << b) - 1, dict())
        print(f"The shortest path has length {ans}")


if __name__ == "__main__":
    main()
