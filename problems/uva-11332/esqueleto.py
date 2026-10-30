import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    out = []
    while i < len(data) and data[i] != "0":
        n = int(data[i])
        # TODO: mientras n >= 10, reemplazar n por la suma de sus digitos
        out.append(str(n))
        i += 1
    print("\n".join(out))


main()
