import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for _ in range(t):
        expr = data[i]; i += 1
        n = int(data[i]); i += 1
        nums = sorted((int(x) for x in data[i:i + n]), reverse=True); i += n
        pila, signo, positivos = [1], 1, 0
        for ch in expr:
            # TODO: manejar '(', ')', '+', '-', 'x'
            pass
        print(sum(nums[:positivos]) - sum(nums[positivos:]))


main()
