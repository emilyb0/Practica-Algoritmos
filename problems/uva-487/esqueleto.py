import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    bloques = []
    for _ in range(t):
        n = int(data[i]); i += 1
        g = data[i:i + n]; i += n
        palabras, actual = set(), []
        # TODO: bt(r, c) a las 8 vecinas con letra mayor
        bloques.append("".join(p + "\n" for p in sorted(palabras, key=lambda p: (len(p), p))))
    sys.stdout.write("\n".join(bloques))


main()
