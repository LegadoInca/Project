const stockAlerts = [
  { label: 'Geisha Washed', amount: '12 kg — CRÍTICO', pct: 10 },
  { label: 'Café Natural', amount: '45 kg — Bajo', pct: 30 },
  { label: 'Cacao CCN-51', amount: '780 kg — OK', pct: 90 },
];

const salesData = [
  { week: 'S1', holzen: 4200, coya: 800, craft: 600 },
  { week: 'S2', holzen: 5100, coya: 900, craft: 700 },
  { week: 'S3', holzen: 3800, coya: 750, craft: 500 },
  { week: 'S4', holzen: 6200, coya: 1100, craft: 900 },
  { week: 'S5', holzen: 5800, coya: 1000, craft: 800 },
  { week: 'S6', holzen: 7100, coya: 1300, craft: 950 },
  { week: 'S7', holzen: 6500, coya: 1200, craft: 850 },
  { week: 'S8', holzen: 8200, coya: 1400, craft: 1100 },
];

const maxVal = Math.max(...salesData.map(d => d.holzen + d.coya + d.craft));

export default function DashboardTab() {
  return (
    <div>
      <div className="portal-header">
        <div>
          <h1>Dashboard CEO</h1>
          <div className="text-white/40 text-sm">domingo, 29 de marzo de 2026</div>
        </div>
      </div>

      <div className="alert-box warn">
        ⚠ <strong>Pago pendiente:</strong> PROV-001 Coop. Villa Rica — S/3,500 (70% restante) vence en 5 días
      </div>
      <div className="alert-box warn">
        ⚠ <strong>Pago pendiente:</strong> PROV-002 Fam. Quispe — S/1,750 (30% adelanto) aún no enviado
      </div>

      <div className="kpi-row">
        <div className="kpi k-gold">
          <div className="kpi-lbl">Ventas Europa · Mes</div>
          <div className="kpi-val"><sup>€</sup>24,380</div>
          <div className="kpi-chg up">↑ 18% vs mes anterior</div>
        </div>
        <div className="kpi k-blue">
          <div className="kpi-lbl">Pedidos Activos</div>
          <div className="kpi-val">14</div>
          <div className="kpi-chg warn">⚠ 3 pendientes confirmación</div>
        </div>
        <div className="kpi k-green">
          <div className="kpi-lbl">Stock Praga</div>
          <div className="kpi-val">842<sup> kg</sup></div>
          <div className="kpi-chg down">↓ Geisha nivel bajo</div>
        </div>
        <div className="kpi k-amber">
          <div className="kpi-lbl">Por Pagar Proveedores</div>
          <div className="kpi-val"><sup>S/</sup>8,750</div>
          <div className="kpi-chg warn">⚠ 2 pagos pendientes</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart */}
        <div className="panel">
          <div className="panel-hdr">
            <span className="panel-title">Ventas por Producto — 8 semanas</span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {salesData.map((d) => {
              const total = d.holzen + d.coya + d.craft;
              const pct = (total / maxVal) * 100;
              return (
                <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end" style={{ height: '120px' }}>
                    <div
                      className="w-full bg-inca-gold/70 rounded-t"
                      style={{ height: `${(d.holzen / maxVal) * 120}px` }}
                    />
                    <div
                      className="w-full bg-emerald-500/50"
                      style={{ height: `${(d.coya / maxVal) * 120}px` }}
                    />
                    <div
                      className="w-full bg-amber-500/40"
                      style={{ height: `${(d.craft / maxVal) * 120}px` }}
                    />
                  </div>
                  <span className="text-white/30 text-[10px]">{d.week}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs text-white/50"><span className="w-3 h-2 bg-inca-gold/70 rounded inline-block" />HOLZEN</span>
            <span className="flex items-center gap-1 text-xs text-white/50"><span className="w-3 h-2 bg-emerald-500/50 rounded inline-block" />COYA</span>
            <span className="flex items-center gap-1 text-xs text-white/50"><span className="w-3 h-2 bg-amber-500/40 rounded inline-block" />Artesanías</span>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="panel">
          <div className="panel-hdr">
            <span className="panel-title">Alertas Stock Praga</span>
          </div>
          <div className="space-y-4">
            {stockAlerts.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">{s.label}</span>
                  <span className={`text-xs font-medium ${s.pct < 20 ? 'text-red-400' : s.pct < 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {s.amount}
                  </span>
                </div>
                <div className="prog-bar-wrap">
                  <div
                    className={`prog-bar-fill ${s.pct < 20 ? 'bg-red-500' : s.pct < 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
