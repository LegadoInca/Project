import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendAdminNotification } from '@/hooks/useAdminNotifications';

interface SupplierSidebarProps { activeTab: string; setActiveTab: (t: string) => void; }

const menuItems = [
  { id: 'nuevo', icon: '➕', label: 'Nuevo Lote' },
  { id: 'historial', icon: '📋', label: 'Mis Lotes' },
  { id: 'pagos', icon: '💳', label: 'Estado de Pagos' },
  { id: 'contrato', icon: '📜', label: 'Mi Contrato' },
  { id: 'fotos', icon: '📷', label: 'Subir Fotos' },
  { id: 'notif', icon: '🔔', label: 'Notificaciones' },
];

export function SupplierSidebar({ activeTab, setActiveTab }: SupplierSidebarProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const name = localStorage.getItem('legado_name') ?? 'Proveedor';

  return (
    <>
      <button className="mob-menu-btn" onClick={() => setOpen(true)}>☰</button>
      {open && <div className="sidebar-overlay open" onClick={() => setOpen(false)} />}
      <aside className={`portal-sidebar ${open ? 'open' : ''}`}>
        <div className="portal-logo-wrap">
          <div className="portal-logo">Legado <em>Inca</em></div>
          <div className="portal-role role-prov">🌿 Proveedor</div>
          <div className="text-white/40 text-xs mt-1">{name}</div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <a className={activeTab === item.id ? 'active' : ''} onClick={() => { setActiveTab(item.id); setOpen(false); }}>
                  <span className="ni">{item.icon}</span>{item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-exit-wrap">
          <button className="btn-exit" onClick={() => navigate('/')}>← Salir</button>
        </div>
      </aside>
    </>
  );
}

function NuevoLoteTab() {
  const [submitted, setSubmitted] = useState(false);
  const [producto, setProducto] = useState('Café Verde');
  const [variedad, setVariedad] = useState('');
  const [region, setRegion] = useState('Pasco — Villa Rica');
  const [peso, setPeso] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    await sendAdminNotification({
      tipo: 'lote',
      titulo: `Nuevo lote registrado — ${producto}`,
      descripcion: `${variedad || producto} · ${peso ? peso + ' kg' : 'sin peso'} · ${region}`,
      origen: 'Portal Proveedor',
      metadata: { producto, variedad, region, peso },
    });
    setSubmitted(true);
    setSaving(false);
  };

  return (
    <div>
      <div className="portal-header"><h1>Registrar Nuevo Lote</h1></div>
      {submitted && <div className="alert-box ok">✅ Lote registrado correctamente. El administrador fue notificado.</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="panel">
          <div className="f-grid-2">
            <div className="f-group"><label className="f-label">Tipo de Producto</label>
              <select className="f-select" value={producto} onChange={e => setProducto(e.target.value)}><option>Café Verde</option><option>Cacao en Grano</option><option>Café Pergamino</option><option>Artesanías</option></select>
            </div>
            <div className="f-group"><label className="f-label">Variedad</label><input className="f-input" placeholder="Ej: Geisha, Bourbon, Chuncho" value={variedad} onChange={e => setVariedad(e.target.value)} /></div>
          </div>
          <div className="f-grid-3">
            <div className="f-group"><label className="f-label">Región</label>
              <select className="f-select" value={region} onChange={e => setRegion(e.target.value)}><option>Pasco — Villa Rica</option><option>Junín — Chanchamayo</option><option>Huánuco — Monzón</option><option>Cusco — Quillabamba</option><option>San Martín</option><option>Ucayali</option></select>
            </div>
            <div className="f-group"><label className="f-label">Peso Bruto (kg)</label><input className="f-input" type="number" placeholder="Ej: 250" value={peso} onChange={e => setPeso(e.target.value)} /></div>
            <div className="f-group"><label className="f-label">Proceso</label>
              <select className="f-select"><option>Lavado / Washed</option><option>Natural</option><option>Honey</option><option>Pulped Natural</option></select>
            </div>
          </div>
          <div className="f-grid-2">
            <div className="f-group"><label className="f-label">Empaque</label>
              <select className="f-select"><option>Sacos yute 60 kg</option><option>GrainPro / Hermético</option><option>Cajas de cartón</option></select>
            </div>
            <div className="f-group"><label className="f-label">Fecha de Cosecha</label><input className="f-input" type="date" /></div>
          </div>
          <div className="f-group"><label className="f-label">Observaciones</label><textarea className="f-textarea" rows={2} placeholder="Observaciones del lote..." /></div>
          <button className="btn-green" onClick={handleSubmit} disabled={saving}>{saving ? 'Registrando...' : 'Registrar Lote →'}</button>
        </div>
        <div className="panel">
          <div className="panel-hdr"><span className="panel-title">📷 Fotos del Lote</span></div>
          <div className="upload-zone">
            <div className="upload-icon">📸</div>
            <div className="upload-txt"><strong>Sube fotos</strong><span>Hasta 10 fotos</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistorialTab() {
  const lotes = [
    { lote: '#VR-2025-04', producto: 'Geisha Washed', kg: 200, fecha: '10 Jun 2025', calidad: '88 pts', pago: 'S/1,500 recibido' },
    { lote: '#VR-2025-02', producto: 'Café Natural', kg: 150, fecha: '15 Abr 2025', calidad: '84 pts', pago: 'Completado' },
  ];
  return (
    <div>
      <div className="portal-header"><h1>Mis Lotes</h1></div>
      <div className="panel">
        <table className="data-table">
          <thead><tr><th>Lote</th><th>Producto</th><th>Kg</th><th>Fecha</th><th>Calidad</th><th>Pago</th></tr></thead>
          <tbody>
            {lotes.map((l) => (
              <tr key={l.lote}>
                <td className="text-inca-gold font-mono text-xs">{l.lote}</td>
                <td>{l.producto}</td><td>{l.kg}</td><td>{l.fecha}</td>
                <td>{l.calidad}</td><td className="text-emerald-400 text-xs">{l.pago}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PagosSupTab() {
  return (
    <div>
      <div className="portal-header"><h1>Estado de Pagos</h1></div>
      <div className="alert-box info">ℹ Los pagos los realiza Legado Inca por transferencia bancaria a tu cuenta registrada.</div>
      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">Historial de Pagos</span></div>
        <table className="data-table">
          <thead><tr><th>Lote</th><th>Tipo</th><th>Monto</th><th>Banco</th><th>Estado</th><th>Fecha</th></tr></thead>
          <tbody>
            <tr><td className="font-mono text-xs text-inca-gold">#VR-2025-04</td><td>30%</td><td>S/1,500</td><td>BCP</td><td><span className="badge ok"><span className="badge-dot" />Enviado</span></td><td>01 Jun</td></tr>
            <tr><td className="font-mono text-xs text-inca-gold">#VR-2025-04</td><td>70%</td><td>S/3,500</td><td>BCP</td><td><span className="badge warn"><span className="badge-dot" />Pendiente</span></td><td>—</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContratoTab() {
  const user = localStorage.getItem('legado_user') ?? 'PROV-001';
  return (
    <div>
      <div className="portal-header"><h1>Mi Contrato</h1></div>
      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">Contrato Vigente</span><span className="badge ok"><span className="badge-dot" />Activo</span></div>
        <div className="bg-inca-dark/40 rounded-lg p-5 text-sm text-white/70 space-y-2 font-mono mb-4">
          <div className="text-inca-gold font-bold">CONTRATO DE COMPRA-VENTA</div>
          <p><strong>Comprador:</strong> Legado Inca SRL</p>
          <p><strong>Vendedor:</strong> {user === 'PROV-001' ? 'Coop. Villa Rica' : 'Proveedor'}</p>
          <p><strong>Producto:</strong> Café Geisha / Arábica de Especialidad</p>
          <p><strong>Precio:</strong> S/28.00 por kg</p>
          <p><strong>Pago:</strong> 30% adelanto · 70% contra entrega verificada en Lima.</p>
          <p><strong>Banco:</strong> BCP · Cuenta: 191-XXXX-XXX</p>
        </div>
        <button className="btn-outline-gold" onClick={() => alert('Descargando PDF...')}>Descargar PDF →</button>
      </div>
    </div>
  );
}

function FotosTab() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <div className="portal-header"><h1>Subir Fotos</h1></div>
      <div className="panel">
        <div className="f-grid-3">
          <div className="f-group"><label className="f-label">Lote</label>
            <select className="f-select"><option>Selecciona lote...</option><option>#VR-2025-04</option><option>#VR-2025-02</option></select>
          </div>
          <div className="f-group"><label className="f-label">Tipo de Foto</label>
            <select className="f-select"><option>Producto en almacén</option><option>Proceso de secado</option><option>Pesaje</option><option>Empaque</option></select>
          </div>
          <div className="f-group"><label className="f-label">Fecha</label><input className="f-input" type="date" /></div>
        </div>
        <div className="upload-zone mb-4"><div className="upload-icon">📸</div><div className="upload-txt"><strong>Arrastra tus fotos</strong><span>Hasta 20 fotos</span></div></div>
        {sent && <div className="alert-box ok">✅ Fotos enviadas al equipo Legado Inca en Lima.</div>}
        <button className="btn-green" onClick={() => setSent(true)}>Enviar Fotos →</button>
      </div>
    </div>
  );
}

function NotifTab() {
  return (
    <div>
      <div className="portal-header"><h1>Notificaciones</h1></div>
      <div className="panel space-y-0">
        {[
          { icon: '✅', title: 'Lote #VR-2025-04 Aprobado', desc: 'Tu lote fue aprobado. Puntaje SCA: 88 pts.', fecha: '10 Jun 2025' },
          { icon: '💳', title: 'Pago Recibido — S/1,500', desc: 'Adelanto del 30% lote #VR-2025-04. Verifica en tu cuenta BCP.', fecha: '01 Jun 2025' },
        ].map((n, i) => (
          <div key={i} className="flex items-start gap-4 py-4 border-b border-white/5">
            <div className="text-2xl">{n.icon}</div>
            <div className="flex-1"><div className="text-white font-medium text-sm mb-1">{n.title}</div><div className="text-white/50 text-xs">{n.desc}</div></div>
            <div className="text-white/30 text-xs whitespace-nowrap">{n.fecha}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SupplierPage() {
  const [tab, setTab] = useState('nuevo');
  const navigate = useNavigate();
  const role = localStorage.getItem('legado_role');

  if (role !== 'supplier') {
    return (
      <div className="min-h-screen bg-inca-dark flex items-center justify-center flex-col gap-4">
        <div className="text-6xl">🌿</div>
        <h2 className="font-playfair text-2xl text-white">Acceso restringido</h2>
        <p className="text-white/50 text-sm">Necesitas iniciar sesión como proveedor.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  const renderTab = () => {
    switch (tab) {
      case 'nuevo': return <NuevoLoteTab />;
      case 'historial': return <HistorialTab />;
      case 'pagos': return <PagosSupTab />;
      case 'contrato': return <ContratoTab />;
      case 'fotos': return <FotosTab />;
      case 'notif': return <NotifTab />;
      default: return <NuevoLoteTab />;
    }
  };

  return (
    <div className="min-h-screen bg-inca-dark">
      <div className="portal-layout">
        <SupplierSidebar activeTab={tab} setActiveTab={setTab} />
        <main className="portal-main">{renderTab()}</main>
      </div>
    </div>
  );
}
