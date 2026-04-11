import { useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useOfflineLocations, SavedLocation } from '@/hooks/useOfflineLocations';

interface Parcela {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  tipo: 'predefinida' | 'gps';
  notas?: string;
  synced?: boolean;
  createdAt?: number;
  savedId?: string;
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

export default function SatelitalTab() {
  const [selected, setSelected] = useState<Parcela | null>(null);
  const [activeTab, setActiveTab] = useState<'parcelas' | 'gps'>('parcelas');
  const [nombre, setNombre] = useState('');
  const [notas, setNotas] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const isOnline = useOnlineStatus();
  const { position, error: geoError, loading: geoLoading, isTracking, startTracking, stopTracking } = useGeolocation();
  const { locations, addLocation, removeLocation } = useOfflineLocations(isOnline);

  // Merge base parcelas + GPS saved locations into one unified list
  const gpsParcelas: Parcela[] = locations.map((loc: SavedLocation) => ({
    id: loc.id,
    nombre: loc.nombre,
    lat: loc.position.lat,
    lng: loc.position.lng,
    tipo: 'gps' as const,
    notas: loc.notas,
    synced: loc.synced,
    createdAt: loc.createdAt,
    savedId: loc.id,
  }));

  const allParcelas: Parcela[] = [...PARCELAS_BASE, ...gpsParcelas];

  const pendingCount = locations.filter((l) => !l.synced).length;

  const handleSaveLocation = async () => {
    if (!position) return;
    if (!nombre.trim()) {
      setSavedMsg('⚠ Ingresa un nombre para identificar esta ubicación.');
      setTimeout(() => setSavedMsg(''), 3000);
      return;
    }
    const newLoc = await addLocation({ nombre: nombre.trim(), notas: notas.trim(), position });
    setSavedMsg(isOnline ? '✓ Ubicación guardada. Ya aparece en Parcelas Registradas.' : '✓ Guardada offline. Aparecerá en Parcelas Registradas y se sincronizará al reconectarte.');
    setNombre('');
    setNotas('');
    // Auto-switch to parcelas tab to show the result
    setTimeout(() => {
      setSavedMsg('');
      setActiveTab('parcelas');
      setSelected({
        id: newLoc.id,
        nombre: newLoc.nombre,
        lat: newLoc.position.lat,
        lng: newLoc.position.lng,
        tipo: 'gps',
        notas: newLoc.notas,
        synced: newLoc.synced,
        createdAt: newLoc.createdAt,
        savedId: newLoc.id,
      });
    }, 1800);
  };

  const handleDeleteGpsParcela = async (parcela: Parcela) => {
    if (!parcela.savedId) return;
    await removeLocation(parcela.savedId);
    if (selected?.id === parcela.id) setSelected(null);
  };

  return (
    <div>
      <div className="portal-header"><h1>Vista Satelital de Parcelas</h1></div>

      {/* Connection status banner */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-4 text-sm font-medium ${
        isOnline
          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
          : 'bg-red-500/15 border border-red-500/30 text-red-400'
      }`}>
        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
        {isOnline
          ? 'Conectado a Internet — los datos se sincronizan en tiempo real.'
          : 'Sin conexión a Internet — los datos se guardarán localmente y se sincronizarán al reconectarte.'}
        {!isOnline && pendingCount > 0 && (
          <span className="ml-auto bg-red-500/30 text-red-300 text-xs px-2 py-0.5 rounded-full">
            {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
          </span>
        )}
        {isOnline && pendingCount === 0 && locations.length > 0 && (
          <span className="ml-auto text-emerald-400/70 text-xs">Todo sincronizado ✓</span>
        )}
      </div>

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
            {allParcelas.length}
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
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
          )}
        </button>
      </div>

      {/* ── TAB: PARCELAS ── */}
      {activeTab === 'parcelas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="panel">
            <div className="panel-hdr">
              <span className="panel-title">Seleccionar Parcela</span>
              <span className="text-white/30 text-xs">{PARCELAS_BASE.length} base · {gpsParcelas.length} GPS</span>
            </div>
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {/* Base parcelas */}
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

              {/* GPS parcelas */}
              {gpsParcelas.length > 0 && (
                <div className="text-white/25 text-xs uppercase tracking-wider px-1 pb-1 pt-3 flex items-center gap-2">
                  <i className="ri-crosshair-2-line" />
                  Registradas por GPS
                </div>
              )}
              {gpsParcelas.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group ${
                    selected?.id === p.id ? 'bg-inca-gold/15 border border-inca-gold/30' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <i className={`ri-map-pin-2-fill text-sm ${p.synced ? 'text-emerald-400' : 'text-yellow-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/80 text-sm truncate">{p.nombre}</div>
                    <div className="font-mono text-xs text-white/30">
                      {formatCoord(p.lat, 4)}, {formatCoord(p.lng, 4)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      p.synced ? 'bg-emerald-500/15 text-emerald-400' : 'bg-yellow-500/15 text-yellow-400'
                    }`}>
                      {p.synced ? '✓' : '⏳'}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteGpsParcela(p); }}
                      className="w-6 h-6 flex items-center justify-center rounded bg-red-500/0 hover:bg-red-500/20 text-red-400/0 group-hover:text-red-400 transition-all cursor-pointer"
                      title="Eliminar"
                    >
                      <i className="ri-delete-bin-line text-xs" />
                    </button>
                  </div>
                </div>
              ))}

              {gpsParcelas.length === 0 && (
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

            {selected?.tipo === 'gps' && selected.notas && (
              <div className="mb-3 bg-inca-dark/40 rounded-lg px-3 py-2 text-xs text-white/40 flex items-start gap-2">
                <i className="ri-file-text-line mt-0.5 shrink-0" />
                {selected.notas}
              </div>
            )}
            {selected?.tipo === 'gps' && selected.createdAt && (
              <div className="mb-3 font-mono text-xs text-white/25 flex items-center gap-3">
                <span><i className="ri-crosshair-2-line mr-1" />{formatCoord(selected.lat)}, {formatCoord(selected.lng)}</span>
                <span>·</span>
                <span>{formatDate(selected.createdAt)}</span>
              </div>
            )}

            {selected && isOnline ? (
              <iframe
                key={`${selected.lat}-${selected.lng}`}
                src={`https://maps.google.com/maps?q=${selected.lat},${selected.lng}&t=k&z=14&output=embed`}
                className="w-full h-80 rounded-lg border-0"
                title="Mapa satelital"
              />
            ) : selected && !isOnline ? (
              <div className="w-full h-80 bg-inca-dark/40 rounded-lg flex flex-col items-center justify-center gap-3 text-white/30">
                <i className="ri-wifi-off-line text-4xl" />
                <span className="text-sm">Sin conexión</span>
                <div className="font-mono text-xs text-center">
                  <div>{formatCoord(selected.lat)}</div>
                  <div>{formatCoord(selected.lng)}</div>
                </div>
                <span className="text-xs text-center px-6">El mapa estará disponible cuando recuperes la conexión.</span>
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
            {/* GPS capture card */}
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

            {/* Save form */}
            <div className="panel">
              <div className="panel-hdr">
                <span className="panel-title">
                  <i className="ri-save-line mr-2 text-inca-gold" />
                  Registrar Ubicación Actual
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

                {savedMsg && (
                  <div className={`text-xs px-3 py-2 rounded-lg ${
                    savedMsg.startsWith('⚠') ? 'bg-yellow-500/15 text-yellow-400' : 'bg-emerald-500/15 text-emerald-400'
                  }`}>
                    {savedMsg}
                  </div>
                )}

                <button
                  onClick={handleSaveLocation}
                  disabled={!position}
                  className="w-full bg-inca-gold/90 text-inca-dark font-semibold py-2 rounded-lg text-sm hover:bg-inca-gold transition-colors cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <i className="ri-map-pin-add-line" />
                  {isOnline ? 'Guardar y ver en Parcelas' : 'Guardar Offline'}
                </button>

                {!isOnline && (
                  <p className="text-white/30 text-xs text-center">
                    <i className="ri-wifi-off-line mr-1" />
                    Sin conexión — se guardará y aparecerá en Parcelas Registradas igualmente.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: live map */}
          <div className="space-y-4">
            <div className="panel">
              <div className="panel-hdr">
                <span className="panel-title">🛰 Vista Satelital en Vivo</span>
              </div>
              {!isOnline ? (
                <div className="w-full h-72 bg-inca-dark/40 rounded-lg flex flex-col items-center justify-center gap-3 text-white/30">
                  <i className="ri-wifi-off-line text-4xl" />
                  <span className="text-sm">Sin conexión</span>
                  <span className="text-xs text-center px-4">Las coordenadas se guardan igualmente y el mapa cargará al reconectarte.</span>
                </div>
              ) : position ? (
                <iframe
                  key={`${position.lat}-${position.lng}`}
                  src={`https://maps.google.com/maps?q=${position.lat},${position.lng}&t=k&z=16&output=embed`}
                  className="w-full h-72 rounded-lg border-0"
                  title="Mi ubicación satelital"
                />
              ) : (
                <div className="w-full h-72 bg-inca-dark/40 rounded-lg flex flex-col items-center justify-center gap-2 text-white/30">
                  <i className="ri-crosshair-2-line text-4xl" />
                  <span className="text-sm">Inicia el GPS para ver tu ubicación</span>
                </div>
              )}
            </div>

            {/* Mini summary of GPS parcelas */}
            {gpsParcelas.length > 0 && (
              <div className="panel">
                <div className="panel-hdr">
                  <span className="panel-title">
                    <i className="ri-map-pin-line mr-2 text-inca-gold" />
                    Mis Puntos GPS
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
                      <i className={`ri-map-pin-2-fill text-sm ${p.synced ? 'text-emerald-400' : 'text-yellow-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-white/70 text-sm truncate">{p.nombre}</div>
                        <div className="font-mono text-xs text-white/30">{formatCoord(p.lat, 4)}, {formatCoord(p.lng, 4)}</div>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${
                        p.synced ? 'bg-emerald-500/15 text-emerald-400' : 'bg-yellow-500/15 text-yellow-400'
                      }`}>
                        {p.synced ? '✓ Sync' : '⏳'}
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
