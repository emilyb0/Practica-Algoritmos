import sys


def posible(nums):
    usados = [False] * 5

    def bt(cuantos, valor):
        if cuantos == 5:
            return valor == 23
        ok, j = False, 0
        while not ok and j < 5:
            # TODO: si nums[j] no esta usado, probar +, - y *
            j += 1
        return ok

    # TODO: probar cada numero como primero
    return False


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    while i + 4 < len(data) and any(data[i:i + 5]):
        print("Possible" if posible(data[i:i + 5]) else "Impossible")
        i += 5


main()
