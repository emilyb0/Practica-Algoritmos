import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for _ in range(t):
        expr = data[i]; i += 1
        n = int(data[i]); i += 1
        nums = sorted((int(x) for x in data[i:i + n]), reverse=True); i += n
        # signo efectivo de cada 'x' tras quitar parentesis
        pila, signo, positivos = [1], 1, 0
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
                    positivos += 1
        # voraz: los numeros mas grandes van con signo +, el resto con signo -
        out.append(str(sum(nums[:positivos]) - sum(nums[positivos:])))
    sys.stdout.write("".join(x + "\n" for x in out))


main()
