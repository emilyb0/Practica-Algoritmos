import sys


def positivos(expr):
    # cuantas 'x' quedan con signo + al quitar los parentesis
    pila, signo, ans = [1], 1, 0
    for ch in expr:
        pass  # TODO: '(' apila pila[-1] * signo, ')' desapila, '+'/'-' cambian signo, 'x' cuenta si queda positiva
    return ans


def solve(expr, nums):
    nums = sorted(nums, reverse=True)
    p = positivos(expr)
    return 0  # TODO: voraz: los p mas grandes suman, el resto resta


def main():
    casos = int(sys.stdin.readline())
    for _ in range(casos):
        expr = sys.stdin.readline().strip()
        n = int(sys.stdin.readline())
        nums = list(map(int, sys.stdin.readline().split()))
        print(solve(expr, nums))


if __name__ == "__main__":
    main()
