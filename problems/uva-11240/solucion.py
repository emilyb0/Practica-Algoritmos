import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for _ in range(t):
        n = int(data[i]); i += 1
        seq = data[i:i + n]; i += n
        actual = int(seq[0])
        largo, bajar = 1, True  # el primer paso debe ser hacia abajo
        for v in seq[1:]:
            v = int(v)
            if bajar and v < actual or not bajar and v > actual:
                largo += 1
                bajar = not bajar
            # voraz: si no avanzo, me quedo con el mejor extremo para el siguiente paso
            actual = v
        out.append(str(largo))
    sys.stdout.write("".join(v + "\n" for v in out))


main()
