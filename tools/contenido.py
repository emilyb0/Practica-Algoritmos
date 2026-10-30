"""Contenido de entrenamiento de cada problema de la Arena: pistas, esqueletos y casos de prueba.

Cada entrada de CONTENIDO tiene:
  pista1     -> que tecnica usar
  pista2     -> la idea clave
  esqueleto  -> codigo con TODOs (sin break)
  casos      -> funcion que devuelve [(nombre, entrada)]; la salida esperada se calcula
                corriendo problems/<id>/solucion.py
  limite     -> segundos por caso en el navegador (opcional)
  comparador -> "exacto" (por defecto) o "tolerancia:<eps>" para salidas con decimales
"""
import random

R = random.Random(2026)


def lineas(*xs):
    return "".join(str(x) + "\n" for x in xs)


# ---------------------------------------------------------------- generadores
def g_11332():
    return [("solo el terminador (0)", "0\n"),
            ("n = 1", "1\n0\n"),
            ("valores frontera 9, 10, 19, 99999", lineas(9, 10, 19, 99999, 0)),
            ("valor máximo", lineas(2000000000, 1999999999, 0))]


def g_13190():
    grande = [f"m{i} {R.randint(1, 3000)}" for i in range(3000)]
    return [("n = 1, k = 1", "1\n1 1\nUnica 5\n"),
            ("empates de tiempo (prioridad)", "1\n3 6\nC 2\nB 2\nA 1\n"),
            ("dos casos", "2\n1 2\nX 3\n2 3\nP 4\nQ 2\n"),
            ("máximo: n = 3000, k = 10000", "1\n3000 10000\n" + "\n".join(grande) + "\n")]


def g_12097():
    radios = " ".join(str(R.randint(1, 10000)) for _ in range(10000))
    return [("una torta, un amigo", "1\n1 1\n1\n"),
            ("muchos amigos, una torta", "1\n1 10000\n10000\n"),
            ("tortas iguales", "1\n4 3\n2 2 2 2\n"),
            ("máximo: N = F = 10000", f"1\n10000 10000\n{radios}\n")]


def g_11876():
    return [("T = 0 (sin casos)", "0\n"),
            ("rango de un solo punto", "3\n1 1\n3 3\n2 2\n"),
            ("máximo", "2\n1 1000000\n999999 1000000\n")]


def g_10606():
    return [("solo el terminador", "0\n"),
            ("valores pequeños", lineas(2, 3, 4, 15, 16, 17, 0)),
            ("máximo: 10^100", lineas(10 ** 100, 10 ** 100 - 1, 0))]


def g_10245():
    pts = "\n".join(f"{R.randint(0, 39999)} {R.randint(0, 39999)}" for _ in range(10000))
    return [("solo el terminador", "0\n"),
            ("N = 1", "1\n5 5\n0\n"),
            ("puntos repetidos", "3\n7 7\n7 7\n100 100\n0\n"),
            ("distancia exacta 10000 (INFINITY)", "2\n0 0\n0 10000\n0\n"),
            ("distancia 9999", "2\n0 0\n0 9999\n0\n"),
            ("grande: N = 10000", f"10000\n{pts}\n0\n")]


def g_1753():
    seg = "\n".join(f"{R.randint(1, 1000)} {R.randint(-1000, 1000)}" for _ in range(1000))
    return [("n = 1", "1 2\n10 3\n"),
            ("lecturas negativas", "2 3\n5 -4\n6 -2\n"),
            ("grande: n = 1000", f"1000 1000000\n{seg}\n")]


def g_11402():
    partes = [f"{R.randint(150, 200)}\n" + "".join(R.choice("01") for _ in range(50)) for _ in range(12)]
    n = 0
    for p in partes:
        t, s = p.split("\n")
        n += int(t) * len(s)
    qs = []
    for _ in range(1000):
        a = R.randrange(n)
        b = R.randrange(a, n)
        qs.append(f"{R.choice('FEIS')} {a} {b}")
    return [("N = 1", "1\n1\n1\n1\n3\nS 0 0\nI 0 0\nS 0 0\n"),
            ("invertir dos veces", "1\n1\n2\n0011\n4\nI 0 7\nS 0 7\nI 2 5\nS 0 7\n"),
            ("solo consultas", "1\n1\n3\n10\n2\nS 0 5\nS 1 1\n"),
            ("grande: N ~ 100000, Q = 1000", "1\n12\n" + "\n".join(partes) + "\n1000\n" + "\n".join(qs) + "\n")]


def g_10912():
    return [("solo el terminador", "0 0\n"),
            ("L > 26", "27 400\n0 0\n"),
            ("L = 1", "1 1\n1 26\n1 27\n0 0\n"),
            ("suma máxima posible", "26 351\n26 350\n0 0\n"),
            ("S grande", "3 9999\n0 0\n")]


def g_10259():
    g = "\n".join(" ".join(str(R.randint(0, 100)) for _ in range(60)) for _ in range(60))
    return [("n = 1", "1\n\n1 1\n7\n"),
            ("todos iguales (no hay saltos)", "1\n\n3 2\n5 5 5\n5 5 5\n5 5 5\n"),
            ("dos casos", "2\n\n2 1\n1 2\n3 4\n\n2 1\n4 3\n2 1\n"),
            ("grande: n = 60, k = 20", f"1\n\n60 20\n{g}\n")]


def g_12563():
    lar = " ".join(str(R.randint(1, 179)) for _ in range(50))
    return [("T = 0", "0\n"),
            ("t = 1 (solo cabe Jin Ge Jin Qu)", "1\n1 1\n50\n"),
            ("empate en cantidad", "1\n3 61\n20 30 40\n"),
            ("máximo: n = 50", f"1\n50 4000\n{lar}\n")]


def g_10069():
    return [("Z más largo que X", "1\nab\nabc\n"),
            ("una letra", "2\na\na\na\nb\n"),
            ("respuesta enorme", "1\n" + "a" * 10000 + "\n" + "a" * 100 + "\n")]


def g_1350():
    return [("K mínimo", "1\n3\n"),
            ("varios pequeños", "5\n4\n5\n6\n8\n13\n"),
            ("K máximo", "1\n89999999\n")]


def g_10688():
    return [("n = 1", "1\n1 0\n"),
            ("k grande", "2\n2 498\n3 497\n"),
            ("grande", "3\n100 400\n150 0\n120 30\n")]


def g_12834():
    n = 20000
    xs = " ".join(str(R.randint(0, 10 ** 8 - 1)) for _ in range(n))
    ys = " ".join(str(R.randint(0, 10 ** 8 - 1)) for _ in range(n))
    return [("N = 1 con perdida", "1\n1 0\n5\n3\n"),
            ("K = N", "1\n3 3\n5 5 5\n1 9 2\n"),
            ("todo en cero", "1\n2 1\n4 4\n4 4\n"),
            ("grande: N = 20000", f"1\n{n} 500\n{xs}\n{ys}\n")]


def g_11240():
    p = list(range(1, 20001))
    R.shuffle(p)
    return [("n = 1", "1\n1 1\n"),
            ("n = 2 creciente", "1\n2 1 2\n"),
            ("n = 2 decreciente", "1\n2 2 1\n"),
            ("grande: n = 20000", f"1\n20000 {' '.join(map(str, p))}\n")]


def g_1153():
    ped = "\n".join(f"{R.randint(1, 999)} {R.randint(1, 1999999)}" for _ in range(20000))
    return [("n = 1 imposible", "1\n\n1\n10 5\n"),
            ("n = 1 posible", "1\n\n1\n5 5\n"),
            ("dos casos (línea en blanco entre salidas)", "2\n\n2\n3 3\n3 6\n\n3\n5 5\n1 5\n1 5\n"),
            ("grande: n = 20000", f"1\n\n20000\n{ped}\n")]


def g_10382():
    asp = "\n".join(f"{R.randint(0, 100000)} {R.randint(1, 3000)}" for _ in range(10000))
    return [("entrada vacía", ""),
            ("radios que no alcanzan el ancho", "2 10 4\n2 2\n8 2\n"),
            ("un aspersor justo", "1 10 0\n5 5\n"),
            ("grande: n = 10000", f"10000 100000 100\n{asp}\n")]


def g_10462():
    e = []
    for v in range(2, 101):
        e.append(f"{R.randint(1, v - 1)} {v} {R.randint(1, 1000)}")
    for _ in range(101):
        a, b = R.sample(range(1, 101), 2)
        e.append(f"{a} {b} {R.randint(1, 1000)}")
    return [("v = 1, e = 0", "1\n1 0\n"),
            ("desconectado", "1\n3 1\n1 2 4\n"),
            ("aristas paralelas iguales", "1\n2 2\n1 2 7\n2 1 7\n"),
            ("grande: v = 100, e = 200", f"1\n100 200\n" + "\n".join(e) + "\n")]


def g_11890():
    expr, xs = "x", 1
    for _ in range(999):
        op = R.choice("+-")
        if R.random() < 0.3:
            expr = f"({expr}){op}x"
        else:
            expr = f"{expr}{op}x"
        xs += 1
    nums = " ".join(str(R.randint(-3000, 3000)) for _ in range(xs))
    return [("una sola x negativa", "1\nx\n1\n-5\n"),
            ("paréntesis anidados", "1\nx-(x-(x-x))\n4\n1 2 3 4\n"),
            ("todo negativo", "1\nx+x-x\n3\n-1 -2 -3\n"),
            ("grande: 1000 números", f"1\n{expr}\n{xs}\n{nums}\n")]


def g_10344():
    return [("solo el terminador", "0 0 0 0 0\n"),
            ("23 directo", "23 1 1 1 1\n0 0 0 0 0\n"),
            ("valores máximos", "50 50 50 50 50\n50 1 2 25 4\n0 0 0 0 0\n")]


def g_10576():
    return [("entrada vacía", ""),
            ("s = d", "1 1\n"),
            ("deficit seguro", "1000 1\n"),
            ("valores grandes", "10000000 10000000\n2 10000000\n")]


def g_10776():
    return [("entrada vacía", ""),
            ("r = largo", "cab 3\n"),
            ("todas iguales", "aaaa 2\n"),
            ("más grande", "abcdefghij 5\n")]


def g_208():
    k6 = "\n".join(f"{a} {b}" for a in range(1, 7) for b in range(a + 1, 7))
    return [("fuego inalcanzable", "3\n1 2\n0 0\n"),
            ("camino directo", "2\n1 2\n0 0\n"),
            ("grafo completo de 6", f"6\n{k6}\n0 0\n")]


def g_10624():
    return [("T = 0", "0\n"),
            ("restriccion solo al final", "1\n28 29\n"),
            ("varios", "4\n1 5\n2 12\n5 20\n10 25\n")]


def g_10001():
    largo = "".join(R.choice("01") for _ in range(32))
    return [("entrada vacía", ""),
            ("regla 0 con todo en cero", "0 4 0000\n"),
            ("regla 255", "255 6 111111\n"),
            ("N = 32", f"90 32 {largo}\n30 32 {largo}\n110 32 {largo}\n")]


def g_574():
    return [("solo el terminador", "0 0\n"),
            ("n = 1 que suma", "5 1 5\n0 0\n"),
            ("n = 1 que no suma", "5 1 3\n0 0\n"),
            ("doce iguales", "6 12 1 1 1 1 1 1 1 1 1 1 1 1\n0 0\n")]


def g_193():
    e = set()
    while len(e) < 45:
        a, b = sorted(R.sample(range(1, 31), 2))
        e.add((a, b))
    k5 = [(a, b) for a in range(1, 6) for b in range(a + 1, 6)]
    return [("sin aristas", "1\n4 0\n"),
            ("grafo completo de 5", "1\n5 10\n" + "\n".join(f"{a} {b}" for a, b in k5) + "\n"),
            ("n = 1", "1\n1 0\n"),
            ("mediano: n = 30", "1\n30 45\n" + "\n".join(f"{a} {b}" for a, b in sorted(e)) + "\n")]


def g_10496():
    bs = "\n".join(f"{R.randint(1, 20)} {R.randint(1, 20)}" for _ in range(10))
    return [("un beeper", "1\n5 5\n1 1\n1\n3 3\n"),
            ("beeper en el inicio", "1\n5 5\n2 2\n1\n2 2\n"),
            ("máximo: 10 beepers", f"1\n20 20\n10 10\n10\n{bs}\n")]


def g_11813():
    n, m = 2000, 6000
    ed = [f"{v} {R.randrange(v)} {R.randint(1, 1000)}" for v in range(1, n)]
    for _ in range(m - (n - 1)):
        a, b = R.sample(range(n), 2)
        ed.append(f"{a} {b} {R.randint(1, 1000)}")
    tiendas = R.sample(range(1, n), 10)
    return [("una tienda en la casa", "1\n1 0\n1\n0\n"),
            ("una tienda", "1\n2 1\n0 1 7\n1\n1\n"),
            ("grande: 10 tiendas", f"1\n{n} {m}\n" + "\n".join(ed) + "\n10\n" + "\n".join(map(str, tiendas)) + "\n")]


def g_11627():
    return [("una sola puerta", "1\n5 1 1\n3 3\n3\n10\n20\n5\n"),
            ("ninguno sirve", "1\n1 1 2\n1 1\n100 2\n2\n5\n6\n"),
            ("todos sirven", "1\n100 10 2\n1 1\n1 10\n3\n1\n2\n3\n")]


def g_12255():
    return [("T = 0", "0\n"),
            ("un guardia", "1\n\n0 1 1 10\n0 5\n"),
            ("guardia fuera de alcance", "1\n\n0 1 1 3\n0 5\n")]


def g_11658():
    return [("dueño mayoritario", "2 1\n60.00\n40.00\n0 0\n"),
            ("todos iguales", "4 3\n25.00\n25.00\n25.00\n25.00\n0 0\n"),
            ("redondeo", "3 1\n33.33\n33.33\n33.34\n0 0\n")]


def g_10404():
    return [("una piedra", "1 1 1\n"),
            ("no puede mover", "1 1 2\n"),
            ("varios", "10 2 2 3\n7 1 7\n100 3 3 5 7\n")]


def g_311():
    return [("solo el terminador", "0 0 0 0 0 0\n"),
            ("solo 1x1", "37 0 0 0 0 0\n"),
            ("solo 3x3", "0 0 5 0 0 0\n"),
            ("mezcla", "1 2 3 4 5 6\n0 0 0 0 0 0\n")]


def g_11567():
    return [("S = 0", "0\n"),
            ("pequeños", lineas(1, 2, 3, 4, 5, 6)),
            ("máximo", lineas(2 ** 31, 2 ** 31 - 1))]


def g_539():
    return [("una arista", "2 1\n0 1\n0 0\n"),
            ("ciclo", "3 3\n0 1\n1 2\n2 0\n0 0\n"),
            ("desconectado", "4 2\n0 1\n2 3\n0 0\n")]


def g_487():
    return [("N = 1 (sin palabras)", "1\n\n1\na\n"),
            ("N = 2", "1\n\n2\nab\ncd\n"),
            ("letras repetidas", "1\n\n3\naaa\naaa\naaa\n")]


def g_11795():
    return [("N = 1 imposible", "1\n1\n0\n1\n"),
            ("N = 1 posible", "1\n1\n1\n0\n"),
            ("todo destruible, N = 16", "1\n16\n" + "\n".join(["1" * 16] * 17) + "\n")]


# ---------------------------------------------------------------- contenido
LEER = '''import sys


def main():
    data = sys.stdin.read().split()
    i = 0
'''

CONTENIDO = {
    "uva-11332": dict(
        pista1="Repaso: ciclo con terminador (lectura hasta encontrar 0).",
        pista2="Repite 'sumar dígitos' mientras el número tenga dos o más dígitos. También existe la fórmula 1 + (n - 1) % 9.",
        esqueleto=LEER + '''    out = []
    while i < len(data) and data[i] != "0":
        n = int(data[i])
        # TODO: mientras n >= 10, reemplazar n por la suma de sus digitos
        out.append(str(n))
        i += 1
    print("\\n".join(out))


main()
''', casos=g_11332),
    "uva-13190": dict(
        pista1="Repaso: simulación con cola de prioridad (heapq).",
        pista2="Guarda tuplas (proximo_tiempo, prioridad, frecuencia, nombre). Sacas el menor, imprimes y lo reinsertas con tiempo + frecuencia.",
        esqueleto='''import sys
import heapq


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    out = []
    for _ in range(t):
        n, k = int(data[i]), int(data[i + 1]); i += 2
        heap = []
        for p in range(n):
            nombre, f = data[i], int(data[i + 1]); i += 2
            # TODO: agregar (primer tiempo, prioridad p, f, nombre)
        heapq.heapify(heap)
        for _ in range(k):
            # TODO: sacar el menor, agregar "tiempo nombre" a out y reinsertarlo
            pass
    print("\\n".join(out))


main()
''', casos=g_13190),
    "uva-12097": dict(
        pista1="Dividir y conquistar: bisección sobre la respuesta (el tamaño de la porción).",
        pista2="Para un tamaño V, cada torta da floor(area / V) porciones. Si la suma alcanza para F + 1 personas, V es factible: sube; si no, baja. 100 iteraciones bastan.",
        esqueleto=LEER + '''    t = int(data[i]); i += 1
    for _ in range(t):
        n, f = int(data[i]), int(data[i + 1]); i += 2
        areas = []  # TODO: pi * r^2 para cada radio
        i += n
        lo, hi = 0.0, max(areas)
        for _ in range(100):
            mid = (lo + hi) / 2
            # TODO: contar porciones de tamano mid y mover lo o hi
        print(f"{lo:.4f}")


main()
''', casos=g_12097, comparador="tolerancia:0.0002"),
    "uva-11876": dict(
        pista1="Dividir y conquistar: precálculo + búsqueda binaria (bisect).",
        pista2="La secuencia crece rápido: hasta 10^6 tiene ~64 000 términos. Genérala una vez (NOD con criba de menor factor primo) y responde cada [A, B] con bisect_right(B) - bisect_left(A).",
        esqueleto='''import sys
from bisect import bisect_left, bisect_right


def nod(x):
    # TODO: numero de divisores de x (factorizando)
    return 1


def main():
    data = sys.stdin.read().split()
    t = int(data[0]) if data else 0
    seq = [1]
    while seq[-1] <= 1000000:
        seq.append(seq[-1] + nod(seq[-1]))
    for c in range(1, t + 1):
        a, b = int(data[2 * c - 1]), int(data[2 * c])
        # TODO: contar con bisect
        print(f"Case {c}: {0}")


main()
''', casos=g_11876),
    "uva-10606": dict(
        pista1="Dividir y conquistar: búsqueda binaria de la raíz cuadrada entera.",
        pista2="Una puerta queda abierta si tiene un número impar de divisores: solo los cuadrados perfectos. La respuesta es floor(sqrt(N))^2; con N de 100 dígitos no uses floats.",
        esqueleto='''import sys


def raiz_entera(n):
    lo, hi = 0, 1
    while hi * hi <= n:
        hi *= 2
    # TODO: busqueda binaria del mayor r con r*r <= n
    return lo


def main():
    data = sys.stdin.read().split()
    i = 0
    while i < len(data) and data[i] != "0":
        r = raiz_entera(int(data[i]))
        print(r * r)
        i += 1


main()
''', casos=g_10606),
    "uva-10245": dict(
        pista1="Dividir y conquistar clásico: par de puntos más cercano.",
        pista2="Ordena por x, resuelve cada mitad, d = mínimo de ambas. Luego revisa solo la franja |x - x_medio| < d ordenada por y, comparando cada punto con los siguientes mientras dy < d.",
        esqueleto='''import sys


def cercanos(p):
    # p ordenado por x
    if len(p) <= 3:
        # TODO: fuerza bruta
        return float("inf")
    mid = len(p) // 2
    d = min(cercanos(p[:mid]), cercanos(p[mid:]))
    # TODO: franja central ordenada por y; usar while (dy < d) para recorrerla
    return d


def main():
    data = sys.stdin.read().split()
    i = 0
    n = int(data[i]) if data else 0
    while n != 0:
        i += 1
        pts = sorted((float(data[i + 2 * k]), float(data[i + 2 * k + 1])) for k in range(n))
        i += 2 * n
        d = cercanos(pts)
        print("INFINITY" if d >= 10000 else f"{d:.4f}")
        n = int(data[i]) if i < len(data) else 0


main()
''', casos=g_10245, comparador="tolerancia:0.0002"),
    "uva-1753": dict(
        pista1="Dividir y conquistar: bisección sobre c.",
        pista2="El tiempo total sum(d / (s + c)) disminuye cuando c aumenta. c debe cumplir s + c > 0 para todos: empieza en lo = -min(s). Si el tiempo con c es mayor que t, c debe crecer.",
        esqueleto='''import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    while i < len(data):
        n, t = int(data[i]), int(data[i + 1]); i += 2
        d = [int(x) for x in data[i:i + 2 * n:2]]
        s = [int(x) for x in data[i + 1:i + 2 * n:2]]
        i += 2 * n
        lo, hi = -min(s), 1e7
        for _ in range(200):
            c = (lo + hi) / 2
            # TODO: calcular el tiempo total con c y mover lo o hi
        print(f"{hi:.4f}")


main()
''', casos=g_1753, comparador="tolerancia:0.0002"),
    "uva-11402": dict(
        pista1="Dividir y conquistar: árbol de segmentos con propagación perezosa (lazy).",
        pista2="Cada nodo guarda cuántos 1 hay en su rango y una operación pendiente (poner 1, poner 0, invertir). Invertir sobre 'poner 1' da 'poner 0', e invertir dos veces se cancela.",
        esqueleto='''import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    casos = int(data[i]); i += 1
    for caso in range(1, casos + 1):
        m = int(data[i]); i += 1
        partes = []
        for _ in range(m):
            partes.append(data[i + 1] * int(data[i])); i += 2
        s = "".join(partes)
        # TODO: construir arboles suma[], largo[], lazy[] de tamano 2*tam
        q = int(data[i]); i += 1
        print(f"Case {caso}:")
        nq = 0
        for _ in range(q):
            op, a, b = data[i], int(data[i + 1]), int(data[i + 2]); i += 3
            if op == "S":
                nq += 1
                # TODO: consultar(a, b)
                print(f"Q{nq}: {0}")
            else:
                # TODO: actualizar(a, b, op) bajando lazy antes de recorrer hijos
                pass


main()
''', casos=g_11402, limite=20),
    "uva-10912": dict(
        pista1="Programación dinámica: contar subconjuntos (mochila 0/1 con conteo).",
        pista2="Una cadena estrictamente creciente es un subconjunto de letras. dp[l][s] = formas de elegir l letras que suman s. Si L > 26 o S > 351 la respuesta es 0.",
        esqueleto='''import sys

MAXS = 351


def main():
    dp = [[0] * (MAXS + 1) for _ in range(27)]
    dp[0][0] = 1
    for letra in range(1, 27):
        # TODO: recorrer l y s de mayor a menor y sumar dp[l-1][s-letra]
        pass
    data = sys.stdin.read().split()
    i, caso = 0, 1
    seguir = len(data) >= 2 and not (data[0] == "0" and data[1] == "0")
    while seguir:
        l, s = int(data[i]), int(data[i + 1])
        # TODO: respuesta (cuidado con l > 26 o s > 351)
        print(f"Case {caso}: {0}")
        caso += 1
        i += 2
        seguir = i + 1 < len(data) and not (data[i] == "0" and data[i + 1] == "0")


main()
''', casos=g_10912),
    "uva-10259": dict(
        pista1="Programación dinámica (camino más largo en un DAG) / memoizacion.",
        pista2="Los saltos van siempre a celdas con más monedas: no hay ciclos. mejor(celda) = monedas + max(mejor(destino)). Calcula de la celda con más monedas a la de menos para evitar recursión profunda.",
        esqueleto=LEER + '''    t = int(data[i]); i += 1
    salidas = []
    for _ in range(t):
        n, k = int(data[i]), int(data[i + 1]); i += 2
        g = [[int(data[i + r * n + c]) for c in range(n)] for r in range(n)]
        i += n * n
        mejor = [[0] * n for _ in range(n)]
        # TODO: recorrer celdas de mayor a menor valor y calcular mejor[r][c]
        salidas.append(str(mejor[0][0]))
    print("\\n\\n".join(salidas))


main()
''', casos=g_10259),
    "uva-12563": dict(
        pista1="Programación dinámica: mochila 0/1.",
        pista2="Debes dejar al menos 1 segundo para empezar Jin Ge Jin Qu: capacidad t - 1. dp[j] = máximo de canciones con suma exacta j. Gana más canciones y, a igualdad, más tiempo. Suma 1 canción y 678 s al final.",
        esqueleto=LEER + '''    t = int(data[i]) if data else 0
    i += 1
    for caso in range(1, t + 1):
        n, tiempo = int(data[i]), int(data[i + 1]); i += 2
        largos = [int(x) for x in data[i:i + n]]; i += n
        cap = min(tiempo - 1, sum(largos))
        dp = [-1] * (cap + 1)
        dp[0] = 0
        # TODO: mochila 0/1 (j de mayor a menor)
        # TODO: elegir el mejor (cantidad, tiempo)
        print(f"Case {caso}: {0} {0}")


main()
''', casos=g_12563),
    "uva-10069": dict(
        pista1="Programación dinámica: conteo de subsecuencias (estilo LCS).",
        pista2="dp[j] = formas de formar los primeros j caracteres de Z. Por cada caracter de X, recorre j de derecha a izquierda y si coincide con Z[j-1] suma dp[j-1].",
        esqueleto=LEER + '''    t = int(data[i]); i += 1
    for _ in range(t):
        x, z = data[i], data[i + 1]; i += 2
        dp = [1] + [0] * len(z)
        for c in x:
            # TODO: actualizar dp de derecha a izquierda
            pass
        print(dp[len(z)])


main()
''', casos=g_10069),
    "uva-1350": dict(
        pista1="Programación dinámica: conteo con recurrencia de Fibonacci.",
        pista2="Los pinarios con a lo sumo L dígitos cumplen cnt[L] = cnt[L-1] + cnt[L-2]. El K-esimo se arma desde el dígito más alto: si el peso cabe en K pones 1 y restas (eso nunca deja dos 1 seguidos).",
        esqueleto='''import sys


def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    pesos = [1, 2]
    # TODO: completar pesos con la recurrencia hasta superar 10^9
    for c in range(1, t + 1):
        k = int(data[c])
        digitos = []
        # TODO: desde el mayor peso <= k hacia abajo, poner "1" si cabe (y restar) o "0"
        print("".join(digitos))


main()
''', casos=g_1350),
    "uva-10688": dict(
        pista1="Programación dinámica sobre intervalos.",
        pista2="costo(i, j) = peso total comido sumando todos los casos posibles en i..j. Si comes la manzana m primero, todos los (j-i+1) casos la comen: costo = (j-i+1)*(k+m) + costo(i, m-1) + costo(m+1, j). Un intervalo de largo 1 cuesta 0.",
        esqueleto='''import sys


def main():
    data = sys.stdin.read().split()
    t = int(data[0])
    for caso in range(1, t + 1):
        n, k = int(data[2 * caso - 1]), int(data[2 * caso])
        costo = [[0] * (n + 2) for _ in range(n + 2)]
        for largo in range(2, n + 1):
            for i in range(1, n - largo + 2):
                j = i + largo - 1
                # TODO: probar cada m en i..j y quedarse con el minimo
        print(f"Case {caso}: {costo[1][n]}")


main()
''', casos=g_10688, limite=20),
    "uva-12834": dict(
        pista1="Voraz: ordenar y descartar lo peor.",
        pista2="Ganancia de cada negocio = Y - X. Ordena y descarta a lo sumo K, solo los negativos, del más negativo al menos. Si el total <= 0 imprime No Profit.",
        esqueleto=LEER + '''    t = int(data[i]); i += 1
    for caso in range(1, t + 1):
        n, k = int(data[i]), int(data[i + 1]); i += 2
        x = data[i:i + n]; i += n
        y = data[i:i + n]; i += n
        ganancias = sorted(int(b) - int(a) for a, b in zip(x, y))
        # TODO: avanzar un indice j mientras j < k y ganancias[j] < 0
        total = 0
        print(f"Case {caso}: {total}" if total > 0 else f"Case {caso}: No Profit")


main()
''', casos=g_12834),
    "uva-11240": dict(
        pista1="Voraz: recorrido único tomando extremos locales.",
        pista2="Primero buscas bajar, luego subir, alternando. Si el nuevo valor no te sirve, igual reemplaza al actual: un valor más alto es mejor punto de partida para bajar (y uno más bajo para subir).",
        esqueleto=LEER + '''    t = int(data[i]); i += 1
    for _ in range(t):
        n = int(data[i]); i += 1
        seq = [int(v) for v in data[i:i + n]]; i += n
        actual, largo, bajar = seq[0], 1, True
        for v in seq[1:]:
            # TODO: si v avanza en la direccion buscada, largo += 1 y cambias direccion
            actual = v
        print(largo)


main()
''', casos=g_11240),
    "uva-1153": dict(
        pista1="Voraz con montículo (heapq): planificación con fechas limite.",
        pista2="Ordena por fecha limite. Acepta cada pedido; si el tiempo acumulado supera su fecha, quita el pedido más largo aceptado hasta ahora (montículo de máximos con valores negativos).",
        esqueleto='''import sys
import heapq


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    salidas = []
    for _ in range(t):
        n = int(data[i]); i += 1
        pedidos = sorted((int(data[i + 2 * j + 1]), int(data[i + 2 * j])) for j in range(n))
        i += 2 * n
        aceptados, tiempo = [], 0
        for fecha, q in pedidos:
            # TODO: aceptar y, si tiempo > fecha, quitar el mas largo
            pass
        salidas.append(str(len(aceptados)))
    print("\\n\\n".join(salidas))


main()
''', casos=g_1153),
    "uva-10382": dict(
        pista1="Voraz: cubrimiento de intervalos.",
        pista2="Un aspersor con r <= w/2 no sirve. Si sirve, cubre [x - dx, x + dx] con dx = sqrt(r^2 - (w/2)^2). Ordena por inicio y en cada paso toma, entre los que empiezan antes del punto cubierto, el que más lejos llegue.",
        esqueleto='''import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    while i < len(data):
        n, l, w = int(data[i]), int(data[i + 1]), int(data[i + 2]); i += 3
        intervalos = []
        for _ in range(n):
            x, r = int(data[i]), int(data[i + 1]); i += 2
            # TODO: si sirve, agregar (x - dx, x + dx)
        intervalos.sort()
        cubierto, usados, j, atascado = 0.0, 0, 0, False
        while cubierto < l and not atascado:
            # TODO: avanzar j entre los intervalos que empiezan <= cubierto, guardar el mayor fin
            atascado = True
        print(-1 if atascado else usados)


main()
''', casos=g_10382),
    "uva-10462": dict(
        pista1="Voraz: árbol de expansión mínimo (Kruskal + Union-Find).",
        pista2="Calcula el MST. Para el segundo mejor, prohibe una a la vez cada arista del MST y vuelve a correr Kruskal; el mínimo de esos costos (si alguno conecta) es la respuesta.",
        esqueleto='''import sys


def kruskal(v, aristas, prohibida):
    padre = list(range(v + 1))

    def raiz(a):
        while padre[a] != a:
            a = padre[a]
        return a

    costo, usadas = 0, []
    # TODO: recorrer aristas ordenadas (saltando 'prohibida') y unir componentes
    return (costo, usadas) if len(usadas) == v - 1 else (None, usadas)


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for caso in range(1, t + 1):
        v, e = int(data[i]), int(data[i + 1]); i += 2
        aristas = sorted((int(data[i + 3 * j + 2]), int(data[i + 3 * j]), int(data[i + 3 * j + 1])) for j in range(e))
        i += 3 * e
        # TODO: "No way", "No second way" o el segundo costo
        print(f"Case #{caso} : ")


main()
''', casos=g_10462),
    "uva-11890": dict(
        pista1="Voraz: asignar los números grandes a las posiciones con signo +.",
        pista2="Quitando paréntesis, cada x termina con signo + o -. Calcula ese signo con una pila (un '-' antes de '(' invierte todo el grupo). Cuenta P posiciones '+': los P números mayores suman y el resto resta.",
        esqueleto=LEER + '''    t = int(data[i]); i += 1
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
''', casos=g_11890),
    "uva-10344": dict(
        pista1="Backtracking: permutaciones + operaciones.",
        pista2="Escoge el primer número, luego en cada nivel un número no usado y una operación (+, -, *) aplicada al acumulado. Devuelve True apenas llegues a 23 con los 5 usados; usa la condición del while para cortar.",
        esqueleto='''import sys


def posible(nums):
    usados = [False] * 5

    def bt(cuantos, valor):
        if cuantos == 5:
            return valor == 23
        ok, j = False, 0
        while not ok and j < 5:
            # TODO: si nums[j] no esta usado, probar +, - y *
            j += 1
        return ok

    # TODO: probar cada numero como primero
    return False


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    while i + 4 < len(data) and any(data[i:i + 5]):
        print("Possible" if posible(data[i:i + 5]) else "Impossible")
        i += 5


main()
''', casos=g_10344),
    "uva-10576": dict(
        pista1="Backtracking con poda (12 decisiones binarias).",
        pista2="Cada mes es +s o -d. Poda en cuanto los últimos 5 meses sumen >= 0. Al llegar a 12 meses guarda el mejor total; si el mejor es negativo (o no hay) imprime Deficit.",
        esqueleto='''import sys


def mejor_total(s, d):
    mejor = None
    meses = []

    def bt():
        nonlocal mejor
        if len(meses) == 12:
            # TODO: actualizar mejor
            pass
        else:
            for v in (s, -d):
                meses.append(v)
                # TODO: seguir solo si la ventana de 5 meses es negativa
                meses.pop()

    bt()
    return mejor


def main():
    data = sys.stdin.read().split()
    for i in range(0, len(data) - 1, 2):
        m = mejor_total(int(data[i]), int(data[i + 1]))
        print("Deficit" if m is None or m < 0 else m)


main()
''', casos=g_10576),
    "uva-10776": dict(
        pista1="Backtracking: generar combinaciones sin repetidos.",
        pista2="Ordena las letras. En cada nivel recorre desde 'desde'; si la letra es igual a la anterior del mismo nivel, saltala (así no repites combinaciones).",
        esqueleto='''import sys


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
''', casos=g_10776),
    "uva-208": dict(
        pista1="Backtracking (DFS de caminos simples) con poda por alcanzabilidad.",
        pista2="Sin poda se demora: primero haz BFS desde el fuego para marcar las esquinas que pueden llegar a el y solo entra a esas. Ordena las listas de adyacencia para imprimir en orden.",
        esqueleto='''import sys
from collections import deque


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i, caso = 0, 1
    while i < len(data):
        destino = data[i]; i += 1
        ady = [set() for _ in range(21)]
        while data[i] != 0 or data[i + 1] != 0:
            ady[data[i]].add(data[i + 1])
            ady[data[i + 1]].add(data[i])
            i += 2
        i += 2
        ady = [sorted(v) for v in ady]
        alcanza = [False] * 21
        # TODO: BFS desde destino
        rutas, camino, visitado = [], [1], [False] * 21
        visitado[1] = True

        def bt(u):
            # TODO: si u == destino guardar camino; si no, probar vecinos validos
            pass

        bt(1)
        print(f"CASE {caso}:")
        for r in rutas:
            print(r)
        print(f"There are {len(rutas)} routes from the firestation to streetcorner {destino}.")
        caso += 1


main()
''', casos=g_208),
    "uva-10624": dict(
        pista1="Backtracking dígito a dígito con poda por divisibilidad.",
        pista2="Lleva el prefijo como entero. Al poner el dígito i (1-indexado), si i >= n el prefijo debe ser divisible por i; si no, poda. Prueba dígitos de 0 a 9 (el primero desde 1) y el primero que llegue a m dígitos es el menor.",
        esqueleto='''import sys


def super_numero(n, m):
    digitos = []

    def bt(prefijo):
        largo = len(digitos)
        if largo == m:
            return True
        ok = False
        d = 1 if largo == 0 else 0
        while not ok and d <= 9:
            # TODO: si el nuevo prefijo cumple, agregar d, recursion y quitar si fallo
            d += 1
        return ok

    return "".join(digitos) if bt(0) else "-1"


def main():
    data = sys.stdin.read().split()
    t = int(data[0]) if data else 0
    for c in range(1, t + 1):
        print(f"Case {c}: {super_numero(int(data[2 * c - 1]), int(data[2 * c]))}")


main()
''', casos=g_10624),
    "uva-10001": dict(
        pista1="Backtracking: reconstruir el estado anterior bit a bit.",
        pista2="El nuevo valor de la celda i depende de (p[i-1], p[i], p[i+1]). Fija p[0] y p[1], y cada bit siguiente se valida contra la celda anterior. Al final verifica las dos celdas que cierran el circulo.",
        esqueleto='''import sys


def alcanzable(regla, n, estado):
    objetivo = [int(c) for c in estado]
    sale = [(regla >> v) & 1 for v in range(8)]
    p = [0] * n

    def bt(i):
        if i == n - 1:
            # TODO: verificar celdas n-1 y 0 (dan la vuelta)
            return False
        ok, b = False, 0
        while not ok and b <= 1:
            p[i + 1] = b
            # TODO: si i >= 1, la celda i debe dar objetivo[i]
            b += 1
        return ok

    # TODO: probar p[0] = 0 y p[0] = 1
    return False


def main():
    data = sys.stdin.read().split()
    for i in range(0, len(data) - 2, 3):
        r, n, s = int(data[i]), int(data[i + 1]), data[i + 2]
        print("REACHABLE" if alcanzable(r, n, s) else "GARDEN OF EDEN")


main()
''', casos=g_10001),
    "uva-574": dict(
        pista1="NP-completo con entrada pequeña (subset sum): backtracking.",
        pista2="Los números ya vienen en orden no creciente. En cada nivel recorre desde 'desde' y salta un número si es igual al anterior del mismo nivel: así no repites sumas y salen en el orden pedido.",
        esqueleto='''import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    while i + 1 < len(data) and data[i + 1] != 0:
        t, n = data[i], data[i + 1]
        nums = data[i + 2:i + 2 + n]
        i += 2 + n
        print(f"Sums of {t}:")
        sumas, actual = [], []

        def bt(desde, resto):
            # TODO: si resto == 0 guardar "+".join; si no, probar nums[j] sin repetir en el nivel
            pass

        bt(0, t)
        print("\\n".join(sumas) if sumas else "NONE")


main()
''', casos=g_574),
    "uva-193": dict(
        pista1="NP-completo (conjunto independiente máximo): backtracking con poda.",
        pista2="Decide los nodos en orden 1..n: primero intenta pintarlo negro (si ningún vecino lo es) y luego blanco. Poda si negros + nodos restantes <= mejor. Solo actualiza con un tamaño estrictamente mayor: así te quedas con la lexicográficamente menor.",
        esqueleto='''import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    m = data[i]; i += 1
    for _ in range(m):
        n, k = data[i], data[i + 1]; i += 2
        ady = [set() for _ in range(n + 1)]
        for _ in range(k):
            a, b = data[i], data[i + 1]; i += 2
            ady[a].add(b)
            ady[b].add(a)
        negro = [False] * (n + 1)
        mejor, actual = [], []

        def bt(v):
            nonlocal mejor
            # TODO: poda; si v > n actualizar mejor; si no, probar negro y luego blanco
            pass

        bt(1)
        print(len(mejor))
        print(" ".join(map(str, mejor)))


main()
''', casos=g_193),
    "uva-10496": dict(
        pista1="NP-completo con entrada pequeña (TSP): DP sobre máscaras de bits.",
        pista2="Con a lo sumo 10 beepers: dp[máscara][último] = menor distancia Manhattan que visita 'máscara' y termina en 'último'. Respuesta: min(dp[todas][j] + distancia de j al inicio).",
        esqueleto='''import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    t = data[i]; i += 1
    for _ in range(t):
        i += 2
        sx, sy = data[i], data[i + 1]; i += 2
        b = data[i]; i += 1
        pts = [(sx, sy)] + [(data[i + 2 * k], data[i + 2 * k + 1]) for k in range(b)]
        i += 2 * b
        INF = float("inf")
        dp = [[INF] * b for _ in range(1 << b)]
        # TODO: casos base, transiciones y respuesta
        print(f"The shortest path has length {0}")


main()
''', casos=g_10496),
    "uva-11813": dict(
        pista1="NP-completo (TSP) + caminos minimos: Dijkstra + DP de máscaras.",
        pista2="El grafo es grande pero hay a lo sumo 10 tiendas: corre Dijkstra desde la casa y desde cada tienda para tener la matriz de distancias entre puntos clave. Luego TSP con dp[máscara][última].",
        esqueleto='''import sys
import heapq


def dijkstra(ady, n, origen):
    dist = [float("inf")] * n
    dist[origen] = 0
    pq = [(0, origen)]
    # TODO: Dijkstra con heapq
    return dist


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for _ in range(t):
        n, m = int(data[i]), int(data[i + 1]); i += 2
        ady = [[] for _ in range(n)]
        for _ in range(m):
            x, y, d = int(data[i]), int(data[i + 1]), int(data[i + 2]); i += 3
            ady[x].append((y, d))
            ady[y].append((x, d))
        s = int(data[i]); i += 1
        puntos = [0] + [int(x) for x in data[i:i + s]]; i += s
        # TODO: matriz de distancias entre puntos y TSP con mascaras
        print(0)


main()
''', casos=g_11813, limite=20),
    "uva-11627": dict(
        pista1="Dividir y conquistar: búsqueda binaria sobre los esquis ordenados.",
        pista2="Más lento siempre es más fácil. Para una velocidad s, propaga el intervalo de x alcanzable puerta a puerta (se ensancha vh*dy/s y se recorta a la puerta). Multiplica todo por s para usar enteros.",
        esqueleto='''import sys


def posible(s, w, vh, puertas):
    # TODO: propagar [lo, hi] puerta a puerta (escalado por s)
    return True


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for _ in range(t):
        w, vh, n = int(data[i]), int(data[i + 1]), int(data[i + 2]); i += 3
        puertas = [(int(data[i + 2 * k]), int(data[i + 2 * k + 1])) for k in range(n)]
        i += 2 * n
        ns = int(data[i]); i += 1
        esquis = sorted(int(x) for x in data[i:i + ns]); i += ns
        # TODO: busqueda binaria del mayor indice factible
        print("IMPOSSIBLE")


main()
''', casos=g_11627),
    "uva-12255": dict(
        pista1="Dividir y conquistar: búsqueda binaria sobre M + verificación voraz.",
        pista2="Pon todos los francotiradores a profundidad M. Cada guardia define un intervalo de x enteros desde donde se le alcanza (radio sqrt(D^2 - h^2), h = y - k + M). Cuenta puntos minimos para cubrir intervalos ordenando por el extremo derecho.",
        esqueleto='''import sys
from math import isqrt


def necesarios(m, k, d, guardias):
    # TODO: intervalos por guardia y conteo voraz de puntos
    return 0


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]) if data else 0
    i += 1
    for caso in range(1, t + 1):
        k, n, s, d = (int(x) for x in data[i:i + 4]); i += 4
        guardias = [(int(data[i + 2 * j]), int(data[i + 2 * j + 1])) for j in range(n)]
        i += 2 * n
        # TODO: IMPOSSIBLE si con M = 1 no alcanza; si no, busqueda binaria de M
        print(f"Case {caso}: ")


main()
''', casos=g_12255),
    "uva-11658": dict(
        pista1="Programación dinámica: mochila de sumas alcanzables.",
        pista2="Pasa los porcentajes a enteros (x100). Si x tiene más de 5000 gana todo. Si no, busca la menor suma de otros accionistas que con x supere 5000; la respuesta es p_x / total * 100 redondeada.",
        esqueleto='''import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    n, x = int(data[0]), int(data[1])
    while n != 0:
        i += 2
        p = [int(round(float(v) * 100)) for v in data[i:i + n]]
        i += n
        # TODO: mochila de sumas alcanzables sin el accionista x
        print("0.00")
        n, x = (int(data[i]), int(data[i + 1])) if i + 1 < len(data) else (0, 0)


main()
''', casos=g_11658),
    "uva-10404": dict(
        pista1="Programación dinámica: posiciones ganadoras y perdedoras.",
        pista2="gana[s] es cierto si existe una jugada m <= s con gana[s - m] falso. Calcula la tabla una sola vez hasta el mayor n de cada conjunto de jugadas: n llega a 10^6.",
        esqueleto='''import sys


def main():
    for linea in sys.stdin.read().split("\\n"):
        l = linea.split()
        if l:
            n, m = int(l[0]), int(l[1])
            jugadas = [int(x) for x in l[2:2 + m]]
            gana = bytearray(n + 1)
            # TODO: llenar gana[1..n]
            print("Stan wins" if gana[n] else "Ollie wins")


main()
''', casos=g_10404, limite=30),
    "uva-311": dict(
        pista1="Voraz por casos: empacar primero lo grande.",
        pista2="6x6, 5x5 y 4x4 usan una caja cada uno; los 3x3 van de a 4. Después cuenta huecos para 2x2 (5 por cada 4x4 y 5/3/1 según los 3x3 sobrantes) y, al final, el espacio libre total para los 1x1.",
        esqueleto='''import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    while i + 5 < len(data) and any(data[i:i + 6]):
        a, b, c, d, e, f = data[i:i + 6]
        i += 6
        cajas = f + e + d + (c + 3) // 4
        # TODO: huecos de 2x2 y de 1x1
        print(cajas)


main()
''', casos=g_311),
    "uva-11567": dict(
        pista1="Voraz: pensar hacia atrás en binario.",
        pista2="De S hacia 0: si es par, divide. Si es impar, elige +1 o -1 según cuál deje más ceros al final (S % 4 == 3 -> +1), con la excepción S = 3 (mejor -1).",
        esqueleto='''import sys


def operaciones(s):
    ops = 0
    while s > 0:
        # TODO: decision voraz
        s -= 1
        ops += 1
    return ops


def main():
    for x in sys.stdin.read().split():
        print(operaciones(int(x)))


main()
''', casos=g_11567),
    "uva-539": dict(
        pista1="Backtracking: DFS marcando aristas (no nodos).",
        pista2="El camino puede repetir nodos pero no aristas. Desde cada nodo inicial, marca la arista al usarla y desmarcala al volver; guarda el largo máximo.",
        esqueleto='''import sys


def main():
    data = [int(x) for x in sys.stdin.read().split()]
    i = 0
    while i + 1 < len(data) and (data[i] != 0 or data[i + 1] != 0):
        n, m = data[i], data[i + 1]; i += 2
        ady = [[] for _ in range(n)]
        for e in range(m):
            a, b = data[i], data[i + 1]; i += 2
            ady[a].append((b, e))
            ady[b].append((a, e))
        usada = [False] * m
        mejor = 0
        # TODO: bt(u, largo) desde cada nodo
        print(mejor)


main()
''', casos=g_539),
    "uva-487": dict(
        pista1="Backtracking: DFS por letras estrictamente crecientes.",
        pista2="Como las letras deben crecer, nunca vuelves a una celda: no hace falta marcar visitados. Guarda en un set las palabras de largo >= 3 y ordena por (largo, palabra). Linea en blanco entre casos.",
        esqueleto='''import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    bloques = []
    for _ in range(t):
        n = int(data[i]); i += 1
        g = data[i:i + n]; i += n
        palabras, actual = set(), []
        # TODO: bt(r, c) a las 8 vecinas con letra mayor
        bloques.append("".join(p + "\\n" for p in sorted(palabras, key=lambda p: (len(p), p))))
    sys.stdout.write("\\n".join(bloques))


main()
''', casos=g_487),
    "uva-11795": dict(
        pista1="NP-completo con N <= 16: DP sobre máscaras de bits.",
        pista2="dp[máscara] = formas de destruir exactamente esos robots. Las armas disponibles dependen solo de la máscara (Mega Buster OR armas de los destruidos). Desde una máscara puedes destruir cualquier robot vivo que alguna arma alcance.",
        esqueleto='''import sys


def main():
    data = sys.stdin.read().split()
    i = 0
    t = int(data[i]); i += 1
    for caso in range(1, t + 1):
        n = int(data[i]); i += 1
        filas = [int(data[i + r][::-1], 2) for r in range(n + 1)]; i += n + 1
        total = 1 << n
        dp = [0] * total
        dp[0] = 1
        # TODO: armas por mascara y transiciones
        print(f"Case {caso}: {dp[total - 1]}")


main()
''', casos=g_11795),
}
