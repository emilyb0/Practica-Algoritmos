import sys


def tiempo(d, s, c):
    # tiempo total si la constante es c
    ans = 0
    for i in range(len(d)):
        ans += d[i] / (s[i] + c)
    return ans


def solve(d, s, t):
    # el tiempo total decrece cuando c crece: biseccion sobre c
    lo, hi = -min(s), 1e7
    for _ in range(200):
        c = (lo + hi) / 2
        if tiempo(d, s, c) > t:
            lo = c
        else:
            hi = c
    return hi


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":
        n, t = map(int, linea.split())
        d, s = [], []
        for _ in range(n):
            di, si = map(int, sys.stdin.readline().split())
            d.append(di)
            s.append(si)
        print(f"{solve(d, s, t):.4f}")
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
