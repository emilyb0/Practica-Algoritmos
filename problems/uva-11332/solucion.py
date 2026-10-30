import sys


def g(n):
    while n >= 10:
        s = 0
        while n > 0:
            s += n % 10
            n //= 10
        n = s
    return n


def main():
    data = sys.stdin.read().split()
    i, out = 0, []
    while i < len(data) and data[i] != "0":
        out.append(str(g(int(data[i]))))
        i += 1
    sys.stdout.write("".join(x + "\n" for x in out))


main()
