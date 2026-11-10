// Contenido de las guias: tecnicas, reconocer la tecnica, facil o dificil, lectura y plantillas por tema.
// Todo el codigo termina los ciclos con la condicion del while o con banderas (sin break).
window.GUIAS = {};

// Repaso corto de cada tecnica (se muestra junto a su animacion).
GUIAS.tecnicas = {
  dyc: {
    idea: "Partir el problema en partes más pequeñas del mismo tipo, resolver cada parte y combinar. En el examen casi siempre aparece como búsqueda binaria o bisección sobre la respuesta: en cada paso se descarta la mitad que no puede tener la respuesta.",
    cuando: ["La pregunta «¿se puede con X?» es monótona: si X sirve, todo lo menor (o mayor) también.",
             "La respuesta es un número muy grande (hasta 10^9) o un real con decimales.",
             "Se pide combinar dos mitades: merge sort, par de puntos más cercano, cuadrantes de una matriz."],
    pasos: ["Define la función factible(x) y verifica que sea monótona.",
            "Escoge lo y hi que seguro encierran la respuesta.",
            "Repite: mid; si factible(mid) mueve un extremo, si no el otro. En reales, 100 iteraciones.",
            "Si es divide y combina: caso base pequeño, dos llamadas recursivas y el paso de combinar."],
    complejidad: "O(log(rango) · costo de factible). Divide y combina: O(n log n).",
    errores: ["mid = (lo + hi) // 2 con lo = mid → ciclo infinito: usa (lo + hi + 1) // 2.",
              "Comparar reales con == en vez de iterar un número fijo de veces.",
              "Olvidar que factible debe ser monótona: si no lo es, la búsqueda binaria no sirve."],
  },
  bt: {
    idea: "Construir la solución decisión por decisión. Si una decisión parcial ya no puede llevar a una solución válida, se poda y se vuelve atrás para probar otra opción.",
    cuando: ["n es pequeño (n ≤ 10…20) y piden todas las formas, listar, o decidir si existe alguna.",
             "Hay restricciones que se pueden revisar a medida que avanzas (sudoku, reinas, sumas).",
             "No ves una recurrencia con subproblemas repetidos (si la ves, quizá es DP)."],
    pasos: ["Define qué decide cada nivel (qué número, qué casilla, qué color).",
            "Escribe feasible: ¿esta decisión respeta las reglas con lo que ya decidí?",
            "solve(nivel): caso base al completar; si no, prueba cada opción factible, avanza y deshaz.",
            "Agrega poda: corta en cuanto lo parcial no pueda mejorar o completar la solución.",
            "Para detenerte al encontrar una solución usa una bandera en el while, no break."],
    complejidad: "Exponencial en el peor caso (k^n o n!), pero la poda lo hace viable con n pequeño.",
    errores: ["Olvidar deshacer la decisión al volver (actual.pop(), desmarcar).",
              "Generar repetidos: en un mismo nivel no pruebes dos veces el mismo valor.",
              "Usar break para cortar la búsqueda: el curso no lo permite."],
  },
  dp: {
    idea: "Cuando la recursión repite los mismos subproblemas, se guarda cada respuesta (mem) para calcularla una sola vez. Se puede hacer de arriba hacia abajo (phi con mem) o llenando una tabla.",
    cuando: ["Piden contar formas, o un máximo o mínimo, con decisiones encadenadas.",
             "Al escribir la recursión ingenua ves llamadas repetidas con los mismos argumentos.",
             "El voraz falla con un contraejemplo pequeño (por ejemplo, monedas {1, 3, 4})."],
    pasos: ["Define el estado: ¿qué necesito saber para seguir? (índice, capacidad restante, máscara).",
            "Escribe la recurrencia: caso base y cómo se combina con estados más pequeños.",
            "Memoriza: if estado in mem: ans = mem[estado] … mem[estado] = ans.",
            "Si la recursión es muy profunda, pásala a tabla en el orden correcto."],
    complejidad: "número de estados × costo de cada transición.",
    errores: ["Estado incompleto: falta un dato y la recurrencia da valores mezclados.",
              "En mochila 0/1 con una sola fila, recorrer la capacidad de menor a mayor (usa el objeto dos veces).",
              "Recursión muy profunda en Python: cambia a tabla."],
  },
  voraz: {
    idea: "En cada paso tomar la opción que se ve mejor ahora y no volver atrás. Funciona solo si esa elección local nunca impide llegar al óptimo, así que hay que justificarla.",
    cuando: ["Ordenar los datos hace obvia la elección (terminar primero, el más grande, el más barato).",
             "Intervalos, emparejamientos ordenados, árboles de expansión mínima, caminos mínimos.",
             "Probaste 3 o 4 casos pequeños a mano y no encontraste contraejemplo."],
    pasos: ["Decide el criterio de orden.",
            "Recorre una vez tomando lo que sirva y descartando lo que choque.",
            "Busca un contraejemplo pequeño; si no lo hay, argumenta por intercambio.",
            "Cuida los empates: a veces cambian la respuesta."],
    complejidad: "Normalmente O(n log n) por el ordenamiento.",
    errores: ["Ordenar por el criterio equivocado (por inicio en vez de por fin).",
              "Confiar en el voraz sin buscar contraejemplo: quizá era DP.",
              "Olvidar el caso en que no se puede (devolver -1 o IMPOSSIBLE)."],
  },
};

GUIAS.reconocer = {
  titulo: "Cómo reconocer la técnica",
  intro: "Antes de escribir código, lee las restricciones: el tamaño de la entrada casi siempre delata la técnica. Escribe en 2 líneas qué técnica usarás y por qué (recuerdo activo).",
  senales: [
    { senal: "n pequeño (n ≤ 10…20), «todas las formas», «listar», «existe alguna», sudoku o reinas", tecnica: "Backtracking", tema: "bt",
      detalle: "Explora decisiones una por una y deshaz al volver. Poda en cuanto una solución parcial ya no pueda servir." },
    { senal: "Subproblemas que se repiten, «cuántas formas», «máximo / mínimo» con decisiones encadenadas", tecnica: "Programación dinámica", tema: "dp",
      detalle: "Define el estado, la recurrencia y memoriza. Con n ≤ 16…20 y «visitar todos», el estado puede ser una máscara de bits (TSP)." },
    { senal: "«Ordenar y escoger», cada paso toma la mejor opción local", tecnica: "Voraz", tema: "voraz",
      detalle: "Antes de confiar, busca un contraejemplo pequeño (3 o 4 elementos). Si no lo encuentras, intenta un argumento de intercambio." },
    { senal: "Partir en mitades, «buscar en un rango», respuesta monótona («¿alcanza con X?»), respuesta real", tecnica: "Dividir y conquistar", tema: "dyc",
      detalle: "Búsqueda binaria sobre la respuesta, bisección en reales, o recursión que combina dos mitades (merge sort, par más cercano)." },
  ],
  tamanos: [
    ["n ≤ 10", "O(n!) — permutaciones (backtracking)"],
    ["n ≤ 20", "O(2^n · n) — subconjuntos o máscaras de bits (backtracking o DP)"],
    ["n ≤ 500", "O(n^3) — DP de intervalos"],
    ["n ≤ 5 000", "O(n^2) — DP de dos índices (LCS)"],
    ["n ≤ 10^5 … 10^6", "O(n log n) — ordenar (voraz), búsqueda binaria, heap, árbol de segmentos"],
    ["n ≥ 10^9 o respuesta real", "O(log n) — búsqueda binaria o bisección sobre la respuesta"],
  ],
  preguntas: [
    "¿Me piden enumerar o decidir con n muy pequeño? → backtracking.",
    "¿Si escribo la recursión ingenua, se repiten llamadas con los mismos argumentos? → DP.",
    "¿Ordenar los datos hace obvia la elección? ¿Encontré un contraejemplo? → voraz o DP.",
    "¿«¿Se puede con X?» es monótono en X? → búsqueda binaria sobre la respuesta.",
  ],
  voraz_contraejemplo: {
    titulo: "Ejemplo de contraejemplo para un voraz",
    texto: "Monedas {1, 3, 4} y monto 6. El voraz «siempre la moneda más grande» da 4 + 1 + 1 (3 monedas), pero 3 + 3 usa 2. Por eso el cambio de monedas general es DP, no voraz.",
  },
};

// Senales para estimar la dificultad durante la lectura del examen.
GUIAS.dificultad = {
  intro: "En el examen 2 aceptados ya son 5.0. Por eso lo más importante de los primeros 10 minutos es leer los 4 problemas y empezar por los que se ven más fáciles.",
  positivas: [
    { id: "entiendo", texto: "Entiendo qué piden después de una sola lectura" },
    { id: "parecido", texto: "Se parece a un problema o plantilla que ya hice" },
    { id: "frase", texto: "Puedo explicar la idea de la solución en una frase" },
    { id: "lectura", texto: "La entrada es fácil de leer (un patrón que conozco)" },
  ],
  negativas: [
    { id: "limites", texto: "Los límites son grandes y la idea obvia sería muy lenta" },
    { id: "especiales", texto: "Tiene muchos casos especiales o un formato de salida raro" },
    { id: "combina", texto: "Parece necesitar dos técnicas a la vez" },
    { id: "atascada", texto: "Después de 5 minutos no veo cómo empezar" },
  ],
  estrategia: [
    "Minutos 0–10: lee los 4, marca las señales y ordénalos de más fácil a más difícil.",
    "Empieza por el más fácil: el primer aceptado da calma y tiempo.",
    "Si llevas 35–40 minutos en un problema sin avanzar, pasa al siguiente y vuelve después.",
    "Con 2 aceptados ya tienes 5.0: lo que resuelvas después es bono.",
    "En los últimos 15 minutos envía tu mejor versión de cada problema empezado: un intento bien encaminado vale 3.0–4.0.",
  ],
};

GUIAS.lectura = {
  titulo: "Lectura de entrada",
  intro: "El main lee la entrada línea por línea con sys.stdin.readline(), llama a la función que resuelve y escribe lo que ella retorna. El ciclo termina con la condición del while: la línea vacía (fin de archivo) o el terminador.",
  patrones: [
    { nombre: "Base: una línea con varios números", codigo:
`import sys


def solve(nums):
    ans = sum(nums)
    return ans


def main():
    n = int(sys.stdin.readline())
    nums = list(map(int, sys.stdin.readline().split()))
    print(solve(nums))


if __name__ == "__main__":
    main()` },
    { nombre: "T casos de prueba", codigo:
`import sys


def solve(nums):
    ans = max(nums)
    return ans


def main():
    casos = int(sys.stdin.readline())
    for c in range(1, casos + 1):
        n = int(sys.stdin.readline())
        nums = list(map(int, sys.stdin.readline().split()))
        print(f"Case {c}: {solve(nums)}")


if __name__ == "__main__":
    main()` },
    { nombre: "Hasta fin de archivo (EOF)", codigo:
`import sys


def solve(a, b):
    ans = a + b
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":                    # readline() devuelve "" al final del archivo
        a, b = map(int, linea.split())
        print(solve(a, b))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()` },
    { nombre: "Termina en 0 (o en «0 0»)", codigo:
`import sys


def solve(t, nums):
    ans = t + sum(nums)
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "" and linea != "0 0":    # la condicion del while detecta el terminador
        datos = list(map(int, linea.split()))
        t = datos[0]
        n = datos[1]
        nums = datos[2:2 + n]
        print(solve(t, nums))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()` },
    { nombre: "Listas y matrices", codigo:
`import sys


def solve(M, grilla):
    ans = sum(sum(fila) for fila in M)
    return ans


def main():
    filas, cols = map(int, sys.stdin.readline().split())
    M = []
    for _ in range(filas):                # matriz de numeros: una fila por linea
        M.append(list(map(int, sys.stdin.readline().split())))
    k = int(sys.stdin.readline())
    grilla = []
    for _ in range(k):                    # grilla de caracteres: cada fila es un string
        grilla.append(sys.stdin.readline().strip())
    print(solve(M, grilla))


if __name__ == "__main__":
    main()` },
    { nombre: "Línea en blanco entre casos (entrada y salida)", codigo:
`import sys


def solve(nums):
    ans = sum(nums)
    return ans


def main():
    casos = int(sys.stdin.readline())
    for caso in range(casos):
        sys.stdin.readline()              # linea en blanco antes de cada caso
        n = int(sys.stdin.readline())
        nums = []
        for _ in range(n):
            nums.append(int(sys.stdin.readline()))
        if caso > 0:
            print()                       # linea en blanco ENTRE salidas (no al final)
        print(solve(nums))


if __name__ == "__main__":
    main()` },
    { nombre: "Cuando los números vienen partidos en varias líneas", codigo:
`import sys


def solve(nums):
    ans = sum(nums)
    return ans


def main():
    # si el enunciado no garantiza en que linea esta cada numero, se lee todo de una vez
    data = sys.stdin.read().split()
    i = 0
    casos = int(data[i])
    i += 1
    for _ in range(casos):
        n = int(data[i])
        i += 1
        nums = [int(x) for x in data[i:i + n]]
        i += n
        print(solve(nums))


if __name__ == "__main__":
    main()` },
  ],
  errores: [
    "Olvidar leer la siguiente línea al final del while → ciclo infinito.",
    "Olvidar .strip() → la línea trae el salto de línea y «0\\n» no es igual a «0».",
    "Revisar solo el terminador: si la entrada se acaba sin él, readline() devuelve \"\". Por eso el while revisa también linea != \"\".",
    "Leer el terminador como un caso más → revisa la condición del while.",
    "Líneas en blanco entre casos: léelas con sys.stdin.readline() antes de cada caso.",
    "Formato exacto: «Case 1: 5» no es «Case 1:5». Copia el formato del ejemplo.",
  ],
};

GUIAS.plantillas = {
  titulo: "Plantillas y esqueletos por tema",
  temas: [
    { tema: "dyc", nombre: "Dividir y conquistar", items: [
      { esqueleto: true, nombre: "Esqueleto de la técnica: dividir, conquistar y combinar", codigo:
`import sys


def phi(datos, ini, fin):
    # resuelve el problema para datos[ini:fin]
    if fin - ini <= 1:
        ans = 0  # TODO: caso base (problema pequeño que se resuelve directo)
    else:
        mid = (ini + fin) // 2
        izq = phi(datos, ini, mid)        # conquistar la mitad izquierda
        der = phi(datos, mid, fin)        # conquistar la mitad derecha
        ans = izq + der  # TODO: combinar las dos respuestas
    return ans


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":
        datos = list(map(int, linea.split()))
        print(phi(datos, 0, len(datos)))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()` },
      { nombre: "Búsqueda binaria sobre la respuesta (enteros)", codigo:
`import sys


def factible(x, n):
    # TODO: se puede con x? Debe ser monotono: si x sirve, todo lo menor tambien
    ans = x * x <= n
    return ans


def solve(lo, hi, n):
    # mayor x en [lo, hi] con factible(x); supone factible(lo)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if factible(mid, n):
            lo = mid
        else:
            hi = mid - 1
    return lo


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":
        n = int(linea)
        print(solve(0, n, n))
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()` },
      { nombre: "Bisección en reales", codigo:
`import sys


def f(x, c):
    # TODO: funcion creciente; se busca x con f(x) = 0
    ans = x * x - c
    return ans


def solve(lo, hi, c):
    # f(lo) < 0 <= f(hi); 100 iteraciones dan precision de sobra
    for _ in range(100):
        mid = (lo + hi) / 2
        if f(mid, c) < 0:
            lo = mid
        else:
            hi = mid
    return hi


def main():
    linea = sys.stdin.readline().strip()
    while linea != "":
        c = float(linea)
        print(f"{solve(0, max(1.0, c), c):.4f}")
        linea = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()` },
      { nombre: "Dividir, conquistar y combinar (merge sort contando inversiones)", codigo:
`import sys


def phi(a):
    # retorna (a ordenado, numero de inversiones de a)
    if len(a) <= 1:
        ans = (a, 0)
    else:
        mid = len(a) // 2
        izq, ci = phi(a[:mid])
        der, cd = phi(a[mid:])
        res, inv, i, j = [], ci + cd, 0, 0
        while i < len(izq) and j < len(der):     # combinar
            if izq[i] <= der[j]:
                res.append(izq[i])
                i += 1
            else:
                res.append(der[j])
                j += 1
                inv += len(izq) - i
        res.extend(izq[i:])
        res.extend(der[j:])
        ans = (res, inv)
    return ans


def main():
    n = int(sys.stdin.readline())
    a = list(map(int, sys.stdin.readline().split()))
    ordenado, inv = phi(a)
    print(inv)


if __name__ == "__main__":
    main()` },
      { nombre: "Dividir una matriz en 4 cuadrantes", codigo:
`import sys
import math


def phi(M, l, r, h, w):
    # codifica el bloque de M que empieza en (l, r) con h filas y w columnas
    if h == 0 or w == 0:
        res = ""
    elif h == 1 and w == 1:
        res = str(M[l][r])
    else:
        p1 = phi(M, l, r, math.ceil(h / 2), math.ceil(w / 2))
        p2 = phi(M, l, r + math.ceil(w / 2), math.ceil(h / 2), math.floor(w / 2))
        p3 = phi(M, l + math.ceil(h / 2), r, math.floor(h / 2), math.ceil(w / 2))
        p4 = phi(M, l + math.ceil(h / 2), r + math.ceil(w / 2), math.floor(h / 2), math.floor(w / 2))
        ans = p1 + p2 + p3 + p4
        if ans == "0" * len(ans):
            res = "0"
        elif ans == "1" * len(ans):
            res = "1"
        else:
            res = "D" + ans
    return res


def main():
    h, w = map(int, sys.stdin.readline().split())
    M = []
    for _ in range(h):
        M.append(list(map(int, sys.stdin.readline().split())))
    print(phi(M, 0, 0, h, w))


if __name__ == "__main__":
    main()` },
    ] },
    { tema: "bt", nombre: "Backtracking", items: [
      { esqueleto: true, nombre: "Esqueleto de la técnica: feasible + solve", codigo:
`import sys


def feasible(estado, nivel, opcion):
    ans = True
    # TODO: la opcion respeta las reglas con lo que ya decidi?
    return ans


def solve(estado, nivel, n):
    # True si se pudo completar la solucion desde este nivel
    if nivel == n:
        ans = True  # TODO: o guardar / contar la solucion
    else:
        ans = False
        opciones = []  # TODO: valores que se pueden probar en este nivel
        k = 0
        while not ans and k < len(opciones):    # la bandera ans reemplaza al break
            op = opciones[k]
            if feasible(estado, nivel, op):
                estado.append(op)               # decidir
                ans = solve(estado, nivel + 1, n)
                if not ans:
                    estado.pop()                # deshacer
            k += 1
    return ans


def main():
    n = int(sys.stdin.readline())
    estado = []
    if solve(estado, 0, n):
        print(" ".join(map(str, estado)))
    else:
        print("NO")


if __name__ == "__main__":
    main()` },
      { nombre: "Esquema general: feasible + solve (con bandera para detenerse)", codigo:
`import sys


def feasible(T, f, c):
    # se puede poner una reina en (f, c) sin que la ataquen las de las filas anteriores?
    for i in range(f):
        if T[i] == c or abs(T[i] - c) == f - i:
            return False
    return True


def solve(f, T, n):
    # T[i] = columna de la reina de la fila i; True si se pudo completar desde la fila f
    if f == n:
        ans = True
    else:
        ans = False
        c = 0
        while not ans and c < n:              # sin break: la bandera ans corta el ciclo
            if feasible(T, f, c):
                T[f] = c
                ans = solve(f + 1, T, n)
                if not ans:
                    T[f] = None               # deshacer
            c += 1
    return ans


def main():
    n = int(sys.stdin.readline())
    T = [None] * n
    if solve(0, T, n):
        print(" ".join(map(str, T)))
    else:
        print("NO")


if __name__ == "__main__":
    main()` },
      { nombre: "Subconjuntos sin repetidos", codigo:
`import sys


def solve(nums, desde, resto, actual, ans):
    # nums ordenado; agrega a ans cada subconjunto que suma exactamente resto
    if resto == 0:
        ans.append(actual[:])
    else:
        for j in range(desde, len(nums)):
            # en un mismo nivel no se repite el mismo numero
            if (j == desde or nums[j] != nums[j - 1]) and nums[j] <= resto:
                actual.append(nums[j])
                solve(nums, j + 1, resto - nums[j], actual, ans)
                actual.pop()


def main():
    n, objetivo = map(int, sys.stdin.readline().split())
    nums = sorted(map(int, sys.stdin.readline().split()))
    ans = []
    solve(nums, 0, objetivo, [], ans)
    for sub in ans:
        print(sub)


if __name__ == "__main__":
    main()` },
      { nombre: "Permutaciones con marcas", codigo:
`import sys


def solve(n, usado, actual, ans):
    if len(actual) == n:
        ans.append(actual[:])
    else:
        for v in range(n):
            if not usado[v]:
                usado[v] = True               # marcar
                actual.append(v)
                solve(n, usado, actual, ans)
                actual.pop()                  # desmarcar
                usado[v] = False


def main():
    n = int(sys.stdin.readline())
    ans = []
    solve(n, [False] * n, [], ans)
    for p in ans:
        print(" ".join(map(str, p)))


if __name__ == "__main__":
    main()` },
      { nombre: "N reinas: contar todas (poda por columnas y diagonales)", codigo:
`import sys


def solve(f, n, col, d1, d2):
    # cuantas formas hay de completar desde la fila f
    if f == n:
        ans = 1
    else:
        ans = 0
        for c in range(n):
            if not col[c] and not d1[f + c] and not d2[f - c + n]:
                col[c] = d1[f + c] = d2[f - c + n] = True
                ans += solve(f + 1, n, col, d1, d2)
                col[c] = d1[f + c] = d2[f - c + n] = False
    return ans


def main():
    n = int(sys.stdin.readline())
    print(solve(0, n, [False] * n, [False] * (2 * n), [False] * (2 * n)))


if __name__ == "__main__":
    main()` },
      { nombre: "Ramificación y poda (máximo)", codigo:
`import sys


def compatible(elegidos, i, conflictos):
    ans = True
    for e in elegidos:
        if (e, i) in conflictos:
            ans = False
    return ans


def solve(i, acumulado, valor, conflictos, elegidos, mejor):
    # mejor[0] = mayor valor encontrado hasta ahora
    cota = acumulado + sum(valor[i:])         # cota optimista
    if cota > mejor[0]:                       # poda: si no puede mejorar, no sigue
        if i == len(valor):
            mejor[0] = acumulado
        else:
            if compatible(elegidos, i, conflictos):
                elegidos.append(i)
                solve(i + 1, acumulado + valor[i], valor, conflictos, elegidos, mejor)
                elegidos.pop()
            solve(i + 1, acumulado, valor, conflictos, elegidos, mejor)


def main():
    n, m = map(int, sys.stdin.readline().split())
    valor = list(map(int, sys.stdin.readline().split()))
    conflictos = set()
    for _ in range(m):
        a, b = map(int, sys.stdin.readline().split())
        conflictos.add((a, b))
        conflictos.add((b, a))
    mejor = [0]
    solve(0, 0, valor, conflictos, [], mejor)
    print(mejor[0])


if __name__ == "__main__":
    main()` },
    ] },
    { tema: "dp", nombre: "Programación dinámica", items: [
      { esqueleto: true, nombre: "Esqueleto de la técnica: phi con mem", codigo:
`import sys


def phi(i, resto, datos, mem):
    # TODO: que significa phi(i, resto)? escribelo en una frase antes de seguir
    if (i, resto) in mem:
        ans = mem[(i, resto)]
    else:
        if i == len(datos):
            ans = 0  # TODO: caso base
        else:
            ans = phi(i + 1, resto, datos, mem)    # opcion 1 (por ejemplo, no tomar datos[i])
            # TODO: opcion 2 (por ejemplo, tomar datos[i]) y quedarse con la mejor
        mem[(i, resto)] = ans
    return ans


def main():
    n, total = map(int, sys.stdin.readline().split())
    datos = list(map(int, sys.stdin.readline().split()))
    print(phi(0, total, datos, dict()))


if __name__ == "__main__":
    main()` },
      { nombre: "Memoización con phi y mem (de arriba hacia abajo)", codigo:
`import sys


def phi(i, resto, pesos, valores, mem):
    # mejor valor usando los objetos i..n-1 con capacidad resto
    if (i, resto) in mem:
        ans = mem[(i, resto)]
    else:
        if i == len(pesos):
            ans = 0
        else:
            ans = phi(i + 1, resto, pesos, valores, mem)          # no tomo el objeto i
            if pesos[i] <= resto:                                 # tomo el objeto i
                ans = max(ans, valores[i] + phi(i + 1, resto - pesos[i], pesos, valores, mem))
        mem[(i, resto)] = ans
    return ans


def main():
    n, cap = map(int, sys.stdin.readline().split())
    pesos, valores = [], []
    for _ in range(n):
        p, v = map(int, sys.stdin.readline().split())
        pesos.append(p)
        valores.append(v)
    print(phi(0, cap, pesos, valores, dict()))


if __name__ == "__main__":
    main()` },
      { nombre: "Mochila 0/1 con tabla (de abajo hacia arriba)", codigo:
`import sys


def phi(pesos, valores, cap):
    # dp[c] = mejor valor con capacidad c usando los objetos vistos
    dp = [0] * (cap + 1)
    for k in range(len(pesos)):
        w, v = pesos[k], valores[k]
        for c in range(cap, w - 1, -1):    # de mayor a menor: cada objeto una sola vez
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[cap]


def main():
    n, cap = map(int, sys.stdin.readline().split())
    pesos, valores = [], []
    for _ in range(n):
        p, v = map(int, sys.stdin.readline().split())
        pesos.append(p)
        valores.append(v)
    print(phi(pesos, valores, cap))


if __name__ == "__main__":
    main()` },
      { nombre: "LIS en O(n log n)", codigo:
`import sys
from bisect import bisect_left


def lis(a):
    # colas[k] = menor final posible de una subsecuencia creciente de largo k + 1
    colas = []
    for x in a:
        k = bisect_left(colas, x)
        if k == len(colas):
            colas.append(x)
        else:
            colas[k] = x
    return len(colas)


def main():
    n = int(sys.stdin.readline())
    a = list(map(int, sys.stdin.readline().split()))
    print(lis(a))


if __name__ == "__main__":
    main()` },
      { nombre: "LCS (dos índices)", codigo:
`import sys


def phi(a, b):
    # dp[i][j] = LCS de a[:i] y b[:j]
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[len(a)][len(b)]


def main():
    a = sys.stdin.readline().strip()
    while a != "":
        b = sys.stdin.readline().strip()
        print(phi(a, b))
        a = sys.stdin.readline().strip()


if __name__ == "__main__":
    main()` },
      { nombre: "DP de intervalos (multiplicar matrices)", codigo:
`import sys


def phi(i, j, dims, mem):
    # costo minimo de multiplicar las matrices i..j (la matriz k mide dims[k] x dims[k+1])
    if (i, j) in mem:
        ans = mem[(i, j)]
    else:
        if i == j:
            ans = 0
        else:
            ans = float("inf")
            for k in range(i, j):             # k = donde se parte el intervalo
                costo = phi(i, k, dims, mem) + phi(k + 1, j, dims, mem) + dims[i] * dims[k + 1] * dims[j + 1]
                ans = min(ans, costo)
        mem[(i, j)] = ans
    return ans


def main():
    n = int(sys.stdin.readline())
    dims = list(map(int, sys.stdin.readline().split()))    # n + 1 numeros
    print(phi(0, n - 1, dims, dict()))


if __name__ == "__main__":
    main()` },
      { nombre: "DP con máscara de bits: TSP (phi y mem)", codigo:
`import sys


def phi(mask, j, d, todos, mem):
    # menor costo para visitar las ciudades que faltan (fuera de mask) desde j y volver a 0
    if (mask, j) in mem:
        ans = mem[(mask, j)]
    else:
        if mask == todos:
            ans = d[j][0]
        else:
            ans = float("inf")
            for k in range(len(d)):
                if not mask & (1 << k):
                    ans = min(ans, d[j][k] + phi(mask | (1 << k), k, d, todos, mem))
        mem[(mask, j)] = ans
    return ans


def main():
    n = int(sys.stdin.readline())
    d = []
    for _ in range(n):
        d.append(list(map(int, sys.stdin.readline().split())))
    todos = (1 << n) - 1
    print(phi(1, 0, d, todos, dict()))     # empiezo en la ciudad 0 (ya visitada)


if __name__ == "__main__":
    main()` },
      { nombre: "Subset sum (phi y mem)", codigo:
`import sys


def phi(i, resto, nums, mem):
    # se puede sumar exactamente resto usando nums[i..]?
    if (i, resto) in mem:
        ans = mem[(i, resto)]
    else:
        if resto == 0:
            ans = True
        elif i == len(nums) or resto < 0:
            ans = False
        else:
            ans = phi(i + 1, resto - nums[i], nums, mem) or phi(i + 1, resto, nums, mem)
        mem[(i, resto)] = ans
    return ans


def main():
    n, objetivo = map(int, sys.stdin.readline().split())
    nums = list(map(int, sys.stdin.readline().split()))
    if phi(0, objetivo, nums, dict()):
        print("SI")
    else:
        print("NO")


if __name__ == "__main__":
    main()` },
    ] },
    { tema: "voraz", nombre: "Algoritmos voraces", items: [
      { esqueleto: true, nombre: "Esqueleto de la técnica: ordenar y escoger", codigo:
`import sys


def solve(elementos):
    # TODO: criterio de orden (el que termina primero, el mas grande, el mas barato...)
    elementos.sort(key=lambda e: e[1])
    ans = 0
    ultimo = None
    for e in elementos:
        # TODO: si e es compatible con lo que ya escogi, tomarlo
        if ultimo is None or e[0] >= ultimo:
            ans += 1
            ultimo = e[1]
    return ans


def main():
    n = int(sys.stdin.readline())
    elementos = []
    for _ in range(n):
        a, b = map(int, sys.stdin.readline().split())
        elementos.append((a, b))
    print(solve(elementos))


if __name__ == "__main__":
    main()` },
      { nombre: "Selección de actividades (ordenar por fin)", codigo:
`import sys


def solve(intervalos):
    # voraz: siempre la actividad que termina primero
    ans, fin = 0, float("-inf")
    for ini, f in sorted(intervalos, key=lambda x: x[1]):
        if ini >= fin:
            ans += 1
            fin = f
    return ans


def main():
    n = int(sys.stdin.readline())
    intervalos = []
    for _ in range(n):
        ini, f = map(int, sys.stdin.readline().split())
        intervalos.append((ini, f))
    print(solve(intervalos))


if __name__ == "__main__":
    main()` },
      { nombre: "Cubrimiento de intervalos (sin break)", codigo:
`import sys


def solve(intervalos, L):
    # menor cantidad de intervalos para cubrir [0, L]; -1 si no se puede
    intervalos.sort()
    cubierto, ans, j, atascado = 0, 0, 0, False
    while cubierto < L and not atascado:
        mejor = cubierto
        while j < len(intervalos) and intervalos[j][0] <= cubierto:
            mejor = max(mejor, intervalos[j][1])    # voraz: el que llega mas lejos
            j += 1
        if mejor == cubierto:
            atascado = True
        else:
            ans += 1
            cubierto = mejor
    if atascado:
        ans = -1
    return ans


def main():
    n, L = map(int, sys.stdin.readline().split())
    intervalos = []
    for _ in range(n):
        a, b = map(int, sys.stdin.readline().split())
        intervalos.append((a, b))
    print(solve(intervalos, L))


if __name__ == "__main__":
    main()` },
      { nombre: "Kruskal con Union-Find", codigo:
`import sys


def raiz(padre, x):
    while padre[x] != x:
        padre[x] = padre[padre[x]]
        x = padre[x]
    return x


def solve(n, aristas):
    # costo del arbol de expansion minimo; None si el grafo no es conexo
    padre = list(range(n))
    ans, usadas = 0, 0
    for c, a, b in sorted(aristas):           # voraz: la arista mas barata que no forme ciclo
        ra, rb = raiz(padre, a), raiz(padre, b)
        if ra != rb:
            padre[ra] = rb
            ans += c
            usadas += 1
    if usadas != n - 1:
        ans = None
    return ans


def main():
    n, m = map(int, sys.stdin.readline().split())
    aristas = []
    for _ in range(m):
        a, b, c = map(int, sys.stdin.readline().split())
        aristas.append((c, a, b))
    print(solve(n, aristas))


if __name__ == "__main__":
    main()` },
      { nombre: "Dijkstra con heapq", codigo:
`import sys
import heapq


def dijkstra(ady, origen):
    # ady[u] = [(v, peso)]; dist[v] = menor distancia desde origen
    dist = [float("inf")] * len(ady)
    dist[origen] = 0
    pq = [(0, origen)]
    while pq:
        d, u = heapq.heappop(pq)
        if d == dist[u]:                      # ignora entradas viejas del monticulo
            for v, w in ady[u]:
                if d + w < dist[v]:
                    dist[v] = d + w
                    heapq.heappush(pq, (dist[v], v))
    return dist


def main():
    n, m = map(int, sys.stdin.readline().split())
    ady = [[] for _ in range(n)]
    for _ in range(m):
        a, b, w = map(int, sys.stdin.readline().split())
        ady[a].append((b, w))
        ady[b].append((a, w))
    dist = dijkstra(ady, 0)
    print(dist[n - 1])


if __name__ == "__main__":
    main()` },
    ] },
  ],
};
