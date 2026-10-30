import sys


def main():
    data = sys.stdin.read().split()
    i, out = 0, []
    while i < len(data):
        n, l, w = int(data[i]), int(data[i + 1]), int(data[i + 2]); i += 3
        intervalos = []
        for _ in range(n):
            x, r = int(data[i]), int(data[i + 1]); i += 2
            if 2 * r > w:
                dx = (r * r - w * w / 4) ** 0.5
                intervalos.append((x - dx, x + dx))
        intervalos.sort()
        cubierto, usados, j, atascado = 0.0, 0, 0, False
        while cubierto < l and not atascado:
            mejor = cubierto
            while j < len(intervalos) and intervalos[j][0] <= cubierto:
                mejor = max(mejor, intervalos[j][1])
                j += 1
            if mejor == cubierto:
                atascado = True
            else:
                usados += 1
                cubierto = mejor
        out.append("-1" if atascado else str(usados))
    sys.stdout.write("".join(v + "\n" for v in out))


main()
