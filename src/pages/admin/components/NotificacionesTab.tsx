import { useAdminNotifications, AdminNotification } from '@/hooks/useAdminNotifications';

const iconMap: Record<string, string> = {
  lote: 'ri-seedling-line',
  gasto: 'ri-money-dollar-circle-line',
  foto: 'ri-image-line',
  gps: 'ri-map-pin-line',
  pedido: 'ri-shopping-bag-line',
  mensaje: 'ri-message-3-line',
};

const colorMap: Record<string, string> = {
  lote: 'text-emerald-400',
  gasto: 'text-red-400',
  foto: 'text-inca-gold',
  gps: 'text-blue-400',
  pedido: 'text-amber-400',
  mensaje: 'text-white/60',
};

function timeAgo(isoStr: string) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora mismo';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export default function NotificacionesTab() {
  const { notifications, loading, unreadCount, markAllRead, markRead } = useAdminNotifications();

  return (
    <div>
      <div className="portal-header">
        <div>
          <h1>Notificaciones</h1>
          <div className="text-white/40 text-sm">Cambios en tiempo real desde todos los portales</div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="btn-outline-gold text-xs cursor-pointer whitespace-nowrap"
          >
            Marcar todas como leídas ({unreadCount})
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-white/30 text-sm py-8 justify-center">
          <span className="animate-spin inline-block w-4 h-4 border border-white/30 border-t-white/70 rounded-full" />
          Cargando notificaciones...
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <div className="panel flex flex-col items-center justify-center py-16 gap-3 text-white/30">
          <i className="ri-notification-off-line text-4xl" />
          <span className="text-sm">Sin notificaciones aún</span>
          <span className="text-xs text-center max-w-xs">Cuando el proveedor registre un lote o Praga ingrese un gasto, aparecerá aquí en tiempo real.</span>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <div className="panel space-y-0">
          {notifications.map((n: AdminNotification) => (
            <div
              key={n.id}
              onClick={() => !n.leida && markRead(n.id)}
              className={`flex items-start gap-4 py-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/3 ${!n.leida ? 'bg-inca-gold/5' : ''}`}
            >
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg shrink-0 ${!n.leida ? 'bg-inca-gold/15' : 'bg-white/5'}`}>
                <i className={`${iconMap[n.tipo] ?? 'ri-notification-line'} ${colorMap[n.tipo] ?? 'text-white/50'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-medium text-sm">{n.titulo}</span>
                  {!n.leida && <span className="w-2 h-2 rounded-full bg-inca-gold shrink-0" />}
                </div>
                <div className="text-white/50 text-xs">{n.descripcion}</div>
                <div className="text-white/25 text-xs mt-1 flex items-center gap-2">
                  <span className="bg-white/5 px-1.5 py-0.5 rounded">{n.origen}</span>
                  <span>{timeAgo(n.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
