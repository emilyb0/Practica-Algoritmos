import sys


def solve(meses, s, d):
    # mejor total del ano completando 'meses'; None si ninguna forma cumple
    if len(meses) == 12:
        ans = sum(meses)
    else:
        ans = None
        for v in (s, -d):    # cada mes es superavit (s) o deficit (-d)
            meses.append(v)
            # TODO: poda: seguir solo si los ultimos 5 meses suman < 0 (o aun no hay 5)
            # TODO: llamar solve y quedarse con el mayor resultado que no sea None
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
