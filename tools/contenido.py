"""Contenido de entrenamiento de cada problema de la Arena: pistas y casos de prueba.
Los esqueletos (pista 3) estan en problems/<id>/esqueleto.py.

Cada entrada de CONTENIDO tiene:
  pista1     -> que tecnica usar
  pista2     -> la idea clave
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
CONTENIDO = {
    "uva-11332": dict(
        pista1="Repaso: ciclo con terminador (lectura hasta encontrar 0).",
        pista2="Repite 'sumar dígitos' mientras el número tenga dos o más dígitos. También existe la fórmula 1 + (n - 1) % 9.", casos=g_11332),
    "uva-13190": dict(
        pista1="Repaso: simulación con cola de prioridad (heapq).",
        pista2="Guarda tuplas (proximo_tiempo, prioridad, frecuencia, nombre). Sacas el menor, imprimes y lo reinsertas con tiempo + frecuencia.", casos=g_13190),
    "uva-12097": dict(
        pista1="Dividir y conquistar: bisección sobre la respuesta (el tamaño de la porción).",
        pista2="Para un tamaño V, cada torta da floor(area / V) porciones. Si la suma alcanza para F + 1 personas, V es factible: sube; si no, baja. 100 iteraciones bastan.", casos=g_12097, comparador="tolerancia:0.0002"),
    "uva-11876": dict(
        pista1="Dividir y conquistar: precálculo + búsqueda binaria (bisect).",
        pista2="La secuencia crece rápido: hasta 10^6 tiene ~64 000 términos. Genérala una vez (NOD con criba de menor factor primo) y responde cada [A, B] con bisect_right(B) - bisect_left(A).", casos=g_11876),
    "uva-10606": dict(
        pista1="Dividir y conquistar: búsqueda binaria de la raíz cuadrada entera.",
        pista2="Una puerta queda abierta si tiene un número impar de divisores: solo los cuadrados perfectos. La respuesta es floor(sqrt(N))^2; con N de 100 dígitos no uses floats.", casos=g_10606),
    "uva-10245": dict(
        pista1="Dividir y conquistar clásico: par de puntos más cercano.",
        pista2="Ordena por x, resuelve cada mitad, d = mínimo de ambas. Luego revisa solo la franja |x - x_medio| < d ordenada por y, comparando cada punto con los siguientes mientras dy < d.", casos=g_10245, comparador="tolerancia:0.0002"),
    "uva-1753": dict(
        pista1="Dividir y conquistar: bisección sobre c.",
        pista2="El tiempo total sum(d / (s + c)) disminuye cuando c aumenta. c debe cumplir s + c > 0 para todos: empieza en lo = -min(s). Si el tiempo con c es mayor que t, c debe crecer.", casos=g_1753, comparador="tolerancia:0.0002"),
    "uva-11402": dict(
        pista1="Dividir y conquistar: árbol de segmentos con propagación perezosa (lazy).",
        pista2="Cada nodo guarda cuántos 1 hay en su rango y una operación pendiente (poner 1, poner 0, invertir). Invertir sobre 'poner 1' da 'poner 0', e invertir dos veces se cancela.", casos=g_11402, limite=20),
    "uva-10912": dict(
        pista1="Programación dinámica: contar subconjuntos (mochila 0/1 con conteo).",
        pista2="Una cadena estrictamente creciente es un subconjunto de letras. dp[l][s] = formas de elegir l letras que suman s. Si L > 26 o S > 351 la respuesta es 0.", casos=g_10912),
    "uva-10259": dict(
        pista1="Programación dinámica (camino más largo en un DAG) / memoizacion.",
        pista2="Los saltos van siempre a celdas con más monedas: no hay ciclos. mejor(celda) = monedas + max(mejor(destino)). Calcula de la celda con más monedas a la de menos para evitar recursión profunda.", casos=g_10259),
    "uva-12563": dict(
        pista1="Programación dinámica: mochila 0/1.",
        pista2="Debes dejar al menos 1 segundo para empezar Jin Ge Jin Qu: capacidad t - 1. dp[j] = máximo de canciones con suma exacta j. Gana más canciones y, a igualdad, más tiempo. Suma 1 canción y 678 s al final.", casos=g_12563),
    "uva-10069": dict(
        pista1="Programación dinámica: conteo de subsecuencias (estilo LCS).",
        pista2="dp[j] = formas de formar los primeros j caracteres de Z. Por cada caracter de X, recorre j de derecha a izquierda y si coincide con Z[j-1] suma dp[j-1].", casos=g_10069),
    "uva-1350": dict(
        pista1="Programación dinámica: conteo con recurrencia de Fibonacci.",
        pista2="Los pinarios con a lo sumo L dígitos cumplen cnt[L] = cnt[L-1] + cnt[L-2]. El K-esimo se arma desde el dígito más alto: si el peso cabe en K pones 1 y restas (eso nunca deja dos 1 seguidos).", casos=g_1350),
    "uva-10688": dict(
        pista1="Programación dinámica sobre intervalos.",
        pista2="costo(i, j) = peso total comido sumando todos los casos posibles en i..j. Si comes la manzana m primero, todos los (j-i+1) casos la comen: costo = (j-i+1)*(k+m) + costo(i, m-1) + costo(m+1, j). Un intervalo de largo 1 cuesta 0.", casos=g_10688, limite=20),
    "uva-12834": dict(
        pista1="Voraz: ordenar y descartar lo peor.",
        pista2="Ganancia de cada negocio = Y - X. Ordena y descarta a lo sumo K, solo los negativos, del más negativo al menos. Si el total <= 0 imprime No Profit.", casos=g_12834),
    "uva-11240": dict(
        pista1="Voraz: recorrido único tomando extremos locales.",
        pista2="Primero buscas bajar, luego subir, alternando. Si el nuevo valor no te sirve, igual reemplaza al actual: un valor más alto es mejor punto de partida para bajar (y uno más bajo para subir).", casos=g_11240),
    "uva-1153": dict(
        pista1="Voraz con montículo (heapq): planificación con fechas limite.",
        pista2="Ordena por fecha limite. Acepta cada pedido; si el tiempo acumulado supera su fecha, quita el pedido más largo aceptado hasta ahora (montículo de máximos con valores negativos).", casos=g_1153),
    "uva-10382": dict(
        pista1="Voraz: cubrimiento de intervalos.",
        pista2="Un aspersor con r <= w/2 no sirve. Si sirve, cubre [x - dx, x + dx] con dx = sqrt(r^2 - (w/2)^2). Ordena por inicio y en cada paso toma, entre los que empiezan antes del punto cubierto, el que más lejos llegue.", casos=g_10382),
    "uva-10462": dict(
        pista1="Voraz: árbol de expansión mínimo (Kruskal + Union-Find).",
        pista2="Calcula el MST. Para el segundo mejor, prohibe una a la vez cada arista del MST y vuelve a correr Kruskal; el mínimo de esos costos (si alguno conecta) es la respuesta.", casos=g_10462),
    "uva-11890": dict(
        pista1="Voraz: asignar los números grandes a las posiciones con signo +.",
        pista2="Quitando paréntesis, cada x termina con signo + o -. Calcula ese signo con una pila (un '-' antes de '(' invierte todo el grupo). Cuenta P posiciones '+': los P números mayores suman y el resto resta.", casos=g_11890),
    "uva-10344": dict(
        pista1="Backtracking: permutaciones + operaciones.",
        pista2="Escoge el primer número, luego en cada nivel un número no usado y una operación (+, -, *) aplicada al acumulado. Devuelve True apenas llegues a 23 con los 5 usados; usa la condición del while para cortar.", casos=g_10344),
    "uva-10576": dict(
        pista1="Backtracking con poda (12 decisiones binarias).",
        pista2="Cada mes es +s o -d. Poda en cuanto los últimos 5 meses sumen >= 0. Al llegar a 12 meses guarda el mejor total; si el mejor es negativo (o no hay) imprime Deficit.", casos=g_10576),
    "uva-10776": dict(
        pista1="Backtracking: generar combinaciones sin repetidos.",
        pista2="Ordena las letras. En cada nivel recorre desde 'desde'; si la letra es igual a la anterior del mismo nivel, saltala (así no repites combinaciones).", casos=g_10776),
    "uva-208": dict(
        pista1="Backtracking (DFS de caminos simples) con poda por alcanzabilidad.",
        pista2="Sin poda se demora: primero haz BFS desde el fuego para marcar las esquinas que pueden llegar a el y solo entra a esas. Ordena las listas de adyacencia para imprimir en orden.", casos=g_208),
    "uva-10624": dict(
        pista1="Backtracking dígito a dígito con poda por divisibilidad.",
        pista2="Lleva el prefijo como entero. Al poner el dígito i (1-indexado), si i >= n el prefijo debe ser divisible por i; si no, poda. Prueba dígitos de 0 a 9 (el primero desde 1) y el primero que llegue a m dígitos es el menor.", casos=g_10624),
    "uva-10001": dict(
        pista1="Backtracking: reconstruir el estado anterior bit a bit.",
        pista2="El nuevo valor de la celda i depende de (p[i-1], p[i], p[i+1]). Fija p[0] y p[1], y cada bit siguiente se valida contra la celda anterior. Al final verifica las dos celdas que cierran el circulo.", casos=g_10001),
    "uva-574": dict(
        pista1="NP-completo con entrada pequeña (subset sum): backtracking.",
        pista2="Los números ya vienen en orden no creciente. En cada nivel recorre desde 'desde' y salta un número si es igual al anterior del mismo nivel: así no repites sumas y salen en el orden pedido.", casos=g_574),
    "uva-193": dict(
        pista1="NP-completo (conjunto independiente máximo): backtracking con poda.",
        pista2="Decide los nodos en orden 1..n: primero intenta pintarlo negro (si ningún vecino lo es) y luego blanco. Poda si negros + nodos restantes <= mejor. Solo actualiza con un tamaño estrictamente mayor: así te quedas con la lexicográficamente menor.", casos=g_193),
    "uva-10496": dict(
        pista1="NP-completo con entrada pequeña (TSP): DP sobre máscaras de bits.",
        pista2="Con a lo sumo 10 beepers: dp[máscara][último] = menor distancia Manhattan que visita 'máscara' y termina en 'último'. Respuesta: min(dp[todas][j] + distancia de j al inicio).", casos=g_10496),
    "uva-11813": dict(
        pista1="NP-completo (TSP) + caminos minimos: Dijkstra + DP de máscaras.",
        pista2="El grafo es grande pero hay a lo sumo 10 tiendas: corre Dijkstra desde la casa y desde cada tienda para tener la matriz de distancias entre puntos clave. Luego TSP con dp[máscara][última].", casos=g_11813, limite=20),
    "uva-11627": dict(
        pista1="Dividir y conquistar: búsqueda binaria sobre los esquis ordenados.",
        pista2="Más lento siempre es más fácil. Para una velocidad s, propaga el intervalo de x alcanzable puerta a puerta (se ensancha vh*dy/s y se recorta a la puerta). Multiplica todo por s para usar enteros.", casos=g_11627),
    "uva-12255": dict(
        pista1="Dividir y conquistar: búsqueda binaria sobre M + verificación voraz.",
        pista2="Pon todos los francotiradores a profundidad M. Cada guardia define un intervalo de x enteros desde donde se le alcanza (radio sqrt(D^2 - h^2), h = y - k + M). Cuenta puntos minimos para cubrir intervalos ordenando por el extremo derecho.", casos=g_12255),
    "uva-11658": dict(
        pista1="Programación dinámica: mochila de sumas alcanzables.",
        pista2="Pasa los porcentajes a enteros (x100). Si x tiene más de 5000 gana todo. Si no, busca la menor suma de otros accionistas que con x supere 5000; la respuesta es p_x / total * 100 redondeada.", casos=g_11658),
    "uva-10404": dict(
        pista1="Programación dinámica: posiciones ganadoras y perdedoras.",
        pista2="gana[s] es cierto si existe una jugada m <= s con gana[s - m] falso. Calcula la tabla una sola vez hasta el mayor n de cada conjunto de jugadas: n llega a 10^6.", casos=g_10404, limite=30),
    "uva-311": dict(
        pista1="Voraz por casos: empacar primero lo grande.",
        pista2="6x6, 5x5 y 4x4 usan una caja cada uno; los 3x3 van de a 4. Después cuenta huecos para 2x2 (5 por cada 4x4 y 5/3/1 según los 3x3 sobrantes) y, al final, el espacio libre total para los 1x1.", casos=g_311),
    "uva-11567": dict(
        pista1="Voraz: pensar hacia atrás en binario.",
        pista2="De S hacia 0: si es par, divide. Si es impar, elige +1 o -1 según cuál deje más ceros al final (S % 4 == 3 -> +1), con la excepción S = 3 (mejor -1).", casos=g_11567),
    "uva-539": dict(
        pista1="Backtracking: DFS marcando aristas (no nodos).",
        pista2="El camino puede repetir nodos pero no aristas. Desde cada nodo inicial, marca la arista al usarla y desmarcala al volver; guarda el largo máximo.", casos=g_539),
    "uva-487": dict(
        pista1="Backtracking: DFS por letras estrictamente crecientes.",
        pista2="Como las letras deben crecer, nunca vuelves a una celda: no hace falta marcar visitados. Guarda en un set las palabras de largo >= 3 y ordena por (largo, palabra). Linea en blanco entre casos.", casos=g_487),
    "uva-11795": dict(
        pista1="NP-completo con N <= 16: DP sobre máscaras de bits.",
        pista2="dp[máscara] = formas de destruir exactamente esos robots. Las armas disponibles dependen solo de la máscara (Mega Buster OR armas de los destruidos). Desde una máscara puedes destruir cualquier robot vivo que alguna arma alcance.", casos=g_11795),
}
