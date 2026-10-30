"""Genera data/problemas.json a partir de la lista recolectada de las tareas de ADA.

conjunto: "nucleo" (30 problemas del plan), "reserva" (9, para simulacros) o "biblioteca" (resto, sin juez).

Uso: python tools/build_catalog.py [--verify]
  --verify  hace una petición HTTP a cada enlace oficial y guarda el código obtenido.
"""
import json
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Enunciados (PDF) de cada tarea en la página del curso.
TAREAS = {
    "2024-1 T1": "https://drive.google.com/file/d/1yBk6j6JBiKyMkSG9XJf0gHzUq_Cm9uam/view",
    "2024-1 T2": "https://drive.google.com/file/d/1Nh_XBZlUNcsHbITdErKHQVY1MOq8fD6F/view",
    "2024-1 T3": "https://drive.google.com/file/d/1Y_bg0185NoxkkBayhxZwupYPofuL0SV-/view",
    "2024-1 T4": "https://drive.google.com/file/d/1bpK5-k4k7Z1C2ExwLzGsQKGpuZ3_bM_P/view",
    "2024-1 T5": "https://drive.google.com/file/d/1CX4bSrkxd72TVadeY2cxqJTXCakh6SVH/view",
    "2024-2 T1": "https://drive.google.com/file/d/1yc977pO6amXHXMzjY8eQgoR81zoVWuOm/view",
    "2024-2 T2": "https://drive.google.com/file/d/119KBAYfQSoVMKF1tj77Prbci1_QDOWY5/view",
    "2024-2 T3": "https://drive.google.com/file/d/1udo49YuA0mEVrEG6yJzOua2_TJELpUvH/view",
    "2024-2 T4": "https://drive.google.com/file/d/1mIAoiJGTNySdFIOrx79-_HjBwYrBQc4B/view",
    "2025-1 T1": "https://drive.google.com/file/d/1_PcxUJx4hYRdfpwCUh_9Hbx8MIJBn7Bv/view",
    "2025-1 T2": "https://drive.google.com/file/d/1YkVI0j010dfLUXntRKKbMGFRXgIdvscw/view",
    "2025-1 T3": "https://drive.google.com/file/d/1wyIkZ54s5TyPFD7A2CbjQsq9u7Imqhrk/view",
    "2025-1 T4": "https://drive.google.com/file/d/1SMpeoF6bv29ga9btbd8jhPQll-LPLGl6/view",
    "2025-2 T1": "https://drive.google.com/file/d/1oV-oT0mebIU0qgI4RpsfkpVtPatDV5MX/view",
    "2025-2 T2": "https://drive.google.com/file/d/1z_pcgmzbRO7nWfUy-nmVP91go5el6aCs/view",
    "2025-2 T3": "https://drive.google.com/file/d/1JXYmDh9iGLzIXB4P95adidClij3T1Vrp/view",
    "2025-2 T4": "https://drive.google.com/file/d/1RQtNeaj5LQNWX-FskwyrUFaGvWk8Bqdv/view",
    "2026-1 T1": "https://drive.google.com/file/d/1aUEgGjYK-BKIiS8KO7QzGoMutlUfJ7L0/view",
    "2026-1 T2": "https://drive.google.com/file/d/1X6VnBiUHhiZ1NxNNZn0PpeOIXFRuUCdQ/view",
    "2026-1 T3": "https://drive.google.com/file/d/1bwFtMIxNqLdo7aP5szmQK_zpYq38Ureg/view",
    "2026-1 T4": "https://drive.google.com/file/d/1yBflZJYC-Xl2fVFO8zJk_Q33kOORYSol/view",
}

TEMAS = {
    "dyc": "Dividir y conquistar",
    "bt": "Backtracking",
    "dp": "Programación dinámica",
    "voraz": "Algoritmos voraces",
    "np": "NP-completitud (entrada pequeña)",
    "repaso": "Repaso / lectura de entrada",
}

# (fuente, numero, nombre, tema, dificultad, apariciones, resumen, pista)
# apariciones: claves de TAREAS, o "AAAA-S clase" para problemas vistos en la bitácora.
P = [
    # ---------------- Repaso ----------------
    ("UVa", 11332, "Summing Digits", "repaso", "facil", ["2024-1 T1", "2024-1 clase"],
     "Suma repetidamente los dígitos de n hasta que quede un solo dígito. La entrada termina en 0.",
     "Ciclo while mientras n >= 10; o la fórmula de la raíz digital 1 + (n-1) % 9."),
    ("UVa", 11987, "Almost Union-Find", "repaso", "medio", ["2024-1 T1"],
     "Union-Find con una operación extra: mover un elemento a otro conjunto; consultar tamaño y suma.",
     "Para mover p sin romper su conjunto, dale a p un nodo 'virtual' nuevo y guarda tamaño y suma en la raíz."),
    ("UVa", 13190, "Rockabye Tobby", "repaso", "facil", ["2024-1 T1"],
     "Simula k tomas de medicamentos con frecuencias distintas, desempatando por prioridad.",
     "Montículo (heapq) con tuplas (tiempo, prioridad, frecuencia); saca k veces y reinserta tiempo+frecuencia."),

    # ---------------- Dividir y conquistar ----------------
    ("UVa", 13054, "Hippo Circus", "dyc", "facil", ["2024-1 T1", "2024-1 clase"],
     "Hipopótamos pasan una puerta solos o de a dos (uno encima); minimizar el tiempo total.",
     "Ordena alturas; empareja el más alto con el más bajo posible usando dos índices (o búsqueda binaria)."),
    ("UVa", 11402, "Ahoy, Pirates!", "dyc", "dificil", ["2024-1 T1"],
     "Cadena binaria enorme con operaciones de asignar/invertir rangos y contar unos en un rango.",
     "Árbol de segmentos con propagación perezosa (lazy) que guarda el tipo de operación pendiente."),
    ("UVa", 10606, "Opening Doors", "dyc", "medio", ["2024-1 T2", "2025-2 T1", "2024-1 clase"],
     "Las puertas abiertas al final son los cuadrados perfectos; hallar el mayor cuadrado <= N (N muy grande).",
     "Raíz cuadrada entera por búsqueda binaria (o math.isqrt) y eleva al cuadrado."),
    ("UVa", 10057, "A Mid-summer Night's Dream", "dyc", "facil", ["2024-1 T2"],
     "Hallar A que minimiza la suma de |X_i - A|, cuántos X_i lo alcanzan y cuántos A posibles hay.",
     "La mediana minimiza la suma de distancias absolutas; con n par sirve todo el rango entre las dos medianas."),
    ("UVa", 13142, "Destroy the Moon to Save the Earth", "dyc", "facil", ["2024-1 T2"],
     "Calcular cuántas toneladas agregar o quitar a la Luna para cambiar su velocidad y recorrer D km extra.",
     "Despeja: delta de velocidad (mm/s) = D·10^6 / (T·86400); cuidado con el signo y el truncamiento."),
    ("UVa", 11627, "Slalom", "dyc", "medio", ["2024-1 T2", "2024-1 clase"],
     "Escoger los esquís más rápidos con los que todavía se pueden pasar todas las puertas.",
     "Búsqueda binaria sobre la velocidad: para una velocidad, propaga el intervalo alcanzable de x puerta a puerta."),
    ("UVa", 11413, "Fill the Containers", "dyc", "facil", ["2024-1 clase"],
     "Repartir recipientes consecutivos en m contenedores minimizando la capacidad máxima.",
     "Búsqueda binaria sobre la capacidad + verificación voraz contando contenedores necesarios."),
    ("UVa", 12190, "Electric Bill", "dyc", "medio", ["2024-2 T1"],
     "Con tarifas por tramos, deducir tu consumo a partir del total conjunto y la diferencia con el vecino.",
     "Total de consumo por inversa de la tarifa; luego búsqueda binaria sobre tu consumo usando la diferencia."),
    ("UVa", 12097, "Pie", "dyc", "facil", ["2024-2 T1", "2024-2 clase"],
     "Repartir porciones iguales de N tortas a F+1 personas maximizando el tamaño de porción.",
     "Bisección sobre el área: cuenta floor(area_i / x) por torta y compara con F+1."),
    ("UVa", 12598, "Starting School", "dyc", "medio", ["2024-2 T1"],
     "Tras K números asignados al azar, el resto recibe el menor libre; responder qué número tiene la posición q.",
     "Ordena los K usados; para la posición q > K busca binariamente el menor x con x - (usados <= x) = q - K."),
    ("UVa", 12609, "Sequential Thinking", "dyc", "medio", ["2024-2 T1", "2024-2 clase"],
     "Concatenar el menor múltiplo de 4 que empieza por N, para N=1,2,...; hallar el K-ésimo dígito (K hasta 1e15).",
     "Cuenta dígitos por bloques de longitud de N y luego búsqueda binaria del N que contiene la posición K."),
    ("UVa", 183, "Bit Maps", "dyc", "medio", ["2025-1 T1"],
     "Convertir mapas de bits entre la representación matricial y la de descomposición recursiva en cuadrantes.",
     "Recursión sobre subrectángulos: si todo es igual emite el dígito, si no 'D' y las cuatro partes."),
    ("UVa", 11701, "Cantor", "dyc", "medio", ["2025-1 T1"],
     "Decidir si un número decimal pertenece al conjunto de Cantor.",
     "Repite: multiplica por 3; si la parte entera es 1 (y no es exactamente 1.0) no pertenece; detecta ciclos."),
    ("Codeforces", "706B", "Interesting Drink", "dyc", "facil", ["2025-1 T1", "2025-1 clase"],
     "Para cada día, contar en cuántas tiendas puedes comprar con m monedas.",
     "Ordena los precios y usa bisect_right por cada consulta."),
    ("UVa", 11692, "Rain Fall", "dyc", "medio", ["2025-1 T1"],
     "Tubo con fuga a altura L: calcular la lluvia mínima y máxima consistentes con el nivel observado.",
     "Separa los casos H < L y H >= L; la cantidad de lluvia se halla por bisección (o despejando la ecuación)."),
    ("UVa", 12255, "Underwater Snipers", "dyc", "medio", ["2025-1 T1", "2025-1 clase"],
     "Ubicar S francotiradores en la orilla lo más lejos posible del río cubriendo a todos los soldados.",
     "Búsqueda binaria sobre la distancia; para cada candidata, cada soldado da un intervalo y se cubre de forma voraz."),
    ("UVa", 12965, "Angry Bids", "dyc", "facil", ["2025-2 T1"],
     "Escoger un precio que minimice productores y consumidores enojados.",
     "Los precios candidatos son los valores dados; ordena ambas listas y cuenta con bisect."),
    ("Codeforces", "24E", "Berland Collider", "dyc", "dificil", ["2025-2 T1"],
     "Partículas en una línea con velocidades: tiempo del primer choque entre partículas en direcciones opuestas.",
     "Búsqueda binaria sobre el tiempo t: ¿alguna partícula a la derecha alcanza a una de la izquierda antes de t?"),
    ("LightOJ", 1048, "Conquering Keokradong", "dyc", "medio", ["2025-2 T1"],
     "Dividir un camino en K+1 jornadas minimizando la caminata máxima diaria e imprimir el plan.",
     "Búsqueda binaria sobre el máximo + reparto voraz; ojo: hay que usar exactamente K noches."),
    ("POJ", 2961, "Sylvester Construction", "dyc", "facil", ["2025-2 T1", "2025-2 clase"],
     "Consultar valores de una matriz de Hadamard enorme construida recursivamente.",
     "Recursión sobre cuadrantes: el cuadrante inferior derecho invierte el signo; no construyas la matriz."),
    ("UVa", 107, "The Cat in the Hat", "dyc", "medio", ["2026-1 T1"],
     "Gatos con sombreros recursivos: dada la altura inicial y el número de gatos trabajadores, hallar totales.",
     "Busca N tal que (N+1)^k = altura y N^k = trabajadores; prueba N o k con búsqueda y aritmética entera."),
    ("UVa", 10385, "Duathlon", "dyc", "medio", ["2026-1 T1"],
     "Escoger cómo repartir la distancia correr/pedalear para que el último competidor gane por el mayor margen.",
     "La ventaja es una función unimodal de r: búsqueda ternaria."),
    ("UVa", 11876, "N + NOD (N)", "dyc", "facil", ["2026-1 T1", "2026-1 clase"],
     "Secuencia N_i = N_{i-1} + número de divisores; contar términos en [A, B].",
     "Precalcula la secuencia hasta 10^6 (criba de divisores) y responde con dos bisect."),
    ("UVa", 10245, "The Closest Pair Problem", "dyc", "medio", ["2026-1 T1"],
     "Distancia mínima entre puntos del plano; INFINITY si es >= 10000.",
     "Ordena por x y divide y conquista: franja central de ancho d ordenada por y."),
    ("UVa", 1753, "Need for Speed", "dyc", "medio", ["2026-1 T1"],
     "Hallar la constante c del velocímetro tal que el tiempo total del viaje coincide.",
     "El tiempo total decrece con c: bisección sobre c empezando en -min(s_i)."),

    # ---------------- Programación dinámica ----------------
    ("UVa", 1350, "Pinary", "dp", "medio", ["2024-1 T2", "2024-1 clase"],
     "Encontrar el K-ésimo número binario sin dos unos seguidos.",
     "La cantidad de pinarios de longitud L es Fibonacci; construye el número dígito a dígito restando conteos."),
    ("UVa", 12621, "On a Diet", "dp", "medio", ["2024-1 T3"],
     "Escoger platos sin repetir con suma de calorías >= objetivo y lo más cercana posible.",
     "Suma de subconjuntos (subset sum) con tabla de alcanzables; busca la primera suma >= objetivo."),
    ("UVa", 12324, "Philip J. Fry Problem", "dp", "medio", ["2024-1 T3"],
     "Viajes en orden con esferas que reducen a la mitad el tiempo de un viaje; minimizar el tiempo total.",
     "dp[i][esferas disponibles]; las esferas útiles nunca superan n, acota el estado."),
    ("UVa", 10688, "The Poor Giant", "dp", "dificil", ["2024-1 T3", "2026-1 T2"],
     "Estrategia óptima para encontrar la manzana dulce minimizando el peso total comido en el peor caso.",
     "DP de intervalos: costo(i,j) = min sobre la manzana a comer k de peso_k·(j-i+1) + costo de los lados."),
    ("UVa", 11002, "Towards Zero", "dp", "medio", ["2024-1 T3"],
     "Recorrer un tablero rombo sumando o restando números para acercarse lo más posible a cero.",
     "dp[celda] = conjunto (o arreglo con desplazamiento) de sumas alcanzables; responde min |s|."),
    ("UVa", 10404, "Bachet's Game", "dp", "facil", ["2024-2 T2"],
     "Juego de quitar piedras con un conjunto de jugadas permitidas: ¿gana quien empieza?",
     "gana[n] = existe jugada m <= n con gana[n-m] falso."),
    ("UVa", 12862, "Intrepid climber", "dp", "medio", ["2024-2 T2"],
     "Árbol con la cima como raíz; bajar a visitar amigos sin volver al final, minimizando energía.",
     "Suma 2·costo de las aristas necesarias y resta la rama más profunda (se recorre una sola vez)."),
    ("UVa", 12563, "Jin Ge Jin Qu hao", "dp", "medio", ["2024-2 T2"],
     "Maximizar canciones (y luego tiempo) antes de que se acabe el tiempo, cerrando con la canción larga.",
     "Mochila 0/1 con capacidad t-1 maximizando (cantidad, tiempo); al final suma 678 s."),
    ("UVa", 10163, "Storage Keepers", "dp", "medio", ["2024-2 T2", "2024-2 clase"],
     "Escoger guardias para N bodegas maximizando la seguridad mínima y luego minimizando el salario.",
     "Primero DP para la máxima seguridad L; luego otra DP de costo mínimo para cubrir N con seguridad >= L."),
    ("UVa", 10069, "Distinct Subsequences", "dp", "medio", ["2024-2 T2"],
     "Contar de cuántas formas aparece Z como subsecuencia de X.",
     "dp[j] += dp[j-1] cuando X[i] == Z[j], recorriendo j de derecha a izquierda (Python maneja enteros grandes)."),
    ("UVa", 10448, "Unique World", "dp", "medio", ["2024-2 T2", "2025-1 T2"],
     "En un árbol, ir de a a b con costo exacto; puedes ir y volver por aristas del camino.",
     "Halla el camino único; el sobrante debe formarse con 2·peso de aristas del camino: cambio de monedas mínimo."),
    ("UVa", 13314, "Arctic Virus", "dp", "medio", ["2025-1 T2"],
     "Decidir si una cadena de bases se genera con la gramática de mutaciones del virus.",
     "Memoriza sobre (inicio, fin, invertida) y prueba las reglas desde fuera hacia dentro."),
    ("UVa", 11514, "Batman", "dp", "medio", ["2025-1 T2"],
     "Usar superpoderes en orden contra villanos en orden sin exceder las calorías.",
     "dp[i][j] = mínima energía usando los primeros i poderes para vencer los primeros j villanos (tipo LCS)."),
    ("UVa", 10912, "Simple Minded Hashing", "dp", "facil", ["2025-1 T2"],
     "Contar cadenas estrictamente crecientes de longitud L con suma de letras S.",
     "dp[letra][largo][suma]; si L > 26 o S > 351 la respuesta es 0."),
    ("Curso ADA", "2025-2-T2-A", "Decoding Messages", "dp", "dificil", ["2025-2 T2"],
     "Decidir si un mensaje binario se puede partir en dos subsecuencias que son repeticiones de A y de B.",
     "dp[i][j] con i = posición en el mensaje y j = avance dentro de A; el avance en B se deduce de i y j."),
    ("TopCoder", "RandomSort", "Random Sort", "dp", "medio", ["2025-2 T2"],
     "Número esperado de intercambios para ordenar una permutación eligiendo inversiones al azar.",
     "Memoriza sobre la tupla de la permutación: E(p) = 1 + promedio de E(p tras cada inversión)."),
    ("TopCoder", "ChangingSounds", "Changing Sounds", "dp", "facil", ["2025-2 T2"],
     "Sumar o restar cada cambio de volumen sin salir de [0, max]; maximizar el volumen final.",
     "Conjunto de volúmenes alcanzables canción a canción; si queda vacío imprime -1."),
    ("Curso ADA", "2025-2-T2-D", "Untangle Them All", "dp", "medio", ["2025-2 T2"],
     "Cuerdas entre dos segmentos: el mayor grupo sin cruces y el mayor grupo donde todas se cruzan.",
     "Ordena por un extremo: sin cruces = LIS del otro extremo; todas cruzadas = LDS."),
    ("UVa", 12790, 'The "Win-stay and Lose-shift" Strategy', "dp", "medio", ["2025-2 T2"],
     "Comparar el resultado esperado de jugar piedra-papel-tijera con una estrategia contra el resultado real.",
     "Probabilidad de cada jugada por ronda depende solo de la ronda anterior: DP hacia adelante sobre 3 estados."),
    ("UVa", 11658, "Best Coalitions", "dp", "medio", ["2026-1 T2"],
     "Formar una coalición con más del 50% de acciones maximizando la parte de un accionista dado.",
     "Mochila sobre porcentajes (x100 a enteros): menor suma alcanzable que, con él, supere 5000."),
    ("UVa", 1105, "Coffee Central", "dp", "dificil", ["2026-1 T2"],
     "Para varias distancias m, la ubicación con más cafeterías a distancia Manhattan <= m.",
     "Rota coordenadas (x+y, x-y) para que el rombo sea un cuadrado y usa sumas prefijas 2D."),
    ("UVa", 10259, "Hippity Hopscotch", "dp", "facil", ["2026-1 T2"],
     "Saltos de hasta k casillas en línea recta a celdas con más monedas; maximizar lo recogido.",
     "Memoización: mejor(celda) = monedas + máximo sobre saltos válidos a celdas mayores."),
    ("UVa", 13286, "Ingredients", "dp", "dificil", ["2026-1 T2"],
     "Recetas derivadas de otras: con un presupuesto, maximizar el prestigio de los platos escogidos.",
     "Calcula costo y prestigio de cada plato con memoización sobre el DAG; luego mochila 0/1."),

    # ---------------- Voraces ----------------
    ("UVa", 11890, "Calculus Simplified", "voraz", "dificil", ["2024-1 T4", "2026-1 T3"],
     "Ubicar números en una expresión con +, - y paréntesis para maximizar su valor.",
     "Cuenta cuántas posiciones quedan con signo + y cuántas con -; asigna los números más grandes a las +."),
    ("UVa", 12259, "Fair Division", "voraz", "medio", ["2024-1 T4"],
     "Repartir el costo de un regalo lo más parejo posible respetando el máximo de cada persona.",
     "Ordena por máximo; quien no alcanza la cuota justa paga su máximo y se recalcula la cuota del resto."),
    ("UVa", 1344, "Tian Ji -- The Horse Racing", "voraz", "dificil", ["2024-1 T4"],
     "Emparejar caballos contra los del rey para maximizar las ganancias.",
     "Ordena ambos; compara los más rápidos y los más lentos para decidir ganar, empatar o sacrificar."),
    ("UVa", 1395, "Slim Span", "voraz", "medio", ["2024-1 T4"],
     "Árbol de expansión con la menor diferencia entre la arista más pesada y la más liviana.",
     "Para cada arista inicial (ordenadas), corre Kruskal desde ella y toma la menor diferencia."),
    ("UVa", 12834, "Extreme Terror", "voraz", "facil", ["2024-1 T4"],
     "Maximizar ganancia sumando Y_i - X_i y pudiendo descartar hasta K negocios.",
     "Calcula las ganancias, ordena y descarta las K más negativas."),
    ("UVa", 13082, "High School Assembly", "voraz", "medio", ["2024-1 T4"],
     "Mínimo de estudiantes a enviar al final de la fila para que quede ordenada.",
     "Busca la secuencia 1,2,3... en orden en la fila; los que no forman ese prefijo se mueven."),
    ("UVa", 11267, "The Hire-a-Coder Business Model", "voraz", "dificil", ["2024-1 T4"],
     "Elegir transacciones que conecten a todos con costo mínimo, con la restricción de que el grafo sea bipartito.",
     "Verifica bipartición con BFS; Kruskal tomando también las aristas de costo negativo."),
    ("UVa", 1346, "Songs", "voraz", "facil", ["2024-1 T4"],
     "Orden de canciones en una cinta que minimiza el tiempo esperado de acceso.",
     "Ordena por longitud/frecuencia ascendente (argumento de intercambio)."),
    ("UVa", 11240, "Antimonotonicity", "voraz", "facil", ["2024-2 T3"],
     "Subsecuencia más larga que alterna mayor, menor, mayor...",
     "Recorre y toma los extremos locales alternando lo que buscas (bajar o subir)."),
    ("UVa", 13127, "Bank Robbery", "voraz", "medio", ["2024-2 T3"],
     "Bancos y comisarías en un grafo: qué bancos están más lejos de cualquier policía.",
     "Dijkstra multi-fuente desde todas las comisarías a la vez."),
    ("UVa", 12321, "Gas Stations", "voraz", "medio", ["2024-2 T3"],
     "Máximo de estaciones que se pueden cerrar manteniendo cubierta toda la carretera.",
     "Cubrimiento de intervalos: ordena por inicio y escoge siempre el que más lejos llegue."),
    ("UVa", 10457, "Magic Car", "voraz", "dificil", ["2024-2 T3"],
     "Ir de s a t minimizando la energía, que depende de la diferencia entre velocidad máxima y mínima usada.",
     "Ordena aristas; fija la mínima y agrega en orden con Union-Find hasta conectar s y t."),
    ("UVa", 11230, "Annoying painting tool", "voraz", "facil", ["2024-2 T3"],
     "Mínimo de inversiones de rectángulos r x c para obtener la imagen objetivo.",
     "Recorre de arriba-izquierda: si el píxel difiere, invierte el rectángulo que empieza ahí."),
    ("UVa", 10821, "Constructing BST", "voraz", "medio", ["2025-1 T3"],
     "Orden de inserción lexicográficamente menor que produce un BST de altura <= H.",
     "Para el rango [lo, hi], la raíz es el menor valor que deja al lado derecho caber en altura H-1."),
    ("UVa", 721, "Invitation Cards", "voraz", "medio", ["2025-1 T3"],
     "Costo total de ir de la sede a cada parada y volver.",
     "Dijkstra desde 1 en el grafo y en el grafo invertido; suma ambas distancias."),
    ("UVa", 1153, "Keep the Customer Satisfied", "voraz", "medio", ["2025-1 T3", "2026-1 T3"],
     "Máximo de pedidos que se pueden cumplir antes de su fecha límite.",
     "Ordena por fecha; acepta cada pedido y si te pasas quita el más largo (heap de máximos)."),
    ("UVa", 311, "Packets", "voraz", "medio", ["2025-1 T3"],
     "Mínimo de cajas 6x6 para empacar paquetes de 1x1 a 6x6.",
     "Coloca de mayor a menor y llena los huecos que dejan 4x4 y 3x3 con 2x2 y luego 1x1."),
    ("UVa", 1265, "Tour Belt", "voraz", "dificil", ["2025-1 T3"],
     "Contar subconjuntos de islas donde toda arista interna supera a toda arista hacia afuera.",
     "Kruskal en orden decreciente; al unir componentes revisa si el grupo cumple la condición."),
    ("UVa", 10382, "Watering Grass", "voraz", "medio", ["2025-2 T3"],
     "Mínimo de aspersores circulares para regar toda una franja de pasto.",
     "Convierte cada círculo a un intervalo con dx = sqrt(r²-(w/2)²); cubrimiento voraz de intervalos."),
    ("UVa", 11567, "Moliu Number Generator", "voraz", "facil", ["2025-2 T3"],
     "Mínimo de operaciones INC, DEC, DBL para ir de 0 a S.",
     "Trabaja hacia atrás: si S es par divide; si es impar decide +1 o -1 según cuál deja más ceros."),
    ("UVa", 12950, "Even Obsession", "voraz", "medio", ["2025-2 T3"],
     "Camino más barato de 1 a N usando un número par de peajes.",
     "Dijkstra sobre estados (nodo, paridad)."),
    ("Curso ADA", "2025-2-T3-D", "Tree Painting", "voraz", "dificil", ["2025-2 T3"],
     "Máximo de caminos disjuntos de exactamente k nodos hacia la raíz en un árbol.",
     "Procesa de las hojas hacia arriba: cierra un camino en cuanto alcance k nodos."),
    ("UVa", 10462, "Is There A Second Way Left?", "voraz", "medio", ["2025-2 T3"],
     "Costo del segundo mejor árbol de expansión (o decir que no existe).",
     "Kruskal para el MST; luego quita cada arista del MST y recalcula, tomando el mínimo."),
    ("UVa", 166, "Making Change", "voraz", "medio", ["2026-1 T3"],
     "Minimizar monedas que pagas más las que te devuelven, con monedas limitadas.",
     "El cambio devuelto es voraz (monedas ilimitadas); lo que pagas es mochila acotada sobre montos."),
    ("UVa", 10841, "Lift Hopping in the Real World", "voraz", "dificil", ["2026-1 T3"],
     "Llegar al piso k con ascensores que tardan distinto y se tienen que esperar.",
     "Dijkstra sobre (piso, ascensor) sumando el tiempo de espera al cambiar de ascensor."),
    ("UVa", 1234, "RACING", "voraz", "medio", ["2026-1 T3"],
     "Mínimo costo de cámaras para que todo ciclo tenga al menos una.",
     "Árbol de expansión máximo; la respuesta es la suma de las aristas que quedan fuera."),

    # ---------------- Backtracking ----------------
    ("UVa", 10001, "Garden of Eden", "bt", "dificil", ["2024-1 T5", "2026-1 T4"],
     "Decidir si un estado de un autómata celular circular tiene estado anterior.",
     "Backtracking celda a celda fijando 3 bits a la vez y verificando la regla; cierra el círculo al final."),
    ("UVa", 10475, "Help the Leaders", "bt", "medio", ["2024-1 T5"],
     "Generar todas las combinaciones de temas para un discurso sin incluir pares prohibidos.",
     "Ordena los temas (largo desc, alfabético); backtracking evitando conflictos ya elegidos."),
    ("UVa", 10344, "23 out of 5", "bt", "facil", ["2024-1 T5", "2025-2 T4"],
     "¿Pueden 5 números con +, -, * (izq. a der.) dar 23 en algún orden?",
     "Permutaciones + backtracking sobre las operaciones acumulando el valor."),
    ("UVa", 222, "Budget Travel", "bt", "medio", ["2024-1 T5"],
     "Costo mínimo de un viaje decidiendo en qué gasolineras parar según reglas.",
     "Backtracking en cada estación: parar o no, respetando 'debes parar si queda menos de la mitad'."),
    ("UVa", 208, "Firetruck", "bt", "medio", ["2024-1 T5", "2024-2 clase"],
     "Listar todas las rutas simples de 1 al incendio en orden lexicográfico.",
     "Poda primero: solo visita nodos que pueden llegar al destino (BFS desde el destino)."),
    ("UVa", 604, "The Boggle Game", "bt", "dificil", ["2024-2 T4"],
     "Palabras de 4 letras con exactamente 2 vocales comunes a dos tableros de Boggle.",
     "DFS de profundidad 4 en cada tablero con poda por vocales; intersección de conjuntos."),
    ("UVa", 10576, "Y2K Accounting Bug", "bt", "facil", ["2024-2 T4"],
     "Elegir superávit/déficit por mes para maximizar el total anual con toda ventana de 5 meses negativa.",
     "Backtracking sobre 12 meses podando en cuanto una ventana de 5 sea >= 0."),
    ("UVa", 11127, "Triple-Free Binary Strings", "bt", "medio", ["2024-2 T4"],
     "Contar cadenas que encajan con un patrón y no contienen SSS como subcadena.",
     "Construye bit a bit y verifica solo los sufijos nuevos; poda en cuanto aparezca un triple."),
    ("UVa", 539, "The Settlers of Catan", "bt", "facil", ["2025-1 T4"],
     "Camino más largo usando cada arista a lo sumo una vez.",
     "DFS desde cada nodo marcando aristas usadas y desmarcando al regresar."),
    ("UVa", 10503, "The dominoes solitaire", "bt", "facil", ["2025-1 T4"],
     "¿Se pueden llenar n espacios entre dos fichas con m fichas disponibles?",
     "Backtracking ficha por ficha, probando ambas orientaciones."),
    ("UVa", 10957, "So Doku Checker", "bt", "dificil", ["2025-1 T4"],
     "Clasificar un sudoku: ilegal, imposible, ambiguo o con solución única.",
     "Backtracking con máscaras de bits por fila/columna/caja; detente al hallar 2 soluciones (con bandera)."),
    ("UVa", 10776, "Determine The Combination", "bt", "facil", ["2025-2 T4"],
     "Generar todas las combinaciones de r letras de una cadena sin repetir.",
     "Ordena; en cada nivel salta letras iguales a la anterior del mismo nivel."),
    ("UVa", 11201, "The problem of the crazy linguist", "bt", "medio", ["2025-2 T4"],
     "Promedio del 'criterio de belleza' de palabras con patrón consonante-vocal y sin letras repetidas.",
     "Genera las palabras por backtracking letra a letra y acumula; compara con el SBC de la palabra dada."),
    ("UVa", 677, "All Walks of length \"n\" from the first node", "bt", "facil", ["2025-2 T4"],
     "Listar todos los caminos simples de longitud n desde el nodo 1.",
     "DFS con visitados; imprime al llegar a profundidad n."),
    ("UVa", 11451, "Water restrictions", "bt", "medio", ["2025-2 T4"],
     "Programar aspersores para cubrir el jardín usando a lo sumo C litros.",
     "Backtracking: cada aspersor apagado o con el radio mínimo para conectar; poda por consumo."),
    ("UVa", 487, "Boggle Blitz", "bt", "medio", ["2026-1 T4"],
     "Listar palabras de letras estrictamente crecientes formadas por celdas adyacentes.",
     "DFS desde cada celda solo a vecinos con letra mayor; guarda en un set y ordena por (largo, palabra)."),
    ("UVa", 1098, "Robots on Ice", "bt", "dificil", ["2026-1 T4"],
     "Contar recorridos que visitan todas las celdas pasando por 3 puntos en momentos exactos.",
     "Backtracking con podas fuertes: distancia Manhattan al siguiente punto y conectividad de lo no visitado."),
    ("UVa", 10624, "Super Number", "bt", "medio", ["2026-1 T4"],
     "Menor número de m dígitos cuyo prefijo de i dígitos es divisible por i para i en [n, m].",
     "Backtracking dígito a dígito manteniendo el número como entero; poda en cuanto falle la divisibilidad."),
    ("UVa", 331, "Mapping the Swaps", "bt", "facil", ["2026-1 T4"],
     "Contar mapas de intercambios mínimos que ordenan un arreglo pequeño.",
     "Backtracking: intercambia solo pares adyacentes invertidos; cuenta al quedar ordenado."),

    # ---------------- NP-completos con entrada pequeña ----------------
    ("UVa", 193, "Graph Coloring", "np", "medio", ["2025-1 T4"],
     "Máximo número de nodos negros sin dos negros adyacentes (conjunto independiente máximo).",
     "Backtracking: pinta negro solo si ningún vecino es negro; poda si negros + restantes <= mejor."),
    ("UVa", 11813, "Shopping", "np", "dificil", ["2024-1 T3"],
     "Salir de casa, visitar hasta 10 tiendas y volver con la menor distancia.",
     "Dijkstra desde casa y cada tienda; luego TSP con DP sobre máscaras de bits."),
    ("UVa", 11795, "Mega Man's Mission", "np", "dificil", ["2025-1 T2"],
     "Contar órdenes en que Mega Man puede destruir todos los robots usando las armas ganadas.",
     "dp[máscara] = formas; desde una máscara puedes matar el robot i si alguna arma de la máscara lo vence."),
    ("UVa", 10890, "Maze", "np", "dificil", ["2024-2 T4"],
     "Ir de la entrada a la salida recogiendo al menos S tesoros con el menor número de pasos.",
     "Distancias BFS entre puntos clave + backtracking sobre tesoros con poda por el mejor encontrado."),
    ("UVa", 11699, "Rooks", "np", "dificil", ["2025-1 T4"],
     "Mínimo de torres para atacar todas las casillas marcadas de un tablero 15x15.",
     "Enumera máscaras de filas con torre; las columnas sobrantes se deducen. 2^15 subconjuntos."),
    ("UVa", 10496, "Collecting Beepers", "np", "medio", ["extra"],
     "Recoger hasta 10 beepers en una cuadrícula y volver con la menor distancia Manhattan.",
     "TSP clásico: dp[máscara][último] o permutaciones con poda."),
    ("UVa", 216, "Getting in Line", "np", "medio", ["extra"],
     "Conectar hasta 8 computadores en cadena minimizando el cable.",
     "Prueba permutaciones (8! es pequeño) o DP de máscaras; imprime el orden."),
    ("UVa", 574, "Sum It Up", "np", "facil", ["extra"],
     "Listar todas las formas distintas de sumar t con los números dados.",
     "Subset sum por backtracking; ordena desc y salta repetidos en el mismo nivel."),
    ("UVa", 624, "CD", "np", "facil", ["extra"],
     "Escoger pistas que llenen al máximo una cinta de N minutos.",
     "Subset sum con 20 pistas: backtracking o DP guardando la elección."),
]


# Casos en que la petición directa no devuelve 200 pero el problema se confirmó por otra vía.
NOTAS = {
    "Codeforces 706B": "ok (Codeforces bloquea bots con 403; confirmado con la API problemset.problems)",
    "Codeforces 24E": "ok (Codeforces bloquea bots con 403; confirmado con la API problemset.problems)",
    "POJ 2961": "sin confirmar (poj.org respondió 502; enlace tomado de la bitácora del curso)",
    "UVa 13314": "id confirmado en uHunt, pero el PDF oficial da 404: usar enunciado_curso",
}


def official_link(fuente, num):
    if fuente == "UVa":
        return f"https://onlinejudge.org/external/{num // 100}/{num}.pdf"
    if fuente == "Codeforces":
        return f"https://codeforces.com/problemset/problem/{num[:-1]}/{num[-1]}"
    if fuente == "LightOJ":
        return "https://lightoj.com/problem/conquering-keokradong"
    if fuente == "POJ":
        return f"http://poj.org/problem?id={num}"
    return None


def course_link(apariciones):
    for a in apariciones:
        if a in TAREAS:
            return TAREAS[a]
    return None


def check(url):
    req = urllib.request.Request(url, method="GET", headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            ok = r.status
            head = r.read(5)
            if url.endswith(".pdf") and head != b"%PDF-":
                ok = "no-pdf"
            return ok
    except Exception as e:  # noqa: BLE001
        return getattr(e, "code", type(e).__name__)


def main():
    verify = "--verify" in sys.argv
    out = []
    for fuente, num, nombre, tema, dif, apar, resumen, pista in P:
        pid = f"{fuente} {num}" if fuente in ("UVa", "Codeforces", "LightOJ", "POJ") else f"{fuente}: {num}"
        semestres = sorted({a.split()[0] for a in apar if a != "extra"})
        meta = ROOT / "problems" / pid.lower().replace(" ", "-") / "meta.json"
        conjunto = json.loads(meta.read_text(encoding="utf-8"))["conjunto"] if meta.exists() else "biblioteca"
        out.append({
            "id": pid,
            "slug": str(num).lower().replace(" ", "-"),
            "fuente": fuente,
            "nombre": nombre,
            "enlace": official_link(fuente, num) or course_link(apar),
            "enunciado_curso": course_link(apar),
            "semestres": semestres,
            "apariciones": apar,
            "tema": tema,
            "dificultad": dif,
            "extra": apar == ["extra"],
            "conjunto": conjunto,
            "resumen": resumen,
            "pista": pista,
        })
    if verify:
        with ThreadPoolExecutor(12) as ex:
            codes = list(ex.map(lambda p: check(p["enlace"]), out))
        for p, c in zip(out, codes):
            p["verificacion"] = "ok" if c == 200 else NOTAS.get(p["id"], f"falló ({c})")
    doc = {"generado": "2026-10-29", "temas": TEMAS, "problemas": out}
    path = ROOT / "data" / "problemas.json"
    path.parent.mkdir(exist_ok=True)
    path.write_text(json.dumps(doc, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(out)} problemas -> {path}")


if __name__ == "__main__":
    main()
