/**
 * Kleine IndexedDB-wrapper. Geen externe libraries: de app moet offline werken
 * en zonder buildstap te installeren zijn.
 */
const DB_NAAM = 'luxaqua';
const DB_VERSIE = 3;

export const STORES = ['klanten', 'bakken', 'vissen', 'metingen', 'fotos', 'hulpvragen', 'taken', 'instellingen', 'logboek', 'spaarkaart', 'kweekkoppels', 'legsels', 'aanbod'];

let dbPromise = null;

export function open() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAAM, DB_VERSIE);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const naam of STORES) {
        if (db.objectStoreNames.contains(naam)) continue;
        const store = db.createObjectStore(naam, { keyPath: 'id' });
        if (naam === 'bakken' || naam === 'hulpvragen') store.createIndex('klantId', 'klantId');
        if (naam === 'legsels' || naam === 'aanbod') store.createIndex('koppelId', 'koppelId');
        if (naam === 'kweekkoppels') store.createIndex('bakId', 'bakId');
        if (['vissen', 'metingen', 'fotos', 'taken'].includes(naam)) store.createIndex('bakId', 'bakId');
        if (naam === 'metingen') store.createIndex('datum', 'datum');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx(store, modus, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, modus);
    const s = t.objectStore(store);
    let resultaat;
    try { resultaat = fn(s); } catch (e) { reject(e); return; }
    t.oncomplete = () => resolve(resultaat?.result !== undefined ? resultaat.result : resultaat);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

export const put = (store, obj) => tx(store, 'readwrite', (s) => { s.put(obj); return obj; });
export const del = (store, id) => tx(store, 'readwrite', (s) => s.delete(id));
export const get = (store, id) => tx(store, 'readonly', (s) => s.get(id));
export const alles = (store) => tx(store, 'readonly', (s) => s.getAll());
export const wis = (store) => tx(store, 'readwrite', (s) => s.clear());

export async function waar(store, index, waarde) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, 'readonly');
    const req = t.objectStore(store).index(index).getAll(waarde);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putVeel(store, objecten) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, 'readwrite');
    const s = t.objectStore(store);
    for (const o of objecten) s.put(o);
    t.oncomplete = () => resolve(objecten.length);
    t.onerror = () => reject(t.error);
  });
}

export const nieuwId = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
