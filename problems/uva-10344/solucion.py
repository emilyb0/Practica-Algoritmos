import sys


def solve(nums, usados, cuantos, valor):
    # cuantos numeros ya se usaron; valor = resultado parcial de izquierda a derecha
    if cuantos == 5:
        ans = valor == 23
    else:
        ans = False
        j = 0
        while not ans and j < 5:    # se detiene apenas encuentra una forma
            if not usados[j]:
                usados[j] = True
                x = nums[j]
                if cuantos == 0:
                    ans = solve(nums, usados, 1, x)
                else:
                    ans = (solve(nums, usados, cuantos + 1, valor + x)
                           or solve(nums, usados, cuantos + 1, valor - x)
                           or solve(nums, usados, cuantos + 1, valor * x))
                usados[j] = False
            j += 1
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0 0 0 0 0":
        nums = list(map(int, linea.split()))
        if solve(nums, [False] * 5, 0, 0):
            print("Possible")
        else:
            print("Impossible")
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
