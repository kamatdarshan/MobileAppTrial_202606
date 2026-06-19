import { LocalFile } from '../types';

/**
 * Persistent local storage for document metadata and binary content.
 *
 * Metadata lives in the `meta` object store so the list can be loaded
 * cheaply, while the (potentially large) binary blobs live in a separate
 * `blobs` store and are only read when a file is opened or downloaded.
 *
 * This runs identically on web and inside the Capacitor WebView on
 * Android / iOS, so a single implementation serves all platforms.
 */

const DB_NAME = 'docmanage';
const DB_VERSION = 1;
const META_STORE = 'meta';
const BLOB_STORE = 'blobs';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

function tx(
  db: IDBDatabase,
  stores: string[],
  mode: IDBTransactionMode,
): IDBTransaction {
  return db.transaction(stores, mode);
}

function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllMeta(): Promise<LocalFile[]> {
  const db = await openDb();
  const store = tx(db, [META_STORE], 'readonly').objectStore(META_STORE);
  const all = await promisifyRequest(store.getAll());
  return all as LocalFile[];
}

export async function putMeta(meta: LocalFile): Promise<void> {
  const db = await openDb();
  const transaction = tx(db, [META_STORE], 'readwrite');
  transaction.objectStore(META_STORE).put(meta);
  await awaitTransaction(transaction);
}

export async function putFile(meta: LocalFile, blob: Blob): Promise<void> {
  const db = await openDb();
  const transaction = tx(db, [META_STORE, BLOB_STORE], 'readwrite');
  transaction.objectStore(META_STORE).put(meta);
  transaction.objectStore(BLOB_STORE).put(blob, meta.id);
  await awaitTransaction(transaction);
}

export async function getBlob(id: string): Promise<Blob | undefined> {
  const db = await openDb();
  const store = tx(db, [BLOB_STORE], 'readonly').objectStore(BLOB_STORE);
  const result = await promisifyRequest(store.get(id));
  return result as Blob | undefined;
}

export async function deleteFile(id: string): Promise<void> {
  const db = await openDb();
  const transaction = tx(db, [META_STORE, BLOB_STORE], 'readwrite');
  transaction.objectStore(META_STORE).delete(id);
  transaction.objectStore(BLOB_STORE).delete(id);
  await awaitTransaction(transaction);
}

function awaitTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}
