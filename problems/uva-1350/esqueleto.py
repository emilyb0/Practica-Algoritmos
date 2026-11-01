import sys


def pesos_fib():
    # pesos[L] = cuantos pinarios (contando el 0) tienen a lo sumo L+1 digitos
    pesos = [1, 2]
    # TODO: completar con la recurrencia pesos[L] = pesos[L-1] + pesos[L-2] hasta pasar 10^9
    return pesos


def solve(k, pesos):
    j = len(pesos) - 1
    while pesos[j] > k:
        j -= 1
    digitos = []
    while j >= 0:
        # TODO: si pesos[j] cabe en k, poner "1" y restarlo; si no, poner "0"
        j -= 1
    return "".join(digitos)


def main():
    pesos = pesos_fib()
    casos = int(sys.stdin.readline())
    for _ in range(casos):
        k = int(sys.stdin.readline())
        print(solve(k, pesos))


if __name__ == "__main__":
    main()
