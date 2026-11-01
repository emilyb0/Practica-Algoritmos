import sys


def solve(s, r, desde, actual, ans):
    # s ordenada; agrega a ans todas las combinaciones de r letras sin repetir
    if len(actual) == r:
        ans.append("".join(actual))
    else:
        for j in range(desde, len(s)):
            # en un mismo nivel no se repite la misma letra
            if j == desde or s[j] != s[j - 1]:
                actual.append(s[j])
                solve(s, r, j + 1, actual, ans)
                actual.pop()


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":
        palabra, r = linea.split()
        s = sorted(palabra)
        ans = []
        solve(s, int(r), 0, [], ans)
        for comb in ans:
            print(comb)
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
