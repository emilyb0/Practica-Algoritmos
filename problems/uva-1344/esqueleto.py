import sys


def solve(tian, rey):
    # ambos ordenados de menor a mayor; se comparan los extremos
    lt, ht = 0, len(tian) - 1    # caballo mas lento y mas rapido de Tian que quedan
    lr, hr = 0, len(rey) - 1     # caballo mas lento y mas rapido del rey que quedan
    ans = 0
    while lt <= ht:
        # TODO: 1) si mi mas rapido gana al mas rapido del rey: +200
        #       2) si no, si mi mas lento gana al mas lento del rey: +200
        #       3) si no, sacrifico mi mas lento contra su mas rapido (-200 si pierdo, 0 si empato)
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
