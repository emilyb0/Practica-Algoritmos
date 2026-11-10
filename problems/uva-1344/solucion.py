import sys


def solve(tian, rey):
    # ambos ordenados de menor a mayor; se comparan los extremos
    lt, ht = 0, len(tian) - 1    # caballo mas lento y mas rapido de Tian que quedan
    lr, hr = 0, len(rey) - 1     # caballo mas lento y mas rapido del rey que quedan
    ans = 0
    while lt <= ht:
        if tian[ht] > rey[hr]:
            # mi mas rapido le gana a su mas rapido: gano esa carrera
            ans += 200
            ht -= 1
            hr -= 1
        elif tian[lt] > rey[lr]:
            # mi mas lento le gana a su mas lento: gano esa carrera
            ans += 200
            lt += 1
            lr += 1
        else:
            # voraz: sacrifico mi mas lento contra su mas rapido
            if tian[lt] < rey[hr]:
                ans -= 200
            lt += 1
            hr -= 1
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0":
        n = int(linea)
        tian = sorted(map(int, sys.stdin.readline().split()))
        rey = sorted(map(int, sys.stdin.readline().split()))
        print(solve(tian, rey))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
