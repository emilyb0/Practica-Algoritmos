import sys


def solve(x, y, k):
    ganancias = sorted(y[i] - x[i] for i in range(len(x)))
    # voraz: descartar (a lo sumo k) los negocios con perdida, empezando por el peor
    j = 0
    while j < k and j < len(ganancias) and ganancias[j] < 0:
        j += 1
    return sum(ganancias[j:])


def main():
    casos = int(sys.stdin.readline())
    for caso in range(1, casos + 1):
        n, k = map(int, sys.stdin.readline().split())
        x = list(map(int, sys.stdin.readline().split()))
        y = list(map(int, sys.stdin.readline().split()))
        ans = solve(x, y, k)
        if ans > 0:
            print(f"Case {caso}: {ans}")
        else:
            print(f"Case {caso}: No Profit")


if __name__ == "__main__":
    main()
