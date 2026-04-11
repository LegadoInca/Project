import { useState } from 'react';

export type MapType = 'roadmap' | 'satelital' | 'terrain';
export type MapLayer = 'streetview' | 'traffic' | 'bicycle';

interface MapLayersPanelProps {
  mapType: MapType;
  activeLayers: MapLayer[];
  onMapTypeChange: (type: MapType) => void;
  onLayerToggle: (layer: MapLayer) => void;
}

const MAP_TYPES: { id: MapType; label: string; emoji: string }[] = [
  { id: 'roadmap',   label: 'Mapa',     emoji: '🗺️' },
  { id: 'satelital', label: 'Satélite', emoji: '🛰️' },
  { id: 'terrain',   label: 'Terreno',  emoji: '⛰️' },
];

const LAYERS: { id: MapLayer; label: string; icon: string; color: string }[] = [
  { id: 'streetview', label: 'Street View', icon: 'ri-walk-line',         color: '#4fc3f7' },
  { id: 'traffic',    label: 'Tráfico',     icon: 'ri-traffic-light-line', color: '#ef5350' },
  { id: 'bicycle',    label: 'Bicicleta',   icon: 'ri-bike-line',          color: '#66bb6a' },
];

export default function MapLayersPanel({
  mapType,
  activeLayers,
  onMapTypeChange,
  onLayerToggle,
}: MapLayersPanelProps) {
  const [open, setOpen] = useState(false);

  const currentType = MAP_TYPES.find((m) => m.id === mapType);

  return (
    <div className="absolute bottom-3 left-3 z-10">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-16 h-16 rounded-lg border-2 border-white/80 cursor-pointer relative group bg-white flex flex-col items-center justify-center gap-0.5"
        title="Capas del mapa"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
      >
        <span className="text-2xl leading-none">{currentType?.emoji}</span>
        <span className="text-[9px] font-semibold text-gray-700 tracking-wide leading-none">
          {currentType?.label}
        </span>
        {/* Active layer dots */}
        {activeLayers.length > 0 && (
          <div className="absolute top-1 right-1 flex gap-0.5">
            {activeLayers.map((l) => (
              <span
                key={l}
                className="w-2 h-2 rounded-full border border-white/80"
                style={{ backgroundColor: LAYERS.find((x) => x.id === l)?.color }}
              />
            ))}
          </div>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute bottom-[72px] left-0 bg-white rounded-xl overflow-hidden"
          style={{ width: 280, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
        >
          {/* Map types */}
          <div className="px-4 pt-3 pb-2">
            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Tipo de mapa
            </div>
            <div className="flex gap-3">
              {MAP_TYPES.map((mt) => (
                <button
                  key={mt.id}
                  onClick={() => onMapTypeChange(mt.id)}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div
                    className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all ${
                      mapType === mt.id
                        ? 'border-[#1a73e8] bg-[#e8f0fe]'
                        : 'border-gray-200 bg-gray-50 group-hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl leading-none">{mt.emoji}</span>
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      mapType === mt.id ? 'text-[#1a73e8]' : 'text-gray-600'
                    }`}
                  >
                    {mt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 mx-4" />

          {/* Layers */}
          <div className="px-4 pt-2 pb-3">
            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Detalles del mapa
            </div>
            <div className="flex gap-3">
              {LAYERS.map((layer) => {
                const active = activeLayers.includes(layer.id);
                return (
                  <button
                    key={layer.id}
                    onClick={() => onLayerToggle(layer.id)}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div
                      className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all ${
                        active
                          ? 'border-[#1a73e8] bg-[#e8f0fe]'
                          : 'border-gray-200 bg-gray-50 group-hover:border-gray-300'
                      }`}
                    >
                      <i
                        className={`${layer.icon} text-2xl`}
                        style={{ color: active ? layer.color : '#9e9e9e' }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-medium whitespace-nowrap ${
                        active ? 'text-[#1a73e8]' : 'text-gray-600'
                      }`}
                    >
                      {layer.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="bg-gray-50 border-t border-gray-100 px-4 py-1.5 text-[10px] text-gray-400 text-center cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
