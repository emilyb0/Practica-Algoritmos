import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i, out = 0, []
    while i + 1 < len(data) and data[i + 1] != 0:
        t, n = data[i], data[i + 1]
        nums = data[i + 2:i + 2 + n]
        i += 2 + n
        out.append(f"Sums of {t}:")
        sumas = []
        actual = []

        def bt(desde, resto):
            if resto == 0:
                sumas.append("+".join(map(str, actual)))
            else:
                for j in range(desde, n):
                    # no repetir el mismo numero en el mismo nivel (evita sumas duplicadas)
                    if (j == desde or nums[j] != nums[j - 1]) and nums[j] <= resto:
                        actual.append(nums[j])
                        bt(j + 1, resto - nums[j])
                        actual.pop()

        bt(0, t)
        out.extend(sumas if sumas else ["NONE"])
    sys.stdout.write("".join(x + "\n" for x in out))


main()
