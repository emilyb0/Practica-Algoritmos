import sys


def positivos(expr):
    # cuantas 'x' quedan con signo + al quitar los parentesis
    pila, signo, ans = [1], 1, 0
    for ch in expr:
        if ch == "(":
            pila.append(pila[-1] * signo)
            signo = 1
        elif ch == ")":
            pila.pop()
        elif ch == "+":
            signo = 1
        elif ch == "-":
            signo = -1
        elif ch == "x":
            if pila[-1] * signo > 0:
                ans += 1
    return ans


def solve(expr, nums):
    # voraz: los numeros mas grandes van con signo +, el resto con signo -
    nums = sorted(nums, reverse=True)
    p = positivos(expr)
    return sum(nums[:p]) - sum(nums[p:])


def main():
    casos = int(sys.stdin.readline())
    for _ in range(casos):
        expr = sys.stdin.readline().strip()
        n = int(sys.stdin.readline())
        nums = list(map(int, sys.stdin.readline().split()))
        print(solve(expr, nums))


if __name__ == "__main__":
    main()
