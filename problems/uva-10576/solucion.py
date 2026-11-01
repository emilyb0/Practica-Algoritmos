import sys


def solve(meses, s, d):
    # mejor total del ano completando 'meses'; None si ninguna forma cumple
    if len(meses) == 12:
        ans = sum(meses)
    else:
        ans = None
        for v in (s, -d):    # cada mes es superavit (s) o deficit (-d)
            meses.append(v)
            # poda: toda ventana de 5 meses seguidos debe tener deficit (suma < 0)
            if len(meses) < 5 or sum(meses[-5:]) < 0:
                r = solve(meses, s, d)
                if r is not None and (ans is None or r > ans):
                    ans = r
            meses.pop()
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":
        s, d = map(int, linea.split())
        ans = solve([], s, d)
        if ans is None or ans < 0:
            print("Deficit")
        else:
            print(ans)
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()
