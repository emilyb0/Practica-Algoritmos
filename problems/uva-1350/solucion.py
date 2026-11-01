import sys


def pesos_fib():
    # pesos[L] = cuantos pinarios (contando el 0) tienen a lo sumo L+1 digitos
    # pesos[L] = pesos[L-1] + pesos[L-2]: es Fibonacci
    pesos = [1, 2]
    while pesos[-1] <= 10 ** 9:
        pesos.append(pesos[-1] + pesos[-2])
    return pesos


def solve(k, pesos):
    # se arma el k-esimo pinario de izquierda a derecha restando el mayor peso que quepa
    j = len(pesos) - 1
    while pesos[j] > k:
        j -= 1
    digitos = []
    while j >= 0:
        if pesos[j] <= k:
            digitos.append("1")
            k -= pesos[j]
        else:
            digitos.append("0")
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
