import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface AdminNotification {
  id: string;
  tipo: 'lote' | 'gasto' | 'foto' | 'gps' | 'pedido' | 'mensaje';
  titulo: string;
  descripcion: string;
  origen: string;
  leida: boolean;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export async function sendAdminNotification(
  notif: Omit<AdminNotification, 'id' | 'leida' | 'created_at'>
) {
  const { error } = await supabase.from('admin_notifications').insert({
    tipo: notif.tipo,
    titulo: notif.titulo,
    descripcion: notif.descripcion,
    origen: notif.origen,
    metadata: notif.metadata ?? {},
  });
  return !error;
}

export function useAdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    const notifs = (data ?? []) as AdminNotification[];
    setNotifications(notifs);
    setUnreadCount(notifs.filter((n) => !n.leida).length);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('admin_notifications_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'admin_notifications' },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications]);

  const markAllRead = useCallback(async () => {
    await supabase
      .from('admin_notifications')
      .update({ leida: true })
      .eq('leida', false);
    await fetchNotifications();
  }, [fetchNotifications]);

  const markRead = useCallback(
    async (id: string) => {
      await supabase.from('admin_notifications').update({ leida: true }).eq('id', id);
      await fetchNotifications();
    },
    [fetchNotifications]
  );

  return { notifications, loading, unreadCount, markAllRead, markRead, refresh: fetchNotifications };
}
