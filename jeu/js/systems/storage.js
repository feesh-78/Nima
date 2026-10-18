/* =======================================================================
   Stockage sur le téléphone : IndexedDB, avec repli sur localStorage
   si IndexedDB n'est pas disponible (navigation privée, par exemple).
   On garde aussi les 5 dernières sauvegardes en copie de secours.
   ======================================================================= */

const DB_NAME = "nini-city";
const STORE = "saves";
const LS_PREFIX = "nini-city:";
const MAX_BACKUPS = 5;

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!("indexedDB" in self)) return reject(new Error("IndexedDB indisponible"));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }).catch((err) => {
    console.warn("[stockage] repli sur localStorage :", err.message);
    return null;
  });
  return dbPromise;
}

async function idb(mode, fn) {
  const db = await openDb();
  if (!db) return undefined;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(req?.result);
    tx.onerror = () => reject(tx.error);
  });
}

async function getItem(key) {
  const db = await openDb();
  if (db) return idb("readonly", (s) => s.get(key));
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

async function setItem(key, value) {
  const db = await openDb();
  if (db) return idb("readwrite", (s) => s.put(value, key));
  localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
}

export const storage = {
  loadCurrent: () => getItem("current"),
  writeCurrent: (save) => setItem("current", save),

  async pushBackup(save) {
    const list = (await getItem("backups")) || [];
    list.unshift(save);
    await setItem("backups", list.slice(0, MAX_BACKUPS));
  },
  loadBackups: async () => (await getItem("backups")) || [],

  /* Demande au navigateur de ne pas effacer nos données pour gagner de la place. */
  async askPersistence() {
    try {
      if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
        await navigator.storage.persist();
      }
    } catch {
      /* pas grave : c'est un bonus */
    }
  },
};
