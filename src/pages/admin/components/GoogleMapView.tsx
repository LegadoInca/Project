import { useEffect, useRef, useState, useCallback } from 'react';
import { PerimeterType, PerimeterData } from '@/hooks/useSupabaseLocations';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google: any;
    initGoogleMap?: () => void;
    gm_authFailure?: () => void;
  }
}

type MapTypeId = 'satellite' | 'roadmap' | 'terrain' | 'hybrid';

interface GoogleMapViewProps {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
  perimeterType?: PerimeterType;
  perimeterData?: PerimeterData;
}

const GMAPS_KEY = import.meta.env.VITE_PUBLIC_GMAPS_KEY as string;

let scriptLoaded = false;
let scriptLoading = false;
let scriptError = false;
const callbacks: (() => void)[] = [];
const errorCallbacks: (() => void)[] = [];

function loadGoogleMapsScript(onSuccess: () => void, onError: () => void) {
  if (scriptLoaded) { onSuccess(); return; }
  if (scriptError) { onError(); return; }
  callbacks.push(onSuccess);
  errorCallbacks.push(onError);
  if (scriptLoading) return;
  scriptLoading = true;

  // Auth failure handler (invalid key / API not enabled)
  window.gm_authFailure = () => {
    scriptError = true;
    scriptLoading = false;
    errorCallbacks.forEach((fn) => fn());
    errorCallbacks.length = 0;
  };

  window.initGoogleMap = () => {
    scriptLoaded = true;
    scriptLoading = false;
    callbacks.forEach((fn) => fn());
    callbacks.length = 0;
  };

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&callback=initGoogleMap&libraries=streetview`;
  script.async = true;
  script.defer = true;
  script.onerror = () => {
    scriptError = true;
    scriptLoading = false;
    errorCallbacks.forEach((fn) => fn());
    errorCallbacks.length = 0;
  };
  document.head.appendChild(script);
}

export default function GoogleMapView({ lat, lng, zoom = 14, height = 'h-80', perimeterType, perimeterData }: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const svPanoramaRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const trafficLayerRef = useRef<any>(null);
  const perimeterShapeRef = useRef<any>(null);

  const [ready, setReady] = useState(scriptLoaded);
  const [mapError, setMapError] = useState(scriptError);
  const [mapTypeId, setMapTypeId] = useState<MapTypeId>('hybrid');
  const [streetViewActive, setStreetViewActive] = useState(false);
  const [trafficActive, setTrafficActive] = useState(false);
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [svError, setSvError] = useState('');

  useEffect(() => {
    if (!scriptLoaded && !scriptError) {
      loadGoogleMapsScript(
        () => setReady(true),
        () => setMapError(true),
      );
    }
  }, []);

  // Init map
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom,
      mapTypeId,
      disableDefaultUI: false,
      streetViewControl: true,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title: 'Parcela',
    });

    trafficLayerRef.current = new window.google.maps.TrafficLayer();

    const panorama = map.getStreetView();
    svPanoramaRef.current = panorama;
    panorama.addListener('visible_changed', () => {
      setStreetViewActive(panorama.getVisible());
    });

    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
      if (trafficLayerRef.current) trafficLayerRef.current.setMap(null);
    };
  }, [ready]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setCenter({ lat, lng });
    mapInstanceRef.current.setZoom(zoom);
    if (markerRef.current) markerRef.current.setPosition({ lat, lng });
  }, [lat, lng, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setMapTypeId(mapTypeId);
  }, [mapTypeId]);

  useEffect(() => {
    if (!trafficLayerRef.current || !mapInstanceRef.current) return;
    trafficLayerRef.current.setMap(trafficActive ? mapInstanceRef.current : null);
  }, [trafficActive]);

  const handleStreetViewToggle = useCallback(() => {
    const panorama = svPanoramaRef.current;
    const map = mapInstanceRef.current;
    if (!panorama || !map) return;
    setSvError('');

    if (streetViewActive) {
      panorama.setVisible(false);
      setStreetViewActive(false);
    } else {
      const center = map.getCenter();
      if (!center) return;
      const sv = new window.google.maps.StreetViewService();
      sv.getPanorama(
        { location: center, radius: 5000, preference: 'nearest' },
        (data: any, status: string) => {
          if (status === 'OK' && data?.location?.latLng) {
            panorama.setPosition(data.location.latLng);
            panorama.setPov({ heading: 0, pitch: 0 });
            panorama.setVisible(true);
          } else {
            setSvError('No hay Street View disponible cerca de este punto. Mové el mapa hacia una ruta o carretera y volvé a intentar.');
            setTimeout(() => setSvError(''), 5000);
          }
        }
      );
    }
  }, [streetViewActive]);

  const clearPerimeterShape = useCallback(() => {
    if (perimeterShapeRef.current) {
      perimeterShapeRef.current.setMap(null);
      perimeterShapeRef.current = null;
    }
  }, []);

  const drawPerimeter = useCallback((map: any, type: PerimeterType, data: PerimeterData) => {
    clearPerimeterShape();
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
      perimeterShapeRef.current = poly;
      // Fit bounds to polygon
      const bounds = new window.google.maps.LatLngBounds();
      data.points.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds, 40);
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
      perimeterShapeRef.current = circle;
      map.fitBounds(circle.getBounds(), 40);
    }
  }, [clearPerimeterShape, lat, lng]);

  // Draw perimeter when it changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (perimeterType && perimeterData) {
      drawPerimeter(mapInstanceRef.current, perimeterType, perimeterData);
    } else {
      clearPerimeterShape();
    }
  }, [perimeterType, perimeterData, drawPerimeter, clearPerimeterShape]);

  const MAP_TYPES: { id: MapTypeId; label: string; icon: string }[] = [
    { id: 'roadmap', label: 'Mapa', icon: 'ri-road-map-line' },
    { id: 'hybrid', label: 'Satélite', icon: 'ri-earth-line' },
    { id: 'terrain', label: 'Terreno', icon: 'ri-landscape-line' },
  ];

  // ── Error state ──
  if (mapError) {
    return (
      <div className={`w-full ${height} bg-inca-dark/40 rounded-lg flex flex-col items-center justify-center gap-4 px-6 text-center`}>
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/20">
          <i className="ri-map-2-line text-2xl text-red-400" />
        </div>
        <div>
          <p className="text-white/70 text-sm font-semibold mb-1">No se pudo cargar Google Maps</p>
          <p className="text-white/40 text-xs leading-relaxed">
            La API Key necesita tener habilitada la <strong className="text-white/60">Maps JavaScript API</strong> en Google Cloud Console.
          </p>
        </div>
        <div className="bg-inca-dark/60 rounded-lg px-4 py-3 text-left w-full max-w-xs">
          <p className="text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">Cómo habilitarla:</p>
          <ol className="text-white/40 text-xs space-y-1 list-decimal list-inside leading-relaxed">
            <li>Ir a <span className="text-inca-gold">console.cloud.google.com</span></li>
            <li>APIs y servicios → Biblioteca</li>
            <li>Buscar <span className="text-white/60">"Maps JavaScript API"</span></li>
            <li>Click en <span className="text-white/60">Habilitar</span></li>
            <li>Recargar esta página</li>
          </ol>
        </div>
        <a
          href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
          target="_blank"
          rel="noreferrer"
          className="text-inca-gold text-xs hover:underline flex items-center gap-1"
        >
          Ir a Google Cloud Console <i className="ri-external-link-line" />
        </a>
      </div>
    );
  }

  // ── Loading state ──
  if (!ready) {
    return (
      <div className={`w-full ${height} bg-inca-dark/40 rounded-lg flex flex-col items-center justify-center gap-3 text-white/40`}>
        <span className="animate-spin inline-block w-8 h-8 border-2 border-inca-gold/30 border-t-inca-gold rounded-full" />
        <span className="text-sm">Cargando Google Maps...</span>
      </div>
    );
  }

  return (
    <div className={`w-full ${height} rounded-lg overflow-hidden relative`}>
      <div ref={mapRef} className="w-full h-full" />

      {/* Street View error toast */}
      {svError && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/80 text-white/80 text-xs px-3 py-2 rounded-lg max-w-xs text-center z-20 pointer-events-none">
          {svError}
        </div>
      )}

      {/* Layers panel button */}
      <div className="absolute bottom-24 left-2 z-10">
        <button
          onClick={() => setLayersPanelOpen((v) => !v)}
          className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
          title="Capas del mapa"
        >
          <i className="ri-stack-line text-gray-600 text-lg" />
          <span className="text-[9px] text-gray-500 font-medium leading-none mt-0.5">Capas</span>
        </button>

        {layersPanelOpen && (
          <div
            className="absolute bottom-14 left-0 bg-white rounded-xl overflow-hidden"
            style={{ width: 260, boxShadow: '0 4px 20px rgba(0,0,0,0.35)' }}
          >
            <div className="px-3 pt-3 pb-2">
              <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Tipo de mapa</div>
              <div className="flex gap-2">
                {MAP_TYPES.map((mt) => (
                  <button
                    key={mt.id}
                    onClick={() => setMapTypeId(mt.id)}
                    className="flex flex-col items-center gap-1 cursor-pointer group flex-1"
                  >
                    <div className={`w-full h-12 rounded-lg border-2 flex items-center justify-center transition-all ${mapTypeId === mt.id ? 'border-[#1a73e8] bg-[#e8f0fe]' : 'border-gray-200 bg-gray-50 group-hover:border-gray-300'}`}>
                      <i className={`${mt.icon} text-xl`} style={{ color: mapTypeId === mt.id ? '#1a73e8' : '#9e9e9e' }} />
                    </div>
                    <span className={`text-[10px] font-medium whitespace-nowrap ${mapTypeId === mt.id ? 'text-[#1a73e8]' : 'text-gray-500'}`}>{mt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 mx-3" />

            <div className="px-3 pt-2 pb-3">
              <div className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Detalles del mapa</div>
              <div className="flex gap-2">
                <button
                  onClick={() => { handleStreetViewToggle(); setLayersPanelOpen(false); }}
                  className="flex flex-col items-center gap-1 cursor-pointer group flex-1"
                >
                  <div className={`w-full h-12 rounded-lg border-2 flex items-center justify-center transition-all ${streetViewActive ? 'border-[#1a73e8] bg-[#e8f0fe]' : 'border-gray-200 bg-gray-50 group-hover:border-gray-300'}`}>
                    <i className="ri-walk-line text-xl" style={{ color: streetViewActive ? '#4fc3f7' : '#9e9e9e' }} />
                  </div>
                  <span className={`text-[10px] font-medium whitespace-nowrap ${streetViewActive ? 'text-[#1a73e8]' : 'text-gray-500'}`}>Street View</span>
                </button>

                <button
                  onClick={() => setTrafficActive((v) => !v)}
                  className="flex flex-col items-center gap-1 cursor-pointer group flex-1"
                >
                  <div className={`w-full h-12 rounded-lg border-2 flex items-center justify-center transition-all ${trafficActive ? 'border-[#1a73e8] bg-[#e8f0fe]' : 'border-gray-200 bg-gray-50 group-hover:border-gray-300'}`}>
                    <i className="ri-traffic-light-line text-xl" style={{ color: trafficActive ? '#ef5350' : '#9e9e9e' }} />
                  </div>
                  <span className={`text-[10px] font-medium whitespace-nowrap ${trafficActive ? 'text-[#1a73e8]' : 'text-gray-500'}`}>Tráfico</span>
                </button>
              </div>

              {!streetViewActive && (
                <p className="text-[10px] text-gray-400 mt-2 leading-tight">
                  Street View busca el punto más cercano disponible y te lleva directo.
                </p>
              )}
              {streetViewActive && (
                <p className="text-[10px] text-[#1a73e8] mt-2 leading-tight font-medium">
                  Activo — arrastrá el muñeco naranja o hacé click en las líneas azules.
                </p>
              )}
            </div>

            <div
              className="bg-gray-50 border-t border-gray-100 px-3 py-1.5 text-[10px] text-gray-400 text-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setLayersPanelOpen(false)}
            >
              Cerrar
            </div>
          </div>
        )}
      </div>

      {streetViewActive && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#1a73e8] text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none z-10">
          <i className="ri-walk-line" />
          Street View activo — arrastrá para explorar
        </div>
      )}

      {/* Backdrop */}
      {layersPanelOpen && (
        <div className="absolute inset-0 z-[5]" onClick={() => setLayersPanelOpen(false)} />
      )}
    </div>
  );
}
