import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export interface PendingLocation {
  id: string;
  nombre: string;
  notas: string;
  lat: number;
  lng: number;
  accuracy?: number;
  created_at: number;
  device_info?: string;
  created_by?: string;
  synced: boolean;
}

const DB_NAME = 'satelital_queue_db';
const STORE_NAME = 'pending_locations';
const DB_VERSION = 1;

function openQueueDB(): Promise<IDBDatabase> {
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

async function queueGetAll(): Promise<PendingLocation[]> {
  const db = await openQueueDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as PendingLocation[]);
    req.onerror = () => reject(req.error);
  });
}

async function queuePut(loc: PendingLocation): Promise<void> {
  const db = await openQueueDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(loc);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function queueDelete(id: string): Promise<void> {
  const db = await openQueueDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export function useOfflineQueue(
  isOnline: boolean,
  onSyncComplete?: () => void
) {
  const [pendingLocations, setPendingLocations] = useState<PendingLocation[]>([]);
  const [syncing, setSyncing] = useState(false);
  const syncingRef = useRef(false);

  const refreshQueue = useCallback(async () => {
    const all = await queueGetAll();
    const pending = all.filter((l) => !l.synced);
    pending.sort((a, b) => a.created_at - b.created_at);
    setPendingLocations(pending);
    return pending;
  }, []);

  useEffect(() => {
    refreshQueue();
  }, [refreshQueue]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (!isOnline) return;

    const syncPending = async () => {
      if (syncingRef.current) return;
      const pending = await refreshQueue();
      if (pending.length === 0) return;

      syncingRef.current = true;
      setSyncing(true);

      let anySuccess = false;
      for (const loc of pending) {
        try {
          const { error } = await supabase.from('gps_locations').insert({
            id: loc.id,
            nombre: loc.nombre,
            notas: loc.notas,
            lat: loc.lat,
            lng: loc.lng,
            accuracy: loc.accuracy,
            created_at: loc.created_at,
            device_info: loc.device_info,
            created_by: loc.created_by,
          });

          if (!error) {
            await queueDelete(loc.id);
            anySuccess = true;
          }
          // If error (e.g. duplicate id), still remove from queue to avoid infinite retry
          // unless it's a network error
          if (error && error.code !== 'PGRST301' && !error.message.includes('network')) {
            await queueDelete(loc.id);
          }
        } catch {
          // Network error — keep in queue for next retry
        }
      }

      await refreshQueue();
      syncingRef.current = false;
      setSyncing(false);

      if (anySuccess && onSyncComplete) {
        onSyncComplete();
      }
    };

    syncPending();
  }, [isOnline, refreshQueue, onSyncComplete]);

  const addToQueue = useCallback(
    async (loc: Omit<PendingLocation, 'id' | 'created_at' | 'synced'>) => {
      // Generate unique ID with timestamp + random suffix to avoid collisions
      const id = `loc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newLoc: PendingLocation = {
        ...loc,
        id,
        created_at: Date.now(),
        synced: false,
      };
      await queuePut(newLoc);
      await refreshQueue();
      return newLoc;
    },
    [refreshQueue]
  );

  const removeFromQueue = useCallback(
    async (id: string) => {
      await queueDelete(id);
      await refreshQueue();
    },
    [refreshQueue]
  );

  return {
    pendingLocations,
    syncing,
    addToQueue,
    removeFromQueue,
    refreshQueue,
  };
}
