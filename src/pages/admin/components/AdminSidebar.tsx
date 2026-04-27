import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  {
    section: 'Principal',
    items: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'pedidos', icon: '📦', label: 'Pedidos' },
      { id: 'stock', icon: '🏪', label: 'Inventario' },
    ],
  },
  {
    section: 'Proveedores',
    items: [
      { id: 'proveedores', icon: '🌿', label: 'Proveedores' },
      { id: 'calidad', icon: '🔬', label: 'Calidad de Lotes' },
      { id: 'contratos', icon: '📜', label: 'Contratos' },
      { id: 'satelital', icon: '🛰', label: 'Fotos Satelitales' },
    ],
  },
  {
    section: 'Finanzas',
    items: [
      { id: 'finanzas', icon: '💰', label: 'Finanzas' },
      { id: 'pagos', icon: '💳', label: 'Pagos Proveedores' },
    ],
  },
  {
    section: 'Logística',
    items: [
      { id: 'embarques', icon: '🚢', label: 'Embarques' },
    ],
  },
];

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { unreadCount } = useAdminNotifications();

  return (
    <>
      <button className="mob-menu-btn" onClick={() => setOpen(true)}>☰</button>
      {open && (
        <div className="sidebar-overlay open" onClick={() => setOpen(false)} />
      )}
      <aside
        className={`portal-sidebar ${open ? 'open' : ''}`}
        style={{
          background: `
            linear-gradient(
              175deg,
              #0D0600 0%,
              #1A0A00 20%,
              #2C1A0A 45%,
              #1A0A00 70%,
              #0D0600 100%
            )
          `,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Acento dorado sutil en la esquina superior */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(to right, transparent, #C9A84C, #D4B665, #C9A84C, transparent)',
            opacity: 0.8,
          }}
        />

        {/* Resplandor dorado difuso detrás del logo */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Resplandor dorado difuso en la parte inferior */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '120px',
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Línea decorativa vertical izquierda */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            bottom: '10%',
            left: '0',
            width: '1px',
            background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.25), transparent)',
            pointerEvents: 'none',
          }}
        />

        <div className="portal-logo-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div className="portal-logo">Legado <em>Inca</em></div>
          <div className="portal-role role-admin">🛡 Administrador</div>
        </div>

        <nav className="sidebar-nav" style={{ position: 'relative', zIndex: 1 }}>
          {/* Notificaciones destacadas arriba */}
          <div className="nav-sec-label">Alertas</div>
          <ul>
            <li>
              <a
                className={activeTab === 'notificaciones' ? 'active' : ''}
                onClick={() => { setActiveTab('notificaciones'); setOpen(false); }}
              >
                <span className="ni">🔔</span>
                Notificaciones
                {unreadCount > 0 && (
                  <span className="ml-auto bg-inca-gold text-inca-dark text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </a>
            </li>
          </ul>

          {menuItems.map((section) => (
            <div key={section.section}>
              <div className="nav-sec-label">{section.section}</div>
              <ul>
                {section.items.map((item) => (
                  <li key={item.id}>
                    <a
                      className={activeTab === item.id ? 'active' : ''}
                      onClick={() => { setActiveTab(item.id); setOpen(false); }}
                    >
                      <span className="ni">{item.icon}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-exit-wrap" style={{ position: 'relative', zIndex: 1 }}>
          <button className="btn-exit" onClick={() => navigate('/')}>← Salir</button>
        </div>
      </aside>
    </>
  );
}
