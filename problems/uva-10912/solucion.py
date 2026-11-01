import sys


def phi(l, s, x, mem):
    # formas de escribir una cadena creciente de l letras que sume s usando solo letras >= x
    if (l, s, x) in mem:
        ans = mem[(l, s, x)]
    else:
        if l == 0:
            if s == 0:
                ans = 1
            else:
                ans = 0
        elif x > 26 or s < x:
            ans = 0
        else:
            ans = phi(l, s, x + 1, mem)              # no uso la letra x
            ans += phi(l - 1, s - x, x + 1, mem)     # uso la letra x
        mem[(l, s, x)] = ans
    return ans


def main():
    mem = dict()
    caso = 1
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0 0":
        l, s = map(int, linea.split())
        if l > 26 or s > 351:    # 351 = 1 + 2 + ... + 26
            ans = 0
        else:
            ans = phi(l, s, 1, mem)
        print(f"Case {caso}: {ans}")
        caso += 1
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
