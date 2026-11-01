import sys


def solve(nums, desde, resto, actual, sumas):
    # nums en orden no creciente; agrega a sumas cada forma de completar 'resto'
    if resto == 0:
        sumas.append("+".join(map(str, actual)))
    else:
        for j in range(desde, len(nums)):
            pass  # TODO: si nums[j] no se repite en este nivel y cabe en resto: agregar, llamar con j + 1, quitar


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0 0":
        datos = list(map(int, linea.split()))
        t, n = datos[0], datos[1]
        nums = datos[2:2 + n]
        sumas = []
        solve(nums, 0, t, [], sumas)
        print(f"Sums of {t}:")
        if len(sumas) == 0:
            print("NONE")
        else:
            for s in sumas:
                print(s)
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
