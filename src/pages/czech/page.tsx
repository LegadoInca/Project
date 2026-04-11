import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CzSidebarProps { activeTab: string; setActiveTab: (t: string) => void; }

const menuItems = [
  { section: 'Logística', items: [{ id: 'embarques', icon: '🚢', label: 'Embarques' }, { id: 'stock', icon: '🏪', label: 'Stock Praga' }, { id: 'pedidos', icon: '📦', label: 'Pedidos B2B' }] },
  { section: 'Documentación', items: [{ id: 'docs', icon: '📄', label: 'Docs UE' }, { id: 'uk', icon: '🇬🇧', label: 'Docs Reino Unido' }] },
  { section: 'Finanzas', items: [{ id: 'gastos', icon: '📉', label: 'Ingresar Gastos' }] },
  { section: 'Parcelas', items: [{ id: 'satelital', icon: '🛰', label: 'Vista Satelital' }] },
  { section: 'Comunicación', items: [{ id: 'contacto', icon: '💬', label: 'Contacto Lima' }] },
];

function CzSidebar({ activeTab, setActiveTab }: CzSidebarProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="mob-menu-btn" onClick={() => setOpen(true)}>☰</button>
      {open && <div className="sidebar-overlay open" onClick={() => setOpen(false)} />}
      <aside className={`portal-sidebar ${open ? 'open' : ''}`}>
        <div className="portal-logo-wrap">
          <div className="portal-logo">Legado <em>Inca</em></div>
          <div className="portal-role role-cz">🇨🇿 Praga</div>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((section) => (
            <div key={section.section}>
              <div className="nav-sec-label">{section.section}</div>
              <ul>
                {section.items.map((item) => (
                  <li key={item.id}>
                    <a className={activeTab === item.id ? 'active' : ''} onClick={() => { setActiveTab(item.id); setOpen(false); }}>
                      <span className="ni">{item.icon}</span>{item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="sidebar-exit-wrap">
          <button className="btn-exit" onClick={() => navigate('/')}>← Salir</button>
        </div>
      </aside>
    </>
  );
}

const timelineSteps = [
  { label: 'Callao', done: true }, { label: 'Panamá', done: true },
  { label: 'Atlántico', done: false, active: true }, { label: 'Rotterdam', done: false }, { label: 'Praga', done: false },
];

function CzEmbarques() {
  return (
    <div>
      <div className="portal-header"><h1>Embarques</h1></div>
      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">Contenedor Activo — #CTR-2025-04</span><span className="badge warn"><span className="badge-dot" />En tránsito</span></div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div><div className="text-white/40 text-xs">Naviera</div><div className="text-white text-sm">Maersk Line</div></div>
          <div><div className="text-white/40 text-xs">BL</div><div className="text-white text-sm font-mono">MAEU-204987XX</div></div>
          <div><div className="text-white/40 text-xs">ETA Rotterdam</div><div className="text-inca-gold text-sm">28 Jul 2025</div></div>
        </div>
        <div className="relative flex items-center justify-between mt-6 px-4">
          <div className="absolute h-0.5 bg-white/10 left-4 right-4 top-4" />
          {timelineSteps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center gap-2 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step.done ? 'bg-inca-gold border-inca-gold text-inca-dark' : step.active ? 'bg-inca-brown-2 border-inca-gold text-inca-gold animate-pulseGold' : 'bg-inca-brown-2 border-white/20 text-white/30'}`}>
                {step.done ? '✓' : step.active ? '◉' : '○'}
              </div>
              <span className={`text-xs whitespace-nowrap ${step.done ? 'text-inca-gold' : step.active ? 'text-white' : 'text-white/30'}`}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CzStock() {
  const items = [
    { p: 'Geisha Washed', disp: '12 kg ⚠', res: '20 kg', precio: '€28', prox: '28 días' },
    { p: 'Café Natural', disp: '45 kg', res: '35 kg', precio: '€18', prox: '28 días' },
    { p: 'Café Honey', disp: '180 kg', res: '60 kg', precio: '€16', prox: '—' },
    { p: 'Cacao CCN-51', disp: '780 kg', res: '50 kg', precio: '€4.20', prox: '—' },
  ];
  return (
    <div>
      <div className="portal-header"><h1>Stock en Praga</h1></div>
      <div className="panel">
        <table className="data-table">
          <thead><tr><th>Producto</th><th>Disponible</th><th>Reservado</th><th>€/kg</th><th>Próx. Lote</th></tr></thead>
          <tbody>{items.map((s) => (<tr key={s.p}><td>{s.p}</td><td>{s.disp}</td><td>{s.res}</td><td>{s.precio}</td><td>{s.prox}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

function CzPedidos() {
  const pedidos = [
    { cliente: 'Café Savoy, Praga', prod: 'Geisha Washed', kg: '20 kg', total: '€560', estado: 'En entrega', bc: 'warn' },
    { cliente: 'Hotel Aria, Praga', prod: 'Cacao Chuncho', kg: '50 kg', total: '€325', estado: 'Listo', bc: 'ok' },
    { cliente: 'Nomad Coffee, Berlín', prod: 'Café Natural', kg: '35 kg', total: '€630', estado: 'Por preparar', bc: 'pend' },
  ];
  return (
    <div>
      <div className="portal-header"><h1>Pedidos B2B Europa</h1></div>
      <div className="panel">
        <table className="data-table">
          <thead><tr><th>Cliente</th><th>Producto</th><th>Kg</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>{pedidos.map((p, i) => (<tr key={i}><td>{p.cliente}</td><td>{p.prod}</td><td>{p.kg}</td><td>{p.total}</td><td><span className={`badge ${p.bc}`}><span className="badge-dot" />{p.estado}</span></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

function CzDocs() {
  return (
    <div>
      <div className="portal-header"><h1>Documentación UE / Exportación</h1></div>
      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">📦 Exportación Perú</span></div>
        <div className="space-y-3">
          {[
            { icon: '📄', title: 'Bill of Lading — MAEU-204987XX', sub: 'Naviera Maersk · 12 Jun 2025' },
            { icon: '🧾', title: 'Factura Comercial — #FAC-2025-041', sub: '€18,400 · Incoterm CIF Rotterdam' },
            { icon: '🌿', title: 'Certificado Fitosanitario SENASA', sub: 'N° PE-2025-0441827' },
          ].map((d) => (
            <div key={d.title} className="flex items-center justify-between p-3 bg-inca-dark/40 rounded-lg border border-white/5">
              <div className="flex items-center gap-3"><span className="text-2xl">{d.icon}</span><div><div className="text-white text-sm">{d.title}</div><div className="text-white/40 text-xs">{d.sub}</div></div></div>
              <button className="btn-outline-gold" onClick={() => alert('Próximamente.')}>Descargar</button>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">🇪🇺 EUDR Compliance</span><span className="text-emerald-400 text-xs">✅ Compliant</span></div>
        <div className="alert-box ok">Aurum Origins cumple 100% EUDR mediante GPS, GFW y TRACES NT.</div>
        <div className="flex items-center justify-between p-3 bg-inca-dark/40 rounded-lg">
          <div><div className="text-white text-sm">Due Diligence Statement — EUDR</div><div className="text-white/40 text-xs">Polígonos GPS · GFW verificado · TRACES NT</div></div>
          <button className="btn-outline-gold" onClick={() => alert('Próximamente.')}>Descargar</button>
        </div>
      </div>
    </div>
  );
}

function CzUK() {
  return (
    <div>
      <div className="portal-header"><h1>Documentación Reino Unido</h1></div>
      <div className="panel">
        <div className="panel-hdr"><span className="panel-title">🇬🇧 Documentos UK</span></div>
        <div className="space-y-3 mb-4">
          {[
            { title: 'IPAFFS Pre-Notification', sub: '⚠ Obligatorio · Mínimo 1 día hábil antes', btn: 'Ver Plantilla' },
            { title: 'Statement on Origin — UK GSP', sub: 'Perú es país beneficiario · Arancel 0%', btn: 'Descargar' },
            { title: 'UK Forest Risk Due Diligence', sub: 'Cadena de suministro verificada', btn: 'Descargar' },
          ].map((d) => (
            <div key={d.title} className="flex items-center justify-between p-3 bg-inca-dark/40 rounded-lg border border-white/5">
              <div><div className="text-white text-sm">{d.title}</div><div className="text-white/40 text-xs">{d.sub}</div></div>
              <button className="btn-outline-gold" onClick={() => alert('Próximamente.')}>{d.btn}</button>
            </div>
          ))}
        </div>
        <div className="alert-box info">
          🔗 <a href="https://ipaffs.trade.gov.uk" target="_blank" rel="noreferrer" className="text-inca-gold hover:underline">ipaffs.trade.gov.uk</a>
          {' · '}
          <a href="https://www.gov.uk/trade-tariff" target="_blank" rel="noreferrer" className="text-inca-gold hover:underline">UK Trade Tariff</a>
        </div>
      </div>
    </div>
  );
}

function CzGastos() {
  const [saved, setSaved] = useState(false);
  const gastos = [{ tipo: 'Flete', monto: '€420', ref: 'CTR-2025-02', bc: 'ok' }, { tipo: 'Aduana', monto: '€180', ref: 'CTR-2025-02', bc: 'ok' }];
  return (
    <div>
      <div className="portal-header"><h1>Ingresar Gastos</h1></div>
      <div className="alert-box info">ℹ Los gastos aparecerán en el panel de Finanzas del Administrador en Lima.</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="panel">
          <div className="panel-hdr"><span className="panel-title">Registrar Nuevo Gasto</span></div>
          <div className="f-grid-2">
            <div className="f-group"><label className="f-label">Tipo de Gasto</label>
              <select className="f-select"><option>Flete local (Rotterdam→Praga)</option><option>Aduana CZ</option><option>Almacén Praga</option><option>Seguro</option><option>Otro</option></select>
            </div>
            <div className="f-group"><label className="f-label">Monto (€)</label><input className="f-input" type="number" step="0.01" placeholder="Ej: 420.00" /></div>
          </div>
          <div className="f-group"><label className="f-label">Referencia</label><input className="f-input" placeholder="Ej: CTR-2025-04" /></div>
          {saved && <div className="alert-box ok">✅ Gasto registrado.</div>}
          <button className="btn-gold" onClick={() => setSaved(true)}>Registrar Gasto →</button>
        </div>
        <div className="panel">
          <div className="panel-hdr"><span className="panel-title">Gastos Registrados</span></div>
          <table className="data-table">
            <thead><tr><th>Tipo</th><th>Monto</th><th>Ref.</th><th>Estado</th></tr></thead>
            <tbody>{gastos.map((g, i) => (<tr key={i}><td>{g.tipo}</td><td className="text-red-400">{g.monto}</td><td className="font-mono text-xs text-white/50">{g.ref}</td><td><span className={`badge ${g.bc}`}><span className="badge-dot" />OK</span></td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CzSatelital() {
  const [selected, setSelected] = useState<{ id: string; nombre: string; lat: number; lng: number } | null>(null);
  const parcelas = [
    { id: 'PROV-001', nombre: 'Coop. Villa Rica · Pasco', lat: -10.6626, lng: -75.3558 },
    { id: 'PROV-002', nombre: 'Fam. Quispe · Chanchamayo', lat: -11.4893, lng: -74.9011 },
    { id: 'PROV-003', nombre: 'Agro Monzón · Huánuco', lat: -9.2853, lng: -75.9964 },
    { id: 'PROV-004', nombre: 'Com. Shipibo · Quillabamba', lat: -13.0544, lng: -72.5745 },
  ];
  return (
    <div>
      <div className="portal-header"><h1>Vista Satelital de Parcelas</h1></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="panel">
          <div className="panel-hdr"><span className="panel-title">Seleccionar Parcela</span></div>
          <div className="space-y-2">
            {parcelas.map((p) => (
              <div key={p.id} onClick={() => setSelected(p)} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selected?.id === p.id ? 'bg-inca-gold/15 border border-inca-gold/30' : 'hover:bg-white/5'}`}>
                <div className="text-inca-gold font-mono text-xs w-16">{p.id}</div>
                <div className="text-white/70 text-sm">{p.nombre}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-hdr">
            <span className="panel-title">🛰 Vista — {selected?.nombre ?? 'Selecciona una parcela'}</span>
            {selected && <a href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}&t=k`} target="_blank" rel="noreferrer" className="text-inca-gold text-xs hover:underline">Abrir en Google Maps ↗</a>}
          </div>
          {selected ? (
            <iframe src={`https://maps.google.com/maps?q=${selected.lat},${selected.lng}&t=k&z=14&output=embed`} className="w-full h-80 rounded-lg border-0" title="Mapa" />
          ) : (
            <div className="w-full h-80 bg-inca-dark/40 rounded-lg flex flex-col items-center justify-center gap-2 text-white/30"><span className="text-4xl">🛰</span><span>Selecciona una parcela</span></div>
          )}
        </div>
      </div>
    </div>
  );
}

function CzContacto() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <div className="portal-header"><h1>Contacto Lima</h1></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="panel">
          <div className="panel-hdr"><span className="panel-title">Enviar Mensaje</span></div>
          <div className="f-group"><label className="f-label">Asunto</label>
            <select className="f-select"><option>Consulta embarque</option><option>Problema con lote</option><option>Nuevo pedido</option><option>Documentación</option></select>
          </div>
          <div className="f-group"><label className="f-label">Mensaje</label><textarea className="f-textarea" rows={5} placeholder="Escribe tu mensaje..." /></div>
          {sent && <div className="alert-box ok">✅ Mensaje enviado. Respuesta en menos de 24h.</div>}
          <button className="btn-gold" onClick={() => setSent(true)}>Enviar →</button>
        </div>
        <div className="panel">
          <div className="panel-hdr"><span className="panel-title">Contactos Lima</span></div>
          <div className="space-y-4">
            <div className="flex items-center gap-3"><span className="text-2xl">👩‍💼</span><div><div className="text-white text-sm">CEO — Lima</div><div className="text-white/50 text-xs">📱 +51 9XX XXX XXX</div></div></div>
            <div className="flex items-center gap-3"><span className="text-2xl">📦</span><div><div className="text-white text-sm">Logística</div><div className="text-white/50 text-xs">📧 logistica@legadoinca.com</div></div></div>
          </div>
          <div className="bg-inca-dark/40 rounded-lg p-3 mt-4 text-xs text-white/40">
            <div className="font-medium text-white/60 mb-1">HORARIO LIMA</div>
            <div>Lima (PET): UTC-5 · Praga (CEST): UTC+2</div>
            <div>Diferencia: 7 horas · Laboral Lima: 9am–6pm</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CzechPage() {
  const [tab, setTab] = useState('embarques');
  const navigate = useNavigate();
  const role = localStorage.getItem('legado_role');

  if (role !== 'czech') {
    return (
      <div className="min-h-screen bg-inca-dark flex items-center justify-center flex-col gap-4">
        <div className="text-6xl">🇨🇿</div>
        <h2 className="font-playfair text-2xl text-white">Acceso restringido</h2>
        <p className="text-white/50 text-sm">Necesitas iniciar sesión como Portal Praga.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  const renderTab = () => {
    switch (tab) {
      case 'embarques': return <CzEmbarques />;
      case 'stock': return <CzStock />;
      case 'pedidos': return <CzPedidos />;
      case 'docs': return <CzDocs />;
      case 'uk': return <CzUK />;
      case 'gastos': return <CzGastos />;
      case 'satelital': return <CzSatelital />;
      case 'contacto': return <CzContacto />;
      default: return <CzEmbarques />;
    }
  };

  return (
    <div className="min-h-screen bg-inca-dark">
      <div className="portal-layout">
        <CzSidebar activeTab={tab} setActiveTab={setTab} />
        <main className="portal-main">{renderTab()}</main>
      </div>
    </div>
  );
}
