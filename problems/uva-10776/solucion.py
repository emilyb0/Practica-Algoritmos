import sys


def main():
    data = sys.stdin.read().split()
    out = []
    for i in range(0, len(data) - 1, 2):
        s, r = sorted(data[i]), int(data[i + 1])
        actual = []

        def bt(desde):
            if len(actual) == r:
                out.append("".join(actual))
            else:
                for j in range(desde, len(s)):
                    # en un mismo nivel no se repite la misma letra
                    if j == desde or s[j] != s[j - 1]:
                        actual.append(s[j])
                        bt(j + 1)
                        actual.pop()

        bt(0)
    sys.stdout.write("".join(x + "\n" for x in out))


main()
