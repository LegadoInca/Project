import { useState, useCallback } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSupabaseLocations, SupabaseLocation } from '@/hooks/useSupabaseLocations';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import GoogleMapView from './GoogleMapView';

interface Parcela {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  tipo: 'predefinida' | 'gps';
  notas?: string;
  created_at?: number;
  dbId?: string;
  created_by?: string;
}

const PARCELAS_BASE: Parcela[] = [
  { id: 'PROV-001', nombre: 'Coop. Villa Rica · Pasco', lat: -10.6626, lng: -75.3558, tipo: 'predefinida' },
  { id: 'PROV-002', nombre: 'Fam. Quispe · Chanchamayo', lat: -11.4893, lng: -74.9011, tipo: 'predefinida' },
  { id: 'PROV-003', nombre: 'Agro Monzón · Huánuco', lat: -9.2853, lng: -75.9964, tipo: 'predefinida' },
  { id: 'PROV-004', nombre: 'Com. Shipibo · Quillabamba', lat: -13.0544, lng: -72.5745, tipo: 'predefinida' },
];

function formatCoord(val: number, decimals = 6) {
  return val.toFixed(decimals);
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function timeAgo(isoStr: string) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora mismo';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  return `hace ${Math.floor(hrs / 24)}d`;
}

export default function SatelitalTab() {
  const [selected, setSelected] = useState<Parcela | null>(null);
  const [activeTab, setActiveTab] = useState<'parcelas' | 'gps'>('parcelas');
  const [nombre, setNombre] = useState('');
  const [notas, setNotas] = useState('');
  const [savedMsg, setSavedMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isOnline = useOnlineStatus();
  const { position, error: geoError, loading: geoLoading, isTracking, startTracking, stopTracking } = useGeolocation();
  const { locations, loading: locsLoading, error: locsError, addLocation, removeLocation, refresh } = useSupabaseLocations();

  const handleSyncComplete = useCallback(() => {
    refresh();
    setSavedMsg('✓ Ubicaciones offline sincronizadas con la nube correctamente.');
    setTimeout(() => setSavedMsg(''), 4000);
  }, [refresh]);

  const { pendingLocations, syncing, addToQueue, removeFromQueue } = useOfflineQueue(isOnline, handleSyncComplete);

  const gpsParcelas: Parcela[] = locations.map((loc: SupabaseLocation) => ({
    id: loc.id,
    nombre: loc.nombre,
    lat: loc.lat,
    lng: loc.lng,
    tipo: 'gps' as const,
    notas: loc.notas,
    created_at: loc.created_at,
    dbId: loc.id,
    created_by: loc.created_by,
  }));

  const pendingParcelas: Parcela[] = pendingLocations.map((loc) => ({
    id: loc.id,
    nombre: loc.nombre,
    lat: loc.lat,
    lng: loc.lng,
    tipo: 'gps' as const,
    notas: loc.notas,
    created_at: loc.created_at,
    dbId: loc.id,
  }));

  const allParcelas: Parcela[] = [...PARCELAS_BASE, ...gpsParcelas];

  const handleSaveLocation = async () => {
    if (!position) return;
    if (!nombre.trim()) {
      setSavedMsg('⚠ Ingresa un nombre para identificar esta ubicación.');
      setTimeout(() => setSavedMsg(''), 3000);
      return;
    }
    setSaving(true);

    const locData = {
      nombre: nombre.trim(),
      notas: notas.trim(),
      lat: position.lat,
      lng: position.lng,
      accuracy: position.accuracy,
      device_info: navigator.userAgent.slice(0, 80),
      created_by: localStorage.getItem('legado_role') ?? 'admin',
    };

    if (!isOnline) {
      // Save to offline queue — will auto-sync when back online
      const queued = await addToQueue(locData);
      setSavedMsg(`✓ Sin conexión: "${queued.nombre}" guardada localmente. Se subirá a la nube automáticamente al reconectarte.`);
      setNombre('');
      setNotas('');
      setActiveTab('parcelas');
      setTimeout(() => setSavedMsg(''), 6000);
      setSaving(false);
      return;
    }

    // Online: save directly to Supabase
    const result = await addLocation({
      ...locData,
      position,
    });

    if (result) {
      setSavedMsg('✓ Ubicación guardada en la nube. Visible en todos los dispositivos.');
      setNombre('');
      setNotas('');
      setActiveTab('parcelas');
      setSelected({
        id: result.id,
        nombre: result.nombre,
        lat: result.lat,
        lng: result.lng,
        tipo: 'gps',
        notas: result.notas,
        created_at: result.created_at,
        dbId: result.id,
      });
      setTimeout(() => setSavedMsg(''), 3000);
    } else {
      // Supabase failed even though we thought we were online — fallback to queue
      const queued = await addToQueue(locData);
      setSavedMsg(`⚠ Error de conexión: "${queued.nombre}" guardada localmente. Se sincronizará automáticamente.`);
      setNombre('');
      setNotas('');
      setActiveTab('parcelas');
      setTimeout(() => setSavedMsg(''), 6000);
    }
    setSaving(false);
  };

  const handleDeleteGpsParcela = async (parcela: Parcela) => {
    if (!parcela.dbId) return;
    setDeletingId(parcela.id);
    const ok = await removeLocation(parcela.dbId);
    setDeletingId(null);
    if (ok && selected?.id === parcela.id) setSelected(null);
    if (!ok) {
      setSavedMsg('✗ No se pudo eliminar. Verifica tu conexión.');
      setTimeout(() => setSavedMsg(''), 4000);
    }
  };

  const handleDeletePending = async (parcela: Parcela) => {
    await removeFromQueue(parcela.id);
    if (selected?.id === parcela.id) setSelected(null);
  };

  return (
    <div>
      <div className="portal-header"><h1>Vista Satelital de Parcelas</h1></div>

      {/* Status bar */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-3 text-sm font-medium ${
        isOnline
          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
          : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
      }`}>
        <span className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        <span className="flex-1 text-xs">
          {isOnline
            ? `Conectado — ${locations.length} ubicaciones en la nube${syncing ? ' · Sincronizando pendientes...' : ''}`
            : `Sin conexión — las ubicaciones se guardan localmente y se suben al reconectarte`}
        </span>
        {locsError && <span className="text-red-400 text-xs shrink-0">Error: {locsError}</span>}
        {isOnline && (
          <button
            onClick={() => refresh()}
            className="flex items-center gap-1 text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="Recargar ubicaciones"
          >
            <i className={`ri-refresh-line ${locsLoading ? 'animate-spin' : ''}`} />
            {locsLoading ? 'Cargando...' : 'Actualizar'}
          </button>
        )}
      </div>

      {/* Pending offline banner */}
      {pendingLocations.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg mb-3 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <i className={`ri-time-line shrink-0 ${syncing ? 'animate-spin' : ''}`} />
          <span className="flex-1">
            {syncing
              ? `Sincronizando ${pendingLocations.length} ubicación${pendingLocations.length > 1 ? 'es' : ''} pendiente${pendingLocations.length > 1 ? 's' : ''}...`
              : `${pendingLocations.length} ubicación${pendingLocations.length > 1 ? 'es' : ''} pendiente${pendingLocations.length > 1 ? 's' : ''} de subir — se sincronizarán al conectarte`}
          </span>
          {isOnline && syncing && (
            <span className="animate-spin inline-block w-3 h-3 border border-amber-400/40 border-t-amber-400 rounded-full shrink-0" />
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setActiveTab('parcelas')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'parcelas' ? 'bg-inca-gold text-inca-dark' : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          <i className="ri-map-2-line" />
          Parcelas Registradas
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'parcelas' ? 'bg-inca-dark/30 text-inca-dark' : 'bg-white/10 text-white/40'}`}>
            {allParcelas.length + pendingParcelas.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('gps')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'gps' ? 'bg-inca-gold text-inca-dark' : 'bg-white/5 text-white/60 hover:bg-white/10'
          }`}
        >
          <i className="ri-crosshair-2-line" />
          Mi Ubicación en Tiempo Real
        </button>
      </div>

      {/* Global message */}
      {savedMsg && (
        <div className={`mb-4 text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 ${
          savedMsg.startsWith('⚠') || savedMsg.startsWith('✗')
            ? 'bg-amber-500/15 border border-amber-500/20 text-amber-400'
            : 'bg-emerald-500/15 border border-emerald-500/20 text-emerald-400'
        }`}>
          {savedMsg}
        </div>
      )}

      {/* ── TAB: PARCELAS ── */}
      {activeTab === 'parcelas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="panel">
            <div className="panel-hdr">
              <span className="panel-title">Seleccionar Parcela</span>
              <span className="text-white/30 text-xs">{PARCELAS_BASE.length} base · {gpsParcelas.length} GPS{pendingParcelas.length > 0 ? ` · ${pendingParcelas.length} pendiente${pendingParcelas.length > 1 ? 's' : ''}` : ''}</span>
            </div>
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {PARCELAS_BASE.length > 0 && (
                <div className="text-white/25 text-xs uppercase tracking-wider px-1 pb-1 pt-1">Predefinidas</div>
              )}
              {PARCELAS_BASE.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selected?.id === p.id ? 'bg-inca-gold/15 border border-inca-gold/30' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="text-inca-gold font-mono text-xs w-20 shrink-0">{p.id}</div>
                  <div className="text-white/70 text-sm flex-1 truncate">{p.nombre}</div>
                </div>
              ))}

              {locsLoading && (
                <div className="flex items-center gap-2 text-white/30 text-xs px-3 py-2">
                  <span className="animate-spin inline-block w-3 h-3 border border-white/30 border-t-white/70 rounded-full" />
                  Cargando desde la nube...
                </div>
              )}

              {gpsParcelas.length > 0 && (
                <div className="text-white/25 text-xs uppercase tracking-wider px-1 pb-1 pt-3 flex items-center gap-2">
                  <i className="ri-crosshair-2-line" />
                  Registradas por GPS · Nube
                  <button
                    onClick={(e) => { e.stopPropagation(); refresh(); }}
                    className="ml-auto w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                    title="Recargar desde la nube"
                  >
                    <i className="ri-refresh-line text-xs" />
                  </button>
                </div>
              )}
              {gpsParcelas.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selected?.id === p.id ? 'bg-inca-gold/15 border border-inca-gold/30' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <i className="ri-map-pin-2-fill text-sm text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/80 text-sm truncate">{p.nombre}</div>
                    <div className="font-mono text-xs text-white/30">
                      {formatCoord(p.lat, 4)}, {formatCoord(p.lng, 4)}
                      {p.created_by && p.created_by !== 'admin' && (
                        <span className="ml-2 text-inca-gold/60">· {p.created_by}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                      <i className="ri-cloud-line" />
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteGpsParcela(p); }}
                      disabled={deletingId === p.id}
                      className="w-7 h-7 flex items-center justify-center rounded bg-red-500/10 hover:bg-red-500/25 text-red-400 transition-all cursor-pointer disabled:opacity-40"
                      title="Eliminar"
                    >
                      {deletingId === p.id
                        ? <span className="animate-spin inline-block w-3 h-3 border border-red-400/40 border-t-red-400 rounded-full" />
                        : <i className="ri-delete-bin-line text-xs" />
                      }
                    </button>
                  </div>
                </div>
              ))}

              {/* Pending offline locations */}
              {pendingParcelas.length > 0 && (
                <div className="text-white/25 text-xs uppercase tracking-wider px-1 pb-1 pt-3 flex items-center gap-2">
                  <i className="ri-time-line" />
                  Pendientes · Offline
                  <span className="ml-1 text-amber-400/70">(se subirán al conectarte)</span>
                </div>
              )}
              {pendingParcelas.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border border-dashed ${
                    selected?.id === p.id ? 'bg-amber-500/10 border-amber-500/30' : 'border-amber-500/15 hover:bg-amber-500/5'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <i className="ri-map-pin-2-fill text-sm text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/70 text-sm truncate">{p.nombre}</div>
                    <div className="font-mono text-xs text-white/30">
                      {formatCoord(p.lat, 4)}, {formatCoord(p.lng, 4)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 whitespace-nowrap">
                      <i className="ri-time-line" /> pendiente
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeletePending(p); }}
                      className="w-7 h-7 flex items-center justify-center rounded bg-red-500/10 hover:bg-red-500/25 text-red-400 transition-all cursor-pointer"
                      title="Eliminar pendiente"
                    >
                      <i className="ri-delete-bin-line text-xs" />
                    </button>
                  </div>
                </div>
              ))}

              {!locsLoading && gpsParcelas.length === 0 && pendingParcelas.length === 0 && (
                <div
                  onClick={() => setActiveTab('gps')}
                  className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-white/10 text-white/25 text-xs cursor-pointer hover:border-inca-gold/30 hover:text-white/40 transition-colors"
                >
                  <i className="ri-add-circle-line" />
                  Registrar mi ubicación GPS → ir a "Mi Ubicación en Tiempo Real"
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="panel-hdr">
              <span className="panel-title">
                🛰 {selected ? selected.nombre : 'Selecciona una parcela'}
              </span>
              <div className="flex items-center gap-2">
                {selected && isOnline && (
                  <a
                    href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}&t=k`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-inca-gold text-xs hover:underline whitespace-nowrap"
                  >
                    Abrir en Maps ↗
                  </a>
                )}
              </div>
            </div>

            {selected?.tipo === 'gps' && selected.notas && (
              <div className="mb-3 bg-inca-dark/40 rounded-lg px-3 py-2 text-xs text-white/40 flex items-start gap-2">
                <i className="ri-file-text-line mt-0.5 shrink-0" />
                {selected.notas}
              </div>
            )}
            {selected?.tipo === 'gps' && selected.created_at && (
              <div className="mb-3 font-mono text-xs text-white/25 flex items-center gap-3 flex-wrap">
                <span><i className="ri-crosshair-2-line mr-1" />{formatCoord(selected.lat)}, {formatCoord(selected.lng)}</span>
                <span>·</span>
                <span>{formatDate(selected.created_at)}</span>
                {pendingParcelas.some((p) => p.id === selected.id) && (
                  <span className="text-amber-400/70 flex items-center gap-1">
                    <i className="ri-time-line" /> pendiente de subir
                  </span>
                )}
              </div>
            )}

            {selected && isOnline ? (
              <GoogleMapView lat={selected.lat} lng={selected.lng} zoom={14} height="h-80" />
            ) : selected && !isOnline ? (
              <div className="w-full h-80 bg-inca-dark/40 rounded-lg flex flex-col items-center justify-center gap-3 text-white/30">
                <i className="ri-wifi-off-line text-4xl" />
                <span className="text-sm">Sin conexión</span>
                <div className="font-mono text-xs text-center">
                  <div>{formatCoord(selected.lat)}</div>
                  <div>{formatCoord(selected.lng)}</div>
                </div>
              </div>
            ) : (
              <div className="w-full h-80 bg-inca-dark/40 rounded-lg flex flex-col items-center justify-center gap-2 text-white/30">
                <span className="text-4xl">🛰</span>
                <span>Selecciona una parcela</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: GPS EN TIEMPO REAL ── */}
      {activeTab === 'gps' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div className="panel">
              <div className="panel-hdr">
                <span className="panel-title">
                  <i className="ri-crosshair-2-line mr-2 text-inca-gold" />
                  Captura de Coordenadas GPS
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isTracking ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'
                }`}>
                  {isTracking ? '● Activo' : '○ Inactivo'}
                </span>
              </div>
              <div className="space-y-3">
                <div className="bg-inca-dark/50 rounded-lg p-4 font-mono text-sm space-y-2">
                  {geoLoading && !position && (
                    <div className="flex items-center gap-2 text-inca-gold/70">
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-inca-gold/40 border-t-inca-gold rounded-full" />
                      Obteniendo señal GPS...
                    </div>
                  )}
                  {geoError && (
                    <div className="text-red-400 text-xs flex items-center gap-2">
                      <i className="ri-error-warning-line" />
                      {geoError}
                    </div>
                  )}
                  {position ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-white/40">Latitud</span>
                        <span className="text-inca-gold">{formatCoord(position.lat)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Longitud</span>
                        <span className="text-inca-gold">{formatCoord(position.lng)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Precisión</span>
                        <span className="text-white/60">±{Math.round(position.accuracy)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Capturado</span>
                        <span className="text-white/60">{formatDate(position.timestamp)}</span>
                      </div>
                    </>
                  ) : (
                    !geoLoading && !geoError && (
                      <div className="text-white/30 text-center py-2">Presiona "Iniciar GPS" para comenzar</div>
                    )
                  )}
                </div>
                <div className="flex gap-2">
                  {!isTracking ? (
                    <button
                      onClick={startTracking}
                      className="flex-1 bg-inca-gold text-inca-dark font-semibold py-2 rounded-lg text-sm hover:bg-inca-gold/90 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                    >
                      <i className="ri-crosshair-2-line" />
                      Iniciar GPS
                    </button>
                  ) : (
                    <button
                      onClick={stopTracking}
                      className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 font-semibold py-2 rounded-lg text-sm hover:bg-red-500/30 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
                    >
                      <i className="ri-stop-circle-line" />
                      Detener GPS
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-hdr">
                <span className="panel-title">
                  <i className="ri-save-line mr-2 text-inca-gold" />
                  Registrar Ubicación Actual
                </span>
                <span className={`text-xs flex items-center gap-1 ${isOnline ? 'text-emerald-400/70' : 'text-amber-400/70'}`}>
                  {isOnline
                    ? <><i className="ri-cloud-line" /> Se guarda en la nube</>
                    : <><i className="ri-time-line" /> Se guarda offline</>
                  }
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Nombre del punto *</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Parcela Norte - Sector A"
                    className="w-full bg-inca-dark/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-inca-gold/50"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs mb-1 block">Notas adicionales</label>
                  <textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Observaciones, condiciones del terreno, etc."
                    rows={2}
                    className="w-full bg-inca-dark/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-inca-gold/50 resize-none"
                  />
                </div>

                {!isOnline && (
                  <div className="text-xs text-amber-400/70 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 flex items-start gap-2">
                    <i className="ri-information-line mt-0.5 shrink-0" />
                    <span>Estás sin conexión. La ubicación se guardará en este dispositivo y se subirá a la nube automáticamente cuando te reconectes. Puedes guardar varias sin problema.</span>
                  </div>
                )}

                <button
                  onClick={handleSaveLocation}
                  disabled={!position || saving}
                  className={`w-full font-semibold py-2 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    isOnline
                      ? 'bg-inca-gold/90 text-inca-dark hover:bg-inca-gold'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                  }`}
                >
                  {saving ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-current/40 border-t-current rounded-full" /> Guardando...</>
                  ) : isOnline ? (
                    <><i className="ri-map-pin-add-line" /> Guardar en la Nube</>
                  ) : (
                    <><i className="ri-save-line" /> Guardar Offline</>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel">
              <div className="panel-hdr">
                <span className="panel-title">🛰 Vista Satelital en Vivo</span>
              </div>
              {!isOnline ? (
                <div className="w-full h-72 bg-inca-dark/40 rounded-lg flex flex-col items-center justify-center gap-3 text-white/30">
                  <i className="ri-wifi-off-line text-4xl" />
                  <span className="text-sm">Sin conexión</span>
                  {position && (
                    <div className="font-mono text-xs text-center text-white/40">
                      <div>{formatCoord(position.lat)}</div>
                      <div>{formatCoord(position.lng)}</div>
                    </div>
                  )}
                </div>
              ) : position ? (
                <GoogleMapView lat={position.lat} lng={position.lng} zoom={16} height="h-72" />
              ) : (
                <div className="w-full h-72 bg-inca-dark/40 rounded-lg flex flex-col items-center justify-center gap-2 text-white/30">
                  <i className="ri-crosshair-2-line text-4xl" />
                  <span className="text-sm">Inicia el GPS para ver tu ubicación</span>
                </div>
              )}
            </div>

            {(gpsParcelas.length > 0 || pendingParcelas.length > 0) && (
              <div className="panel">
                <div className="panel-hdr">
                  <span className="panel-title">
                    <i className="ri-map-pin-line mr-2 text-inca-gold" />
                    Puntos GPS Guardados
                  </span>
                  <button
                    onClick={() => setActiveTab('parcelas')}
                    className="text-inca-gold text-xs hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Ver en Parcelas →
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {gpsParcelas.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 bg-inca-dark/40 rounded-lg px-3 py-2">
                      <i className="ri-map-pin-2-fill text-sm text-emerald-400" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white/70 text-sm truncate">{p.nombre}</div>
                        <div className="font-mono text-xs text-white/30">{formatCoord(p.lat, 4)}, {formatCoord(p.lng, 4)}</div>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                        <i className="ri-cloud-line" />
                      </span>
                    </div>
                  ))}
                  {pendingParcelas.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 bg-amber-500/5 border border-dashed border-amber-500/20 rounded-lg px-3 py-2">
                      <i className="ri-map-pin-2-fill text-sm text-amber-400" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white/60 text-sm truncate">{p.nombre}</div>
                        <div className="font-mono text-xs text-white/30">{formatCoord(p.lat, 4)}, {formatCoord(p.lng, 4)}</div>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 whitespace-nowrap">
                        <i className="ri-time-line" /> offline
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
