export default function ContratosTab() {
  return (
    <div>
      <div className="portal-header"><h1>Contratos</h1></div>

      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">Contratos Activos</span></div>
        <div className="space-y-4">
          {[
            { codigo: 'PROV-001 · Coop. Villa Rica', contrato: 'Contrato #CTR-2025-001 · Café Geisha', banco: 'BCP', cuenta: '191-XXXX-XXX', precio: 'S/28.00' },
            { codigo: 'PROV-002 · Fam. Quispe Mamani', contrato: 'Contrato #CTR-2025-002 · Café Natural', banco: 'Interbank', cuenta: '200-XXXX-XXX', precio: 'S/22.00' },
          ].map((c) => (
            <div key={c.codigo} className="border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-white font-medium text-sm">{c.codigo}</div>
                  <div className="text-white/40 text-xs">{c.contrato}</div>
                </div>
                <span className="badge ok"><span className="badge-dot" />Vigente</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><div className="text-white/40 text-xs">Banco</div><div className="text-white text-sm">{c.banco}</div></div>
                <div><div className="text-white/40 text-xs">Cuenta</div><div className="text-white text-sm">{c.cuenta}</div></div>
                <div><div className="text-white/40 text-xs">Precio/kg</div><div className="text-inca-gold text-sm font-medium">{c.precio}</div></div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn-outline-gold mt-4" onClick={() => alert('Generando contrato...')}>+ Generar Nuevo Contrato</button>
      </div>

      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">Modelo de Contrato</span></div>
        <div className="bg-inca-dark/40 rounded-lg p-5 text-sm text-white/70 space-y-2 font-mono">
          <div className="text-inca-gold font-bold">CONTRATO DE COMPRA-VENTA</div>
          <p><strong>Partes:</strong> Legado Inca SRL (COMPRADOR) — [Proveedor] (VENDEDOR)</p>
          <p><strong>Precio y Pago:</strong> S/ [X] por kg. Adelanto 30%. Saldo 70% contra entrega.</p>
          <p><strong>Calidad:</strong> Humedad ≤13%, libre de defectos primarios.</p>
        </div>
        <button className="btn-gold mt-4" onClick={() => alert('Descargando modelo...')}>Descargar Modelo DOCX →</button>
      </div>
    </div>
  );
}
