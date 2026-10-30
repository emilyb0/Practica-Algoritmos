import sys


def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    # pesos[L] = cuantos pinarios tienen a lo sumo L+1 digitos (contando el 0) y cumple
    # pesos[L] = pesos[L-1] + pesos[L-2]  (recurrencia de DP: Fibonacci).
    # Asi, poner un 1 en la posicion L "salta" pesos[L] numeros: el k-esimo pinario
    # se arma de izquierda a derecha restando el mayor peso que quepa (sin dos 1 seguidos).
    pesos = [1, 2]
    while pesos[-1] <= 10 ** 9:
        pesos.append(pesos[-1] + pesos[-2])
    out = []
    for c in range(1, t + 1):
        k = int(data[c])
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
        out.append("".join(digitos))
    sys.stdout.write("".join(x + "\n" for x in out))


main()
