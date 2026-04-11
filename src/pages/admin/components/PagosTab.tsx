import { useState } from 'react';

const bankData: Record<string, { banco: string; cuenta: string }> = {
  'PROV-001': { banco: 'BCP', cuenta: '191-XXXX-XXX' },
  'PROV-002': { banco: 'Interbank', cuenta: '200-XXXX-XXX' },
  'PROV-003': { banco: 'BBVA', cuenta: '011-XXXX-XXX' },
  'PROV-004': { banco: 'Scotiabank', cuenta: '032-XXXX-XXX' },
};

const historial = [
  { prov: 'PROV-001', tipo: '30%', monto: 'S/1,500', estado: 'Enviado', badgeClass: 'ok', fecha: '01 Jun' },
  { prov: 'PROV-001', tipo: '70%', monto: 'S/3,500', estado: 'Pendiente', badgeClass: 'warn', fecha: '—' },
  { prov: 'PROV-003', tipo: '100%', monto: 'S/4,200', estado: 'Pagado', badgeClass: 'ok', fecha: '15 May' },
  { prov: 'PROV-002', tipo: '30%', monto: 'S/1,750', estado: 'No enviado', badgeClass: 'err', fecha: '—' },
];

export default function PagosTab() {
  const [prov, setProv] = useState('');
  const [tipo, setTipo] = useState('');
  const [total, setTotal] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const bank = bankData[prov];
  const monto = tipo && total ? (parseFloat(total) * parseInt(tipo) / 100).toFixed(2) : '';

  return (
    <div>
      <div className="portal-header"><h1>Pagos a Proveedores</h1></div>

      <div className="alert-box warn">⚠ PROV-001: S/3,500 (70%) vence en 5 días</div>
      <div className="alert-box err">❌ PROV-002: Adelanto S/1,750 aún NO enviado</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="panel">
          <div className="panel-hdr"><span className="panel-title">Realizar Pago</span></div>
          <div className="f-group">
            <label className="f-label">Proveedor</label>
            <select className="f-select" value={prov} onChange={(e) => setProv(e.target.value)}>
              <option value="">-- Selecciona --</option>
              <option value="PROV-001">PROV-001 · Coop. Villa Rica</option>
              <option value="PROV-002">PROV-002 · Fam. Quispe</option>
              <option value="PROV-003">PROV-003 · Agro Monzón</option>
              <option value="PROV-004">PROV-004 · Com. Shipibo</option>
            </select>
          </div>
          {bank && (
            <div className="bg-inca-dark/40 rounded-lg p-3 mb-4 border border-inca-gold/10">
              <div className="text-white/40 text-xs mb-2 uppercase tracking-wider">Datos Bancarios</div>
              <div className="flex gap-6 text-sm">
                <div><span className="text-white/40">Banco: </span><span className="text-white">{bank.banco}</span></div>
                <div><span className="text-white/40">Cuenta: </span><span className="text-white">{bank.cuenta}</span></div>
              </div>
            </div>
          )}
          <div className="f-grid-2">
            <div className="f-group">
              <label className="f-label">Tipo de Pago</label>
              <select className="f-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">-- Selecciona --</option>
                <option value="30">30% Adelanto</option>
                <option value="70">70% Saldo</option>
                <option value="100">100%</option>
              </select>
            </div>
            <div className="f-group">
              <label className="f-label">Total Lote (S/)</label>
              <input className="f-input" type="number" placeholder="Ej: 5000" value={total} onChange={(e) => setTotal(e.target.value)} />
            </div>
          </div>
          <div className="f-group">
            <label className="f-label">Monto a Transferir</label>
            <input className="f-input" readOnly value={monto ? `S/ ${monto}` : ''} placeholder="Calculado automáticamente" />
          </div>
          {confirmed && <div className="alert-box ok">✅ Transferencia confirmada.</div>}
          <button className="btn-gold" onClick={() => setConfirmed(true)}>Confirmar Transferencia →</button>
        </div>

        <div className="panel">
          <div className="panel-hdr"><span className="panel-title">Historial de Pagos</span></div>
          <table className="data-table">
            <thead><tr><th>Proveedor</th><th>Tipo</th><th>Monto</th><th>Estado</th><th>Fecha</th></tr></thead>
            <tbody>
              {historial.map((h, i) => (
                <tr key={i}>
                  <td className="text-inca-gold text-xs font-mono">{h.prov}</td>
                  <td>{h.tipo}</td>
                  <td>{h.monto}</td>
                  <td><span className={`badge ${h.badgeClass}`}><span className="badge-dot" />{h.estado}</span></td>
                  <td className="text-white/40 text-xs">{h.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
