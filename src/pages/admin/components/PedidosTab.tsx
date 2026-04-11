const pedidos = [
  { id: '#ORD-0041', cliente: 'Café Savoy, Praga', producto: 'Geisha Washed', kg: 20, total: '€560', estado: 'En tránsito', badgeClass: 'warn', fecha: '12 Jun 2025' },
  { id: '#ORD-0040', cliente: 'Hotel Aria, Praga', producto: 'Cacao Chuncho', kg: 50, total: '€325', estado: 'Confirmado', badgeClass: 'ok', fecha: '10 Jun 2025' },
  { id: '#ORD-0039', cliente: 'Nomad Coffee, Berlín', producto: 'Café Natural', kg: 35, total: '€630', estado: 'Entregado', badgeClass: 'ok', fecha: '05 Jun 2025' },
  { id: '#ORD-0038', cliente: 'Pronto Espresso, Viena', producto: 'Café Honey', kg: 60, total: '€960', estado: 'Pendiente', badgeClass: 'pend', fecha: '02 Jun 2025' },
];

export default function PedidosTab() {
  return (
    <div>
      <div className="portal-header"><h1>Pedidos</h1></div>
      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">Todos los Pedidos</span></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pedido</th><th>Cliente</th><th>Producto</th><th>Kg</th><th>Total</th><th>Estado</th><th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td className="text-inca-gold font-mono text-xs">{p.id}</td>
                  <td>{p.cliente}</td>
                  <td>{p.producto}</td>
                  <td>{p.kg}</td>
                  <td>{p.total}</td>
                  <td>
                    <span className={`badge ${p.badgeClass}`}>
                      <span className="badge-dot" />{p.estado}
                    </span>
                  </td>
                  <td className="text-white/40 text-xs">{p.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
