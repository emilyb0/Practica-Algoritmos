import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    while i + 1 < len(data) and data[i + 1] != 0:
        t, n = data[i], data[i + 1]
        nums = data[i + 2:i + 2 + n]
        i += 2 + n
        print(f"Sums of {t}:")
        sumas, actual = [], []

        def bt(desde, resto):
            # TODO: si resto == 0 guardar "+".join; si no, probar nums[j] sin repetir en el nivel
            pass

        bt(0, t)
        print("\n".join(sumas) if sumas else "NONE")


main()
