import sys

MAXS = 351


def main():
    dp = [[0] * (MAXS + 1) for _ in range(27)]
    dp[0][0] = 1
    for letra in range(1, 27):
        # TODO: recorrer l y s de mayor a menor y sumar dp[l-1][s-letra]
        pass
    data = sys.stdin.read().split()
    i, caso = 0, 1
    seguir = len(data) >= 2 and not (data[0] == "0" and data[1] == "0")
    while seguir:
        l, s = int(data[i]), int(data[i + 1])
        # TODO: respuesta (cuidado con l > 26 o s > 351)
        print(f"Case {caso}: {0}")
        caso += 1
        i += 2
        seguir = i + 1 < len(data) and not (data[i] == "0" and data[i + 1] == "0")


main()
