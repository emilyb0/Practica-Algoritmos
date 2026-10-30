import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    n, x = int(data[0]), int(data[1])
    while n != 0:
        i += 2
        p = [int(round(float(v) * 100)) for v in data[i:i + n]]
        i += n
        # TODO: mochila de sumas alcanzables sin el accionista x
        print("0.00")
        n, x = (int(data[i]), int(data[i + 1])) if i + 1 < len(data) else (0, 0)


main()
