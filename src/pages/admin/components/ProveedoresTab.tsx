const proveedores = [
  { codigo: 'PROV-001', nombre: 'Coop. Villa Rica', region: 'Pasco', producto: 'Café Geisha', lotes: 2, saldo: 'S/ 3,500' },
  { codigo: 'PROV-002', nombre: 'Fam. Quispe Mamani', region: 'Junín', producto: 'Café Natural', lotes: 1, saldo: 'S/ 1,750 (adelanto)' },
  { codigo: 'PROV-003', nombre: 'Agro Monzón SAC', region: 'Huánuco', producto: 'Café Honey', lotes: 1, saldo: 'Al día' },
  { codigo: 'PROV-004', nombre: 'Com. Shipibo-Konibo', region: 'Ucayali', producto: 'Artesanías', lotes: 1, saldo: 'Al día' },
];

export default function ProveedoresTab() {
  return (
    <div>
      <div className="portal-header"><h1>Proveedores</h1></div>
      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">Proveedores Registrados</span></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th><th>Nombre</th><th>Región</th><th>Producto</th><th>Lotes Activos</th><th>Saldo Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((p) => (
                <tr key={p.codigo}>
                  <td className="text-inca-gold font-mono text-xs">{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.region}</td>
                  <td>{p.producto}</td>
                  <td>{p.lotes}</td>
                  <td className={p.saldo === 'Al día' ? 'text-emerald-400' : 'text-amber-400'}>{p.saldo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
