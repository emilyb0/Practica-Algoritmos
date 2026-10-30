import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    t = data[i]; i += 1
    for _ in range(t):
        i += 2
        sx, sy = data[i], data[i + 1]; i += 2
        b = data[i]; i += 1
        pts = [(sx, sy)] + [(data[i + 2 * k], data[i + 2 * k + 1]) for k in range(b)]
        i += 2 * b
        INF = float("inf")
        dp = [[INF] * b for _ in range(1 << b)]
        # TODO: casos base, transiciones y respuesta
        print(f"The shortest path has length {0}")


main()
