import sys


def main():
    data = sys.stdin.read().split()
    for i in range(0, len(data) - 1, 2):
        s, r = sorted(data[i]), int(data[i + 1])
        actual = []

        def bt(desde):
            if len(actual) == r:
                print("".join(actual))
            else:
                for j in range(desde, len(s)):
                    # TODO: saltar repetidos en el mismo nivel, agregar, recursion, quitar
                    pass

        bt(0)


main()
