import { useEffect, useRef, useState, useCallback } from 'react';
import { PerimeterType, PerimeterData, PolygonPoint } from '@/hooks/useSupabaseLocations';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { google: any; }
}

interface PerimeterEditorProps {
  lat: number;
  lng: number;
  existingType?: PerimeterType;
  existingData?: PerimeterData;
  onSave: (type: PerimeterType, data: PerimeterData) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
  saving?: boolean;
}

function calcPolygonAreaHa(points: PolygonPoint[]): number {
  if (points.length < 3) return 0;
  // Shoelace formula with Earth radius approximation
  const R = 6371000;
  let area = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const xi = (points[i].lng * Math.PI) / 180;
    const yi = (points[i].lat * Math.PI) / 180;
    const xj = (points[j].lng * Math.PI) / 180;
    const yj = (points[j].lat * Math.PI) / 180;
    area += xi * yj;
    area -= xj * yi;
  }
  const areaM2 = Math.abs(area / 2) * R * R;
  return areaM2 / 10000;
}

function calcCircleAreaHa(radiusM: number): number {
  return (Math.PI * radiusM * radiusM) / 10000;
}

export default function PerimeterEditor({
  lat, lng,
  existingType, existingData,
  onSave, onDelete, onClose, saving = false,
}: PerimeterEditorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const drawingManagerRef = useRef<any>(null);
  const shapeRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [mode, setMode] = useState<'view' | 'polygon' | 'circle' | 'manual'>('view');
  const [currentType, setCurrentType] = useState<PerimeterType>(existingType ?? null);
  const [currentData, setCurrentData] = useState<PerimeterData | null>(existingData ?? null);
  const [areaHa, setAreaHa] = useState<number>(0);
  const [manualRadius, setManualRadius] = useState<string>(
    existingType === 'circle' && existingData?.radius ? String(existingData.radius) : ''
  );
  const [manualPoints, setManualPoints] = useState<string>(
    existingType === 'polygon' && existingData?.points
      ? existingData.points.map((p) => `${p.lat},${p.lng}`).join('\n')
      : ''
  );
  const [mapReady, setMapReady] = useState(!!window.google?.maps);
  const [drawingLibLoaded, setDrawingLibLoaded] = useState(false);
  const [infoMsg, setInfoMsg] = useState('');

  // Load drawing library if needed
  useEffect(() => {
    if (window.google?.maps?.drawing) {
      setDrawingLibLoaded(true);
      setMapReady(true);
      return;
    }
    if (window.google?.maps) {
      // Maps loaded but drawing not — load it
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_PUBLIC_GMAPS_KEY}&libraries=drawing&callback=__perimeterDrawingReady`;
      script.async = true;
      (window as any).__perimeterDrawingReady = () => {
        setDrawingLibLoaded(true);
        setMapReady(true);
      };
      document.head.appendChild(script);
    } else {
      setMapReady(false);
    }
  }, []);

  // Compute area whenever data changes
  useEffect(() => {
    if (!currentData) { setAreaHa(0); return; }
    if (currentType === 'polygon' && currentData.points) {
      setAreaHa(calcPolygonAreaHa(currentData.points));
    } else if (currentType === 'circle' && currentData.radius) {
      setAreaHa(calcCircleAreaHa(currentData.radius));
    } else {
      setAreaHa(0);
    }
  }, [currentType, currentData]);

  // Init map
  useEffect(() => {
    if (!mapReady || !mapRef.current || mapInstanceRef.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
      mapTypeId: 'hybrid',
      disableDefaultUI: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: true,
    });
    mapInstanceRef.current = map;

    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title: 'Centro de parcela',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 6,
        fillColor: '#f59e0b',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    });

    // Draw existing perimeter if any
    if (existingType && existingData) {
      drawExistingPerimeter(map, existingType, existingData);
    }
  }, [mapReady]);

  const drawExistingPerimeter = (map: any, type: PerimeterType, data: PerimeterData) => {
    clearShape();
    if (type === 'polygon' && data.points && data.points.length >= 3) {
      const poly = new window.google.maps.Polygon({
        paths: data.points.map((p) => ({ lat: p.lat, lng: p.lng })),
        strokeColor: '#f59e0b',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#f59e0b',
        fillOpacity: 0.15,
        map,
      });
      shapeRef.current = poly;
    } else if (type === 'circle' && data.radius) {
      const cLat = data.centerLat ?? lat;
      const cLng = data.centerLng ?? lng;
      const circle = new window.google.maps.Circle({
        center: { lat: cLat, lng: cLng },
        radius: data.radius,
        strokeColor: '#f59e0b',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#f59e0b',
        fillOpacity: 0.15,
        map,
      });
      shapeRef.current = circle;
    }
  };

  const clearShape = () => {
    if (shapeRef.current) {
      shapeRef.current.setMap(null);
      shapeRef.current = null;
    }
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  };

  const stopDrawingManager = () => {
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setMap(null);
      drawingManagerRef.current = null;
    }
  };

  const startPolygonDraw = useCallback(() => {
    if (!mapInstanceRef.current || !window.google?.maps?.drawing) return;
    clearShape();
    stopDrawingManager();
    setMode('polygon');
    setInfoMsg('Haz click en el mapa para trazar los vértices de la parcela. Cierra el polígono haciendo click en el primer punto.');

    const dm = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      polygonOptions: {
        strokeColor: '#f59e0b',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#f59e0b',
        fillOpacity: 0.15,
        editable: true,
        draggable: true,
      },
    });

    dm.setMap(mapInstanceRef.current);
    drawingManagerRef.current = dm;

    window.google.maps.event.addListener(dm, 'polygoncomplete', (polygon: any) => {
      dm.setDrawingMode(null);
      shapeRef.current = polygon;
      const path = polygon.getPath();
      const points: PolygonPoint[] = [];
      for (let i = 0; i < path.getLength(); i++) {
        const pt = path.getAt(i);
        points.push({ lat: pt.lat(), lng: pt.lng() });
      }
      const data: PerimeterData = { points };
      setCurrentType('polygon');
      setCurrentData(data);
      setInfoMsg('');

      // Update on edit
      const updatePoints = () => {
        const updatedPath = polygon.getPath();
        const updatedPoints: PolygonPoint[] = [];
        for (let i = 0; i < updatedPath.getLength(); i++) {
          const pt = updatedPath.getAt(i);
          updatedPoints.push({ lat: pt.lat(), lng: pt.lng() });
        }
        setCurrentData({ points: updatedPoints });
      };
      window.google.maps.event.addListener(path, 'set_at', updatePoints);
      window.google.maps.event.addListener(path, 'insert_at', updatePoints);
    });
  }, []);

  const startCircleDraw = useCallback(() => {
    if (!mapInstanceRef.current || !window.google?.maps?.drawing) return;
    clearShape();
    stopDrawingManager();
    setMode('circle');
    setInfoMsg('Haz click y arrastra en el mapa para definir el radio del círculo.');

    const dm = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.CIRCLE,
      drawingControl: false,
      circleOptions: {
        strokeColor: '#f59e0b',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#f59e0b',
        fillOpacity: 0.15,
        editable: true,
        draggable: true,
      },
    });

    dm.setMap(mapInstanceRef.current);
    drawingManagerRef.current = dm;

    window.google.maps.event.addListener(dm, 'circlecomplete', (circle: any) => {
      dm.setDrawingMode(null);
      shapeRef.current = circle;
      const center = circle.getCenter();
      const radius = Math.round(circle.getRadius());
      const data: PerimeterData = {
        radius,
        centerLat: center.lat(),
        centerLng: center.lng(),
      };
      setCurrentType('circle');
      setCurrentData(data);
      setManualRadius(String(radius));
      setInfoMsg('');

      // Update on edit
      window.google.maps.event.addListener(circle, 'radius_changed', () => {
        const newRadius = Math.round(circle.getRadius());
        const newCenter = circle.getCenter();
        setCurrentData({
          radius: newRadius,
          centerLat: newCenter.lat(),
          centerLng: newCenter.lng(),
        });
        setManualRadius(String(newRadius));
      });
      window.google.maps.event.addListener(circle, 'center_changed', () => {
        const newCenter = circle.getCenter();
        setCurrentData((prev) => prev ? {
          ...prev,
          centerLat: newCenter.lat(),
          centerLng: newCenter.lng(),
        } : null);
      });
    });
  }, []);

  const applyManualRadius = useCallback(() => {
    const r = parseFloat(manualRadius);
    if (!r || r <= 0 || !mapInstanceRef.current) return;
    clearShape();
    stopDrawingManager();
    const data: PerimeterData = { radius: r, centerLat: lat, centerLng: lng };
    const circle = new window.google.maps.Circle({
      center: { lat, lng },
      radius: r,
      strokeColor: '#f59e0b',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#f59e0b',
      fillOpacity: 0.15,
      editable: true,
      draggable: true,
      map: mapInstanceRef.current,
    });
    shapeRef.current = circle;
    setCurrentType('circle');
    setCurrentData(data);
    mapInstanceRef.current.fitBounds(circle.getBounds());

    window.google.maps.event.addListener(circle, 'radius_changed', () => {
      const newRadius = Math.round(circle.getRadius());
      const newCenter = circle.getCenter();
      setCurrentData({ radius: newRadius, centerLat: newCenter.lat(), centerLng: newCenter.lng() });
      setManualRadius(String(newRadius));
    });
    window.google.maps.event.addListener(circle, 'center_changed', () => {
      const newCenter = circle.getCenter();
      setCurrentData((prev) => prev ? { ...prev, centerLat: newCenter.lat(), centerLng: newCenter.lng() } : null);
    });
  }, [manualRadius, lat, lng]);

  const applyManualPolygon = useCallback(() => {
    const lines = manualPoints.trim().split('\n').filter(Boolean);
    const points: PolygonPoint[] = [];
    for (const line of lines) {
      const parts = line.split(',').map((s) => parseFloat(s.trim()));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        points.push({ lat: parts[0], lng: parts[1] });
      }
    }
    if (points.length < 3) {
      setInfoMsg('⚠ Necesitas al menos 3 puntos válidos (lat,lng por línea).');
      setTimeout(() => setInfoMsg(''), 4000);
      return;
    }
    clearShape();
    stopDrawingManager();
    const poly = new window.google.maps.Polygon({
      paths: points.map((p) => ({ lat: p.lat, lng: p.lng })),
      strokeColor: '#f59e0b',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#f59e0b',
      fillOpacity: 0.15,
      editable: true,
      draggable: true,
      map: mapInstanceRef.current,
    });
    shapeRef.current = poly;
    setCurrentType('polygon');
    setCurrentData({ points });

    const bounds = new window.google.maps.LatLngBounds();
    points.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
    mapInstanceRef.current.fitBounds(bounds);
  }, [manualPoints]);

  const handleClearPerimeter = useCallback(() => {
    clearShape();
    stopDrawingManager();
    setCurrentType(null);
    setCurrentData(null);
    setMode('view');
    setInfoMsg('');
  }, []);

  const handleSave = useCallback(async () => {
    if (!currentType || !currentData) return;
    await onSave(currentType, currentData);
  }, [currentType, currentData, onSave]);

  const handleDelete = useCallback(async () => {
    clearShape();
    setCurrentType(null);
    setCurrentData(null);
    setMode('view');
    await onDelete();
  }, [onDelete]);

  const formatArea = (ha: number) => {
    if (ha < 0.01) return `${Math.round(ha * 10000)} m²`;
    if (ha < 1) return `${ha.toFixed(3)} ha`;
    return `${ha.toFixed(2)} ha`;
  };

  const hasDrawingLib = !!window.google?.maps?.drawing || drawingLibLoaded;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-inca-gold/20">
              <i className="ri-shape-line text-inca-gold" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Definir Perímetro de Parcela</h3>
              {currentType && currentData && areaHa > 0 && (
                <p className="text-inca-gold text-xs font-mono">
                  Área: {formatArea(areaHa)}
                  {currentType === 'circle' && currentData.radius && (
                    <span className="text-white/40 ml-2">· Radio: {currentData.radius} m</span>
                  )}
                  {currentType === 'polygon' && currentData.points && (
                    <span className="text-white/40 ml-2">· {currentData.points.length} vértices</span>
                  )}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <i className="ri-close-line" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-72 shrink-0 border-r border-white/10 flex flex-col overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Mode selector */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Método de dibujo</p>
                <div className="space-y-2">
                  {hasDrawingLib && (
                    <>
                      <button
                        onClick={startPolygonDraw}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer text-left ${
                          mode === 'polygon' ? 'bg-inca-gold/20 border border-inca-gold/40 text-inca-gold' : 'bg-white/5 hover:bg-white/10 text-white/70'
                        }`}
                      >
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          <i className="ri-shape-line" />
                        </div>
                        <div>
                          <div className="font-medium">Dibujar Polígono</div>
                          <div className="text-xs text-white/40">Traza los vértices exactos</div>
                        </div>
                      </button>
                      <button
                        onClick={startCircleDraw}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer text-left ${
                          mode === 'circle' ? 'bg-inca-gold/20 border border-inca-gold/40 text-inca-gold' : 'bg-white/5 hover:bg-white/10 text-white/70'
                        }`}
                      >
                        <div className="w-5 h-5 flex items-center justify-center shrink-0">
                          <i className="ri-circle-line" />
                        </div>
                        <div>
                          <div className="font-medium">Dibujar Círculo</div>
                          <div className="text-xs text-white/40">Define un radio de cobertura</div>
                        </div>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setMode('manual')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer text-left ${
                      mode === 'manual' ? 'bg-inca-gold/20 border border-inca-gold/40 text-inca-gold' : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <i className="ri-keyboard-line" />
                    </div>
                    <div>
                      <div className="font-medium">Ingresar Coordenadas</div>
                      <div className="text-xs text-white/40">Pega datos de GPS o campo</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Manual input panel */}
              {mode === 'manual' && (
                <div className="space-y-3">
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-white/50 text-xs mb-2 font-medium">Radio circular (metros)</p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={manualRadius}
                        onChange={(e) => setManualRadius(e.target.value)}
                        placeholder="Ej: 500"
                        className="flex-1 bg-inca-dark/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-inca-gold/50"
                      />
                      <button
                        onClick={applyManualRadius}
                        disabled={!manualRadius}
                        className="px-3 py-2 bg-inca-gold/20 text-inca-gold rounded-lg text-xs hover:bg-inca-gold/30 transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
                      >
                        Aplicar
                      </button>
                    </div>
                    <p className="text-white/25 text-xs mt-1">Se centrará en el punto GPS registrado</p>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <p className="text-white/50 text-xs mb-2 font-medium">Vértices del polígono</p>
                    <p className="text-white/25 text-xs mb-2">Una coordenada por línea: lat,lng</p>
                    <textarea
                      value={manualPoints}
                      onChange={(e) => setManualPoints(e.target.value)}
                      placeholder={`-10.6626,-75.3558\n-10.6630,-75.3540\n-10.6610,-75.3535\n-10.6605,-75.3560`}
                      rows={6}
                      className="w-full bg-inca-dark/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-inca-gold/50 resize-none font-mono"
                    />
                    <button
                      onClick={applyManualPolygon}
                      className="w-full mt-2 px-3 py-2 bg-inca-gold/20 text-inca-gold rounded-lg text-xs hover:bg-inca-gold/30 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Aplicar Polígono
                    </button>
                  </div>
                </div>
              )}

              {/* Current perimeter info */}
              {currentType && currentData && (
                <div className="border-t border-white/10 pt-3">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Perímetro actual</p>
                  <div className="bg-inca-dark/50 rounded-lg p-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Tipo</span>
                      <span className="text-white/70 capitalize">{currentType === 'polygon' ? 'Polígono' : 'Círculo'}</span>
                    </div>
                    {currentType === 'circle' && currentData.radius && (
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Radio</span>
                        <span className="text-inca-gold font-mono">{currentData.radius} m</span>
                      </div>
                    )}
                    {currentType === 'polygon' && currentData.points && (
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Vértices</span>
                        <span className="text-inca-gold font-mono">{currentData.points.length}</span>
                      </div>
                    )}
                    {areaHa > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Área</span>
                        <span className="text-emerald-400 font-mono font-semibold">{formatArea(areaHa)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Info message */}
              {infoMsg && (
                <div className={`text-xs px-3 py-2 rounded-lg ${
                  infoMsg.startsWith('⚠')
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                    : 'bg-inca-gold/10 border border-inca-gold/20 text-inca-gold/80'
                }`}>
                  {infoMsg}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="mt-auto p-4 border-t border-white/10 space-y-2">
              {currentType && currentData && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-inca-gold text-inca-dark font-semibold py-2.5 rounded-lg text-sm hover:bg-inca-gold/90 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {saving ? (
                    <><span className="animate-spin inline-block w-4 h-4 border-2 border-inca-dark/40 border-t-inca-dark rounded-full" /> Guardando...</>
                  ) : (
                    <><i className="ri-save-line" /> Guardar Perímetro</>
                  )}
                </button>
              )}
              {currentType && (
                <button
                  onClick={handleClearPerimeter}
                  className="w-full flex items-center justify-center gap-2 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 py-2 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-eraser-line" /> Limpiar
                </button>
              )}
              {existingType && (
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line" /> Eliminar Perímetro
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full text-white/30 hover:text-white/50 text-xs py-1 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            {!mapReady ? (
              <div className="w-full h-full flex items-center justify-center text-white/30 flex-col gap-3">
                <span className="animate-spin inline-block w-8 h-8 border-2 border-inca-gold/30 border-t-inca-gold rounded-full" />
                <span className="text-sm">Cargando mapa...</span>
              </div>
            ) : (
              <div ref={mapRef} className="w-full h-full" />
            )}

            {/* Drawing hint overlay */}
            {(mode === 'polygon' || mode === 'circle') && !currentData && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/75 text-white/80 text-xs px-4 py-2 rounded-full pointer-events-none z-10 text-center max-w-xs">
                {mode === 'polygon'
                  ? 'Click para agregar vértices · Click en el primer punto para cerrar'
                  : 'Click y arrastra para definir el radio del círculo'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
