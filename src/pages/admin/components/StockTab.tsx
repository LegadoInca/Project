const stockItems = [
  { producto: 'Geisha Washed', lote: '#VR-2025-02', disponible: '12 kg ⚠', reservado: '20 kg', precio: '€28', estado: 'Crítico', badgeClass: 'err' },
  { producto: 'Café Natural', lote: '#CH-2025-01', disponible: '45 kg', reservado: '35 kg', precio: '€18', estado: 'Bajo', badgeClass: 'warn' },
  { producto: 'Café Honey', lote: '#MZ-2025-03', disponible: '180 kg', reservado: '60 kg', precio: '€16', estado: 'OK', badgeClass: 'ok' },
  { producto: 'Cacao CCN-51', lote: '#SM-2025-05', disponible: '780 kg', reservado: '50 kg', precio: '€4.20', estado: 'OK', badgeClass: 'ok' },
];

export default function StockTab() {
  return (
    <div>
      <div className="portal-header"><h1>Inventario</h1></div>
      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">Stock Almacén Praga</span></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th><th>Lote</th><th>Disponible</th><th>Reservado</th><th>€/kg</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map((s) => (
                <tr key={s.lote}>
                  <td>{s.producto}</td>
                  <td className="font-mono text-xs text-white/50">{s.lote}</td>
                  <td>{s.disponible}</td>
                  <td>{s.reservado}</td>
                  <td>{s.precio}</td>
                  <td><span className={`badge ${s.badgeClass}`}><span className="badge-dot" />{s.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
