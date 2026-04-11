import { useState } from 'react';

const ingresosData = [
  { mes: 'Ene', val: 14200 }, { mes: 'Feb', val: 17800 }, { mes: 'Mar', val: 15400 },
  { mes: 'Abr', val: 21000 }, { mes: 'May', val: 19500 }, { mes: 'Jun', val: 24380 },
];
const gastosData = [
  { mes: 'Ene', val: 4200 }, { mes: 'Feb', val: 5100 }, { mes: 'Mar', val: 4500 },
  { mes: 'Abr', val: 6200 }, { mes: 'May', val: 5800 }, { mes: 'Jun', val: 7100 },
];

const maxI = Math.max(...ingresosData.map(d => d.val));
const maxG = Math.max(...gastosData.map(d => d.val));

type SubTab = 'ingresos' | 'gastos' | 'gastos-cz';

const gastosCheco = [
  { fecha: '05 Jun', tipo: 'Flete', desc: 'Rotterdam → Praga', monto: '€420' },
  { fecha: '28 May', tipo: 'Aduana', desc: 'Despacho CTR-2025-02', monto: '€180' },
];

export default function FinanzasTab() {
  const [sub, setSub] = useState<SubTab>('ingresos');

  return (
    <div>
      <div className="portal-header"><h1>Finanzas</h1></div>

      <div className="kpi-row">
        <div className="kpi k-gold"><div className="kpi-lbl">Cash Disponible</div><div className="kpi-val"><sup>$</sup>18,240</div></div>
        <div className="kpi k-blue"><div className="kpi-lbl">Por Cobrar Europa</div><div className="kpi-val"><sup>€</sup>9,120</div></div>
        <div className="kpi k-red"><div className="kpi-lbl">Por Pagar Proveedores</div><div className="kpi-val"><sup>S/</sup>8,750</div></div>
      </div>

      <div className="tab-switcher">
        {(['ingresos', 'gastos', 'gastos-cz'] as SubTab[]).map((t) => (
          <button
            key={t}
            className={`tab-btn ${sub === t ? 'active' : ''}`}
            onClick={() => setSub(t)}
          >
            {t === 'ingresos' ? '📈 Ingresos' : t === 'gastos' ? '📉 Gastos' : '🇨🇿 Gastos R. Checa'}
          </button>
        ))}
      </div>

      {sub === 'ingresos' && (
        <div className="panel">
          <div className="panel-hdr"><span className="panel-title">Ingresos Europa — 2025</span></div>
          <div className="flex items-end gap-3 h-48">
            {ingresosData.map((d) => (
              <div key={d.mes} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-inca-gold text-xs font-medium">€{(d.val/1000).toFixed(1)}K</div>
                <div className="w-full bg-inca-gold/60 rounded-t" style={{ height: `${(d.val/maxI)*160}px` }} />
                <span className="text-white/40 text-xs">{d.mes}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sub === 'gastos' && (
        <div className="panel">
          <div className="panel-hdr"><span className="panel-title">Gastos Operativos — 2025</span></div>
          <div className="flex items-end gap-3 h-48">
            {gastosData.map((d) => (
              <div key={d.mes} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-red-400 text-xs font-medium">€{(d.val/1000).toFixed(1)}K</div>
                <div className="w-full bg-red-500/50 rounded-t" style={{ height: `${(d.val/maxG)*160}px` }} />
                <span className="text-white/40 text-xs">{d.mes}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sub === 'gastos-cz' && (
        <div className="panel">
          <div className="panel-hdr"><span className="panel-title">Gastos República Checa</span></div>
          <div className="alert-box info">ℹ Gastos ingresados desde el portal de Praga.</div>
          <table className="data-table">
            <thead><tr><th>Fecha</th><th>Tipo</th><th>Descripción</th><th>Monto</th></tr></thead>
            <tbody>
              {gastosCheco.map((g, i) => (
                <tr key={i}>
                  <td>{g.fecha}</td><td>{g.tipo}</td><td>{g.desc}</td>
                  <td className="text-red-400">{g.monto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
