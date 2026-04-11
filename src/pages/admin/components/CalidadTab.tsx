import { useState } from 'react';

const lotes = [
  { lote: '#VR-2025-04', prov: 'PROV-001', producto: 'Geisha Washed', humedad: '11.2%', sca: '88 pts', defectos: 'Ninguno', resultado: 'Aprobado', badgeClass: 'ok' },
  { lote: '#CH-2025-02', prov: 'PROV-002', producto: 'Natural Bourbon', humedad: '12.0%', sca: '84 pts', defectos: 'Broca leve', resultado: 'Obs. menores', badgeClass: 'warn' },
  { lote: '#MZ-2025-03', prov: 'PROV-003', producto: 'Honey', humedad: '10.8%', sca: '83 pts', defectos: 'Ninguno', resultado: 'Aprobado', badgeClass: 'ok' },
];

export default function CalidadTab() {
  const [humedad, setHumedad] = useState('');
  const [defectos, setDefectos] = useState('');
  const [saved, setSaved] = useState(false);

  const getCalidad = () => {
    const h = parseFloat(humedad);
    if (!humedad) return null;
    if (h > 13 || defectos.toLowerCase().includes('crítico')) return 'fail';
    return 'ok';
  };

  const calidad = getCalidad();

  return (
    <div>
      <div className="portal-header"><h1>Control de Calidad</h1></div>

      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">Parámetros de Calidad</span></div>
        <div className="alert-box info">ℹ Los parámetros los ingresa el equipo de control de calidad en Lima.</div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Lote</th><th>Proveedor</th><th>Producto</th><th>Humedad</th><th>SCA</th><th>Defectos</th><th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map((l) => (
                <tr key={l.lote}>
                  <td className="font-mono text-xs text-inca-gold">{l.lote}</td>
                  <td>{l.prov}</td>
                  <td>{l.producto}</td>
                  <td>{l.humedad}</td>
                  <td>{l.sca}</td>
                  <td>{l.defectos}</td>
                  <td><span className={`badge ${l.badgeClass}`}><span className="badge-dot" />{l.resultado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">Registrar Evaluación de Calidad</span></div>
        <div className="f-grid-3">
          <div className="f-group">
            <label className="f-label">Lote</label>
            <input className="f-input" placeholder="#VR-2025-XX" />
          </div>
          <div className="f-group">
            <label className="f-label">Proveedor</label>
            <select className="f-select">
              <option>PROV-001</option><option>PROV-002</option><option>PROV-003</option><option>PROV-004</option>
            </select>
          </div>
          <div className="f-group">
            <label className="f-label">% Humedad</label>
            <input className="f-input" type="number" step="0.1" placeholder="Ej: 11.5" value={humedad} onChange={(e) => setHumedad(e.target.value)} />
          </div>
        </div>
        <div className="f-grid-3">
          <div className="f-group">
            <label className="f-label">Puntaje SCA</label>
            <input className="f-input" type="number" placeholder="Ej: 86" />
          </div>
          <div className="f-group">
            <label className="f-label">Defectos</label>
            <input className="f-input" placeholder="Ej: Broca leve" value={defectos} onChange={(e) => setDefectos(e.target.value)} />
          </div>
          <div className="f-group">
            <label className="f-label">Resultado</label>
            <input className="f-input" readOnly value={calidad === 'ok' ? 'Aprobado' : calidad === 'fail' ? 'NO COMPRAR' : ''} placeholder="Automático" />
          </div>
        </div>
        {calidad === 'fail' && (
          <div className="alert-box err">❌ NO COMPRAR — Humedad supera 13% o defectos críticos.</div>
        )}
        {calidad === 'ok' && (
          <div className="alert-box ok">✅ Calidad dentro de parámetros. Lote aprobado.</div>
        )}
        {saved && <div className="alert-box ok">✅ Evaluación guardada.</div>}
        <button className="btn-gold" onClick={() => setSaved(true)}>Guardar Evaluación →</button>
      </div>
    </div>
  );
}
