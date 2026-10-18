/* =======================================================================
   Stockage sur le téléphone, en double pour plus de sûreté :
   - IndexedDB (la base de données du navigateur),
   - une copie miroir dans localStorage.
   Sur iPhone, IndexedDB peut ne plus répondre après la réouverture de
   l'app : chaque opération a donc un délai maximum, et on lit toujours
   la copie la plus récente des deux.
   On garde aussi les 5 dernières sauvegardes en copie de secours.
   ======================================================================= */

const DB_NAME = "nini-city";
const STORE = "saves";
const LS_PREFIX = "nini-city:";
const MAX_BACKUPS = 5;
const TIMEOUT_MS = 2500;

let dbPromise = null;
let idbBroken = false;

function withTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} ne répond pas`)), TIMEOUT_MS)),
  ]);
}

function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in self)) return reject(new Error("IndexedDB indisponible"));
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => {
        const db = req.result;
        // iOS peut couper la connexion : on la rouvrira à la prochaine opération.
        db.onclose = () => { dbPromise = null; };
        resolve(db);
      };
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error("IndexedDB bloquée"));
    });
    dbPromise.catch(() => { dbPromise = null; });
  }
  return dbPromise;
}

async function idb(mode, fn) {
  if (idbBroken) throw new Error("IndexedDB désactivée pour cette session");
  try {
    const db = await withTimeout(openDb(), "IndexedDB");
    return await withTimeout(new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const req = fn(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error("transaction annulée"));
    }), "IndexedDB");
  } catch (err) {
    // Après un délai dépassé, on n'insiste plus : localStorage prend le relais.
    if (/ne répond pas|bloquée/.test(err.message)) idbBroken = true;
    dbPromise = null;
    throw err;
  }
}

function readLs(key) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

/* Entre deux copies d'une sauvegarde, garde la plus récente. */
function newest(a, b) {
  if (a === undefined) return b;
  if (b === undefined) return a;
  if (typeof a?.updatedAt === "number" && typeof b?.updatedAt === "number") {
    return b.updatedAt > a.updatedAt ? b : a;
  }
  return a;
}

async function getItem(key) {
  let fromIdb;
  try {
    fromIdb = await idb("readonly", (s) => s.get(key));
  } catch (err) {
    console.warn("[stockage] lecture IndexedDB impossible :", err.message);
  }
  return newest(fromIdb, readLs(key));
}

async function setItem(key, value) {
  let ok = false;
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
    ok = true;
  } catch (err) {
    console.warn("[stockage] écriture localStorage impossible :", err.message);
  }
  try {
    await idb("readwrite", (s) => s.put(value, key));
    ok = true;
  } catch (err) {
    console.warn("[stockage] écriture IndexedDB impossible :", err.message);
  }
  if (!ok) throw new Error("Impossible d'enregistrer la partie sur ce téléphone");
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
