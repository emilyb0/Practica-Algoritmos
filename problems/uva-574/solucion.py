import sys


def solve(nums, desde, resto, actual, sumas):
    # nums en orden no creciente; agrega a sumas cada forma de completar 'resto'
    if resto == 0:
        sumas.append("+".join(map(str, actual)))
    else:
        for j in range(desde, len(nums)):
            # no repetir el mismo numero en el mismo nivel (evita sumas duplicadas)
            if (j == desde or nums[j] != nums[j - 1]) and nums[j] <= resto:
                actual.append(nums[j])
                solve(nums, j + 1, resto - nums[j], actual, sumas)
                actual.pop()


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
