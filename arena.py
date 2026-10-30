"""Abre la Arena ADA en el navegador.

Uso:  python arena.py            (puerto 8000 o el siguiente libre)
      python arena.py --no-abrir (solo servidor)
"""
import http.server
import socket
import sys
import threading
import webbrowser
from functools import partial
from pathlib import Path

RAIZ = Path(__file__).resolve().parent


class Manejador(http.server.SimpleHTTPRequestHandler):
    # En Windows el registro a veces asigna text/plain a .js y el navegador rechaza el worker.
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript", ".css": "text/css", ".json": "application/json",
        ".html": "text/html", ".svg": "image/svg+xml",
    }

    def log_message(self, *args):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def puerto_libre(desde):
    p = desde
    libre = False
    while not libre:
        with socket.socket() as s:
            libre = s.connect_ex(("127.0.0.1", p)) != 0
        if not libre:
            p += 1
    return p


def main():
    puerto = puerto_libre(8000)
    servidor = http.server.ThreadingHTTPServer(("127.0.0.1", puerto), partial(Manejador, directory=str(RAIZ)))
    url = f"http://127.0.0.1:{puerto}/"
    print(f"Arena ADA en {url}  (Ctrl+C para cerrar)")
    if "--no-abrir" not in sys.argv:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print("\nHasta luego.")


if __name__ == "__main__":
    main()
