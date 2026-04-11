import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { GeoPosition } from '@/hooks/useGeolocation';

export interface SupabaseLocation {
  id: string;
  nombre: string;
  notas: string;
  lat: number;
  lng: number;
  accuracy?: number;
  created_at: number;
  device_info?: string;
  created_by?: string;
}

export function useSupabaseLocations() {
  const [locations, setLocations] = useState<SupabaseLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('gps_locations')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setLocations(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLocations();

    // Realtime subscription — se actualiza en todos los dispositivos al instante
    const channel = supabase
      .channel('gps_locations_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gps_locations' },
        () => {
          fetchLocations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLocations]);

  const addLocation = useCallback(
    async (loc: Omit<SupabaseLocation, 'id' | 'created_at'> & { position?: GeoPosition }) => {
      const id = `loc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newLoc: SupabaseLocation = {
        id,
        nombre: loc.nombre,
        notas: loc.notas ?? '',
        lat: loc.position ? loc.position.lat : loc.lat,
        lng: loc.position ? loc.position.lng : loc.lng,
        accuracy: loc.position ? loc.position.accuracy : loc.accuracy,
        created_at: Date.now(),
        device_info: navigator.userAgent.slice(0, 80),
        created_by: localStorage.getItem('legado_role') ?? 'admin',
      };

      const { error: err } = await supabase.from('gps_locations').insert(newLoc);
      if (err) {
        setError(err.message);
        return null;
      }
      return newLoc;
    },
    []
  );

  const removeLocation = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('gps_locations').delete().eq('id', id);
    if (err) setError(err.message);
  }, []);

  return { locations, loading, error, addLocation, removeLocation, refresh: fetchLocations };
}
