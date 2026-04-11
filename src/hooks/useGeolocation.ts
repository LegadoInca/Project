import { useState, useEffect, useCallback } from 'react';

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
}

interface GeolocationState {
  position: GeoPosition | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: false,
  });

  const [watchId, setWatchId] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Tu dispositivo no soporta geolocalización.' }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    setIsTracking(true);

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          position: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          },
          error: null,
          loading: false,
        });
      },
      (err) => {
        let msg = 'Error al obtener ubicación.';
        if (err.code === 1) msg = 'Permiso de ubicación denegado.';
        if (err.code === 2) msg = 'Ubicación no disponible.';
        if (err.code === 3) msg = 'Tiempo de espera agotado.';
        setState((s) => ({ ...s, error: msg, loading: false }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    setWatchId(id);
  }, []);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    setState((s) => ({ ...s, loading: false }));
  }, [watchId]);

  useEffect(() => {
    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [watchId]);

  return { ...state, isTracking, startTracking, stopTracking };
}
