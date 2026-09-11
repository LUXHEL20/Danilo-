#!/usr/bin/env python3
"""Start de Lux 2.0 pakketscanner.

    python run.py                 # http://localhost:5000
    python run.py --port 8080     # andere poort
    python run.py --host 0.0.0.0  # ook bereikbaar op tablets/gsm in hetzelfde netwerk
"""
import argparse

from lux_scan.app import app
from lux_scan import config


def main() -> None:
    parser = argparse.ArgumentParser(description="Lux 2.0 pakketscanner")
    parser.add_argument("--host", default="127.0.0.1", help="netwerkadres (standaard 127.0.0.1)")
    parser.add_argument("--port", type=int, default=5000, help="poort (standaard 5000)")
    parser.add_argument("--debug", action="store_true", help="ontwikkelmodus met auto-herladen")
    args = parser.parse_args()

    print(f"Lux 2.0 pakketscanner draait op http://{args.host}:{args.port}")
    print(f"Database:        {config.DB_PATH}")
    print(f"Excel-bestanden: {config.EXPORT_DIR}")
    app.run(host=args.host, port=args.port, debug=args.debug)


if __name__ == "__main__":
    main()
