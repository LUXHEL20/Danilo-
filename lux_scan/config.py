"""Centrale instellingen voor de Lux 2.0 pakket-scanner."""
import os
from pathlib import Path

# Basismap voor data: standaard <project>/data, te overschrijven met LUX_DATA_DIR.
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = Path(os.environ.get("LUX_DATA_DIR", BASE_DIR / "data"))
DB_PATH = DATA_DIR / "lux.db"
EXPORT_DIR = DATA_DIR / "exports"
KOERIER_EXPORT_DIR = EXPORT_DIR / "koeriers"
PAKKET_EXPORT_DIR = EXPORT_DIR / "pakketten"

# De 8 koeriers van Lux 2.0. Namen zijn in de app aan te passen (pagina Koeriers);
# deze lijst wordt alleen gebruikt om een lege database te vullen.
STANDAARD_KOERIERS = [
    "Koerier 1",
    "Koerier 2",
    "Koerier 3",
    "Koerier 4",
    "Koerier 5",
    "Koerier 6",
    "Koerier 7",
    "Koerier 8",
]

MASTER_BESTANDSNAAM = "Lux2.0_alle_pakketten.xlsx"

STATUS_IN = "IN"          # ingescand, ligt in het depot
STATUS_UIT = "AFGEHAALD"  # uitgescand, door de koerier meegenomen


def zorg_voor_mappen() -> None:
    for map_ in (DATA_DIR, EXPORT_DIR, KOERIER_EXPORT_DIR, PAKKET_EXPORT_DIR):
        map_.mkdir(parents=True, exist_ok=True)
