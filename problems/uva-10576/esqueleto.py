import sys


def mejor_total(s, d):
    mejor = None
    meses = []

    def bt():
        nonlocal mejor
        if len(meses) == 12:
            # TODO: actualizar mejor
            pass
        else:
            for v in (s, -d):
                meses.append(v)
                # TODO: seguir solo si la ventana de 5 meses es negativa
                meses.pop()

    bt()
    return mejor


def main():
    data = sys.stdin.read().split()
    for i in range(0, len(data) - 1, 2):
        m = mejor_total(int(data[i]), int(data[i + 1]))
        print("Deficit" if m is None or m < 0 else m)


main()
