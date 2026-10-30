import sys


def posible(nums):
    usados = [False] * 5

    def bt(cuantos, valor):
        # cuantos numeros ya se usaron, valor = resultado parcial (izquierda a derecha)
        if cuantos == 5:
            return valor == 23
        ok = False
        j = 0
        while not ok and j < 5:
            if not usados[j]:
                usados[j] = True
                x = nums[j]
                ok = (bt(cuantos + 1, valor + x) or bt(cuantos + 1, valor - x)
                      or bt(cuantos + 1, valor * x))
                usados[j] = False
            j += 1
        return ok

    encontrado = False
    j = 0
    while not encontrado and j < 5:
        usados[j] = True
        encontrado = bt(1, nums[j])
        usados[j] = False
        j += 1
    return encontrado


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i, out = 0, []
    while i + 4 < len(data) and any(data[i:i + 5]):
        out.append("Possible" if posible(data[i:i + 5]) else "Impossible")
        i += 5
    sys.stdout.write("".join(x + "\n" for x in out))


main()
