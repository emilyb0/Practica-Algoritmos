import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for _ in range(t):
        n = int(data[i]); i += 1
        seq = [int(v) for v in data[i:i + n]]; i += n
        actual, largo, bajar = seq[0], 1, True
        for v in seq[1:]:
            # TODO: si v avanza en la direccion buscada, largo += 1 y cambias direccion
            actual = v
        print(largo)


main()
