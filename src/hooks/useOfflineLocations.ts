import { useState, useEffect, useCallback } from 'react';
import { GeoPosition } from '@/hooks/useGeolocation';

export interface SavedLocation {
  id: string;
  nombre: string;
  notas: string;
  position: GeoPosition;
  synced: boolean;
  createdAt: number;
}

const DB_NAME = 'satelital_db';
const STORE_NAME = 'locations';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getAllLocations(): Promise<SavedLocation[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as SavedLocation[]);
    req.onerror = () => reject(req.error);
  });
}

async function saveLocation(loc: SavedLocation): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(loc);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function deleteLocation(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function markSynced(id: string): Promise<void> {
  const db = await openDB();
  const all = await getAllLocations();
  const loc = all.find((l) => l.id === id);
  if (!loc) return;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put({ ...loc, synced: true });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export function useOfflineLocations(isOnline: boolean) {
  const [locations, setLocations] = useState<SavedLocation[]>([]);

  const refresh = useCallback(async () => {
    const all = await getAllLocations();
    all.sort((a, b) => b.createdAt - a.createdAt);
    setLocations(all);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // When coming back online, mark pending as synced (simulated sync)
  useEffect(() => {
    if (!isOnline) return;
    (async () => {
      const all = await getAllLocations();
      const pending = all.filter((l) => !l.synced);
      for (const loc of pending) {
        await markSynced(loc.id);
      }
      if (pending.length > 0) await refresh();
    })();
  }, [isOnline, refresh]);

  const addLocation = useCallback(
    async (loc: Omit<SavedLocation, 'id' | 'createdAt' | 'synced'>) => {
      const newLoc: SavedLocation = {
        ...loc,
        id: `loc-${Date.now()}`,
        createdAt: Date.now(),
        synced: isOnline,
      };
      await saveLocation(newLoc);
      await refresh();
      return newLoc;
    },
    [isOnline, refresh]
  );

  const removeLocation = useCallback(
    async (id: string) => {
      await deleteLocation(id);
      await refresh();
    },
    [refresh]
  );

  return { locations, addLocation, removeLocation, refresh };
}
