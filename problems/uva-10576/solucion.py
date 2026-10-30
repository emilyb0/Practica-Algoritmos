import sys


def mejor_total(s, d):
    mejor = None
    meses = []

    def bt():
        nonlocal mejor
        if len(meses) == 12:
            total = sum(meses)
            if mejor is None or total > mejor:
                mejor = total
        else:
            for v in (s, -d):
                meses.append(v)
                # poda: toda ventana de 5 meses debe tener deficit (suma < 0)
                if len(meses) < 5 or sum(meses[-5:]) < 0:
                    bt()
                meses.pop()

    bt()
    return mejor


def main():
    data = sys.stdin.read().split()
    out = []
    for i in range(0, len(data) - 1, 2):
        m = mejor_total(int(data[i]), int(data[i + 1]))
        out.append("Deficit" if m is None or m < 0 else str(m))
    sys.stdout.write("".join(x + "\n" for x in out))


main()
