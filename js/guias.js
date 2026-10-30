// Contenido de las guias: reconocer la tecnica, lectura rapida y plantillas por tema.
// Todo el codigo termina los ciclos con la condicion del while o con banderas (sin break).
window.GUIAS = {};

GUIAS.reconocer = {
  titulo: "Cómo reconocer la técnica",
  intro: "Antes de escribir código, lee las restricciones: el tamaño de la entrada casi siempre delata la técnica. Escribe en 2 líneas qué técnica usarás y por qué (recuerdo activo).",
  senales: [
    { senal: "n pequeño (n ≤ 10…20), «todas las formas», «listar», «existe alguna»", tecnica: "Backtracking", tema: "bt",
      detalle: "Explora decisiones una por una y deshaz al volver. Poda en cuanto una solución parcial ya no pueda servir." },
    { senal: "Subproblemas que se repiten, «cuántas formas», «máximo / mínimo» con decisiones encadenadas", tecnica: "Programación dinámica", tema: "dp",
      detalle: "Define el estado (qué necesito saber para continuar), la recurrencia y el orden de cálculo. Si la recursión repite llamadas, memoriza." },
    { senal: "«Ordenar y escoger», cada paso toma la mejor opción local", tecnica: "Voraz", tema: "voraz",
      detalle: "Antes de confiar, busca un contraejemplo pequeño (3 o 4 elementos). Si no lo encuentras, intenta un argumento de intercambio." },
    { senal: "Partir en mitades, «buscar en un rango», respuesta monótona («¿alcanza con X?»)", tecnica: "Dividir y conquistar", tema: "dyc",
      detalle: "Búsqueda binaria sobre la respuesta, bisección en reales, o recursión que combina dos mitades (merge sort, par más cercano)." },
    { senal: "Problema NP-completo (TSP, mochila, subset sum, coloreo, conjunto independiente) con entrada pequeña", tecnica: "Backtracking con poda, DP de mochila o DP con máscara de bits", tema: "np",
      detalle: "n ≤ 20 → máscara de bits (2^n estados). Valores pequeños (suma ≤ 10^5) → DP de mochila pseudo-polinomial. Si no, backtracking con buena poda." },
  ],
  tamanos: [
    ["n ≤ 10", "O(n!) — permutaciones"],
    ["n ≤ 20", "O(2^n · n) — subconjuntos, máscaras de bits"],
    ["n ≤ 500", "O(n^3) — DP de intervalos, Floyd"],
    ["n ≤ 5 000", "O(n^2) — DP de dos índices (LCS)"],
    ["n ≤ 10^5 … 10^6", "O(n log n) — ordenar, búsqueda binaria, heap, árbol de segmentos"],
    ["n ≥ 10^9 o respuesta real", "O(log n) — búsqueda binaria o bisección sobre la respuesta"],
  ],
  preguntas: [
    "¿Me piden enumerar o decidir con n muy pequeño? → backtracking.",
    "¿Si escribo la recursión ingenua, se repiten llamadas con los mismos argumentos? → DP.",
    "¿Ordenar los datos hace obvia la elección? ¿Encontré un contraejemplo? → voraz o DP.",
    "¿«¿Se puede con X?» es monótono en X? → búsqueda binaria sobre la respuesta.",
    "¿El problema se parece a TSP, mochila o subset sum? → mira el tamaño: máscara, mochila o poda.",
  ],
  voraz_contraejemplo: {
    titulo: "Ejemplo de contraejemplo para un voraz",
    texto: "Monedas {1, 3, 4} y monto 6. El voraz «siempre la moneda más grande» da 4 + 1 + 1 (3 monedas), pero 3 + 3 usa 2. Por eso el cambio de monedas general es DP, no voraz.",
  },
};

GUIAS.lectura = {
  titulo: "Lectura de entrada rápida",
  intro: "Lee toda la entrada de una vez con sys.stdin.read().split() y avanza con un índice. Es más rápido que input() y no te importan los saltos de línea ni las líneas en blanco.",
  patrones: [
    { nombre: "Base: todo de una vez + índice", codigo:
`import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    n = int(data[i]); i += 1
    nums = [int(x) for x in data[i:i + n]]; i += n
    print(sum(nums))


main()` },
    { nombre: "T casos de prueba", codigo:
`import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for caso in range(1, t + 1):
        n = int(data[i]); i += 1
        nums = [int(x) for x in data[i:i + n]]; i += n
        out.append(f"Case {caso}: {max(nums)}")
    print("\\n".join(out))


main()` },
    { nombre: "Hasta fin de archivo (EOF)", codigo:
`import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    out = []
    while i < len(data):          # el ciclo termina solo, sin break
        a, b = int(data[i]), int(data[i + 1]); i += 2
        out.append(str(a + b))
    print("\\n".join(out))


main()` },
    { nombre: "Termina en 0 (o en «0 0»)", codigo:
`import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    out = []
    n = int(data[i]) if data else 0
    while n != 0:                 # la condicion del while detecta el terminador
        i += 1
        nums = [int(x) for x in data[i:i + n]]; i += n
        out.append(str(sum(nums)))
        n = int(data[i]) if i < len(data) else 0
    print("\\n".join(out))


main()` },
    { nombre: "Listas y matrices", codigo:
`import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    filas, cols = int(data[i]), int(data[i + 1]); i += 2
    # matriz de numeros
    m = [[int(data[i + r * cols + c]) for c in range(cols)] for r in range(filas)]
    i += filas * cols
    # grilla de caracteres: cada fila es una "palabra" sin espacios
    k = int(data[i]); i += 1
    grilla = data[i:i + k]; i += k
    print(m, grilla)


main()` },
    { nombre: "Líneas completas (cuando importan los espacios)", codigo:
`import sys


def main():
    lineas = sys.stdin.read().split("\\n")
    i = 0
    out = []
    while i < len(lineas) and lineas[i].strip() != "":
        palabras = lineas[i].split()
        out.append(" ".join(reversed(palabras)))
        i += 1
    print("\\n".join(out))


main()` },
    { nombre: "Salida rápida y casos separados por línea en blanco", codigo:
`import sys


def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    bloques = []
    for c in range(t):
        bloques.append(str(int(data[1 + c]) * 2))
    # "\\n\\n".join pone una linea en blanco ENTRE casos (no al final)
    sys.stdout.write("\\n\\n".join(bloques) + "\\n")


main()` },
  ],
  errores: [
    "Olvidar avanzar el índice i después de leer → lees el mismo dato dos veces.",
    "Usar input() en un ciclo con miles de líneas → tiempo excedido.",
    "Imprimir dentro del ciclo con print() muchas veces → usa una lista y '\\n'.join al final.",
    "Leer el terminador como un caso más → revisa la condición del while.",
    "Formato exacto: «Case 1: 5» no es «Case 1:5». Copia el formato del ejemplo.",
  ],
};

GUIAS.plantillas = {
  titulo: "Plantillas por tema",
  temas: [
    { tema: "dyc", nombre: "Dividir y conquistar", items: [
      { nombre: "Búsqueda binaria sobre la respuesta (enteros)", codigo:
`def factible(x):
    # TODO: ¿se puede con x? (debe ser monotono)
    return True


def mayor_factible(lo, hi):
    # mayor x en [lo, hi] con factible(x); supone factible(lo)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if factible(mid):
            lo = mid
        else:
            hi = mid - 1
    return lo` },
      { nombre: "Bisección en reales", codigo:
`def biseccion(lo, hi, f):
    # f(lo) < 0 <= f(hi); 100 iteraciones dan precision de sobra
    for _ in range(100):
        mid = (lo + hi) / 2
        if f(mid) < 0:
            lo = mid
        else:
            hi = mid
    return hi` },
      { nombre: "Dividir, conquistar y combinar (merge sort contando inversiones)", codigo:
`def ordenar(a):
    if len(a) <= 1:
        return a, 0
    mid = len(a) // 2
    izq, ci = ordenar(a[:mid])
    der, cd = ordenar(a[mid:])
    res, inv, i, j = [], ci + cd, 0, 0
    while i < len(izq) and j < len(der):
        if izq[i] <= der[j]:
            res.append(izq[i]); i += 1
        else:
            res.append(der[j]); j += 1
            inv += len(izq) - i
    res.extend(izq[i:]); res.extend(der[j:])
    return res, inv` },
    ] },
    { tema: "dp", nombre: "Programación dinámica", items: [
      { nombre: "Memoización (de arriba hacia abajo)", codigo:
`import sys
from functools import lru_cache

sys.setrecursionlimit(10000)


@lru_cache(maxsize=None)
def f(i, resto):
    if i == N:
        return 0
    mejor = f(i + 1, resto)                    # no tomar
    if peso[i] <= resto:
        mejor = max(mejor, valor[i] + f(i + 1, resto - peso[i]))  # tomar
    return mejor` },
      { nombre: "Mochila 0/1 (tabla de una fila)", codigo:
`def mochila(pesos, valores, cap):
    dp = [0] * (cap + 1)
    for w, v in zip(pesos, valores):
        for c in range(cap, w - 1, -1):    # de mayor a menor: cada objeto una vez
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[cap]` },
      { nombre: "LIS en O(n log n)", codigo:
`from bisect import bisect_left


def lis(a):
    colas = []
    for x in a:
        k = bisect_left(colas, x)
        if k == len(colas):
            colas.append(x)
        else:
            colas[k] = x
    return len(colas)` },
      { nombre: "LCS (dos índices)", codigo:
`def lcs(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[len(a)][len(b)]` },
      { nombre: "DP de intervalos", codigo:
`def intervalos(n, costo_union):
    dp = [[0] * n for _ in range(n)]
    for largo in range(2, n + 1):
        for i in range(n - largo + 1):
            j = i + largo - 1
            dp[i][j] = min(dp[i][k] + dp[k + 1][j] for k in range(i, j)) + costo_union(i, j)
    return dp[0][n - 1]` },
    ] },
    { tema: "voraz", nombre: "Algoritmos voraces", items: [
      { nombre: "Selección de actividades (ordenar por fin)", codigo:
`def actividades(intervalos):
    cuenta, fin = 0, float("-inf")
    for ini, f in sorted(intervalos, key=lambda x: x[1]):
        if ini >= fin:
            cuenta += 1
            fin = f
    return cuenta` },
      { nombre: "Cubrimiento de intervalos (sin break)", codigo:
`def cubrir(intervalos, L):
    intervalos.sort()
    cubierto, usados, j, atascado = 0, 0, 0, False
    while cubierto < L and not atascado:
        mejor = cubierto
        while j < len(intervalos) and intervalos[j][0] <= cubierto:
            mejor = max(mejor, intervalos[j][1])
            j += 1
        if mejor == cubierto:
            atascado = True
        else:
            usados += 1
            cubierto = mejor
    return -1 if atascado else usados` },
      { nombre: "Kruskal con Union-Find", codigo:
`def kruskal(n, aristas):           # aristas = [(costo, a, b)]
    padre = list(range(n))

    def raiz(x):
        while padre[x] != x:
            padre[x] = padre[padre[x]]
            x = padre[x]
        return x

    total, usadas = 0, 0
    for c, a, b in sorted(aristas):
        ra, rb = raiz(a), raiz(b)
        if ra != rb:
            padre[ra] = rb
            total += c
            usadas += 1
    return total if usadas == n - 1 else None` },
      { nombre: "Dijkstra con heapq", codigo:
`import heapq


def dijkstra(ady, origen):        # ady[u] = [(v, peso)]
    dist = [float("inf")] * len(ady)
    dist[origen] = 0
    pq = [(0, origen)]
    while pq:
        d, u = heapq.heappop(pq)
        if d == dist[u]:
            for v, w in ady[u]:
                if d + w < dist[v]:
                    dist[v] = d + w
                    heapq.heappush(pq, (dist[v], v))
    return dist` },
    ] },
    { tema: "bt", nombre: "Backtracking", items: [
      { nombre: "Esquema general (con bandera para detenerse)", codigo:
`def bt(paso, estado):
    if es_solucion(paso, estado):
        return True
    encontrado = False
    opciones = candidatos(paso, estado)
    k = 0
    while not encontrado and k < len(opciones):   # sin break: la bandera corta
        op = opciones[k]
        if es_valida(op, estado):
            aplicar(op, estado)
            encontrado = bt(paso + 1, estado)
            deshacer(op, estado)
        k += 1
    return encontrado` },
      { nombre: "Subconjuntos sin repetidos", codigo:
`def subconjuntos(nums, objetivo):
    nums.sort()
    res, actual = [], []

    def bt(desde, resto):
        if resto == 0:
            res.append(actual[:])
        for j in range(desde, len(nums)):
            if (j == desde or nums[j] != nums[j - 1]) and nums[j] <= resto:
                actual.append(nums[j])
                bt(j + 1, resto - nums[j])
                actual.pop()

    bt(0, objetivo)
    return res` },
      { nombre: "Permutaciones con marcas", codigo:
`def permutaciones(n):
    usado, actual, res = [False] * n, [], []

    def bt():
        if len(actual) == n:
            res.append(actual[:])
        for v in range(n):
            if not usado[v]:
                usado[v] = True
                actual.append(v)
                bt()
                actual.pop()
                usado[v] = False

    bt()
    return res` },
      { nombre: "N reinas (poda por columnas y diagonales)", codigo:
`def reinas(n):
    col, d1, d2 = [False] * n, [False] * (2 * n), [False] * (2 * n)
    cuenta = 0

    def bt(f):
        nonlocal cuenta
        if f == n:
            cuenta += 1
        for c in range(n):
            if not col[c] and not d1[f + c] and not d2[f - c + n]:
                col[c] = d1[f + c] = d2[f - c + n] = True
                bt(f + 1)
                col[c] = d1[f + c] = d2[f - c + n] = False

    bt(0)
    return cuenta` },
    ] },
    { tema: "np", nombre: "NP-completo con entrada pequeña", items: [
      { nombre: "TSP con máscara de bits", codigo:
`def tsp(d):                     # d = matriz de distancias, 0 es el inicio
    n = len(d)
    INF = float("inf")
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for mask in range(1 << n):
        for u in range(n):
            if dp[mask][u] < INF:
                for v in range(n):
                    if not mask & (1 << v):
                        nm = mask | (1 << v)
                        dp[nm][v] = min(dp[nm][v], dp[mask][u] + d[u][v])
    return min(dp[(1 << n) - 1][u] + d[u][0] for u in range(n))` },
      { nombre: "Subset sum (DP pseudo-polinomial)", codigo:
`def subset_sum(nums, objetivo):
    posible = [False] * (objetivo + 1)
    posible[0] = True
    for x in nums:
        for s in range(objetivo, x - 1, -1):
            if posible[s - x]:
                posible[s] = True
    return posible[objetivo]` },
      { nombre: "Ramificación y poda (máximo)", codigo:
`def mejor_subconjunto(n, valor, compatible):
    mejor = 0
    elegidos = []

    def bt(i, acumulado):
        nonlocal mejor
        cota = acumulado + sum(valor[i:])       # cota optimista
        if cota > mejor:                         # poda: si no puede mejorar, no sigue
            if i == n:
                mejor = acumulado
            else:
                if compatible(elegidos, i):
                    elegidos.append(i)
                    bt(i + 1, acumulado + valor[i])
                    elegidos.pop()
                bt(i + 1, acumulado)

    bt(0, 0)
    return mejor` },
    ] },
  ],
};
