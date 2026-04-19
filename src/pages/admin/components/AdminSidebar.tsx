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
        style={{ backgroundColor: '#0f0a00' }}
      >
        <div className="portal-logo-wrap">
          <div className="portal-logo">Legado <em>Inca</em></div>
          <div className="portal-role role-admin">🛡 Administrador</div>
        </div>

        <nav className="sidebar-nav">
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

        <div className="sidebar-exit-wrap">
          <button className="btn-exit" onClick={() => navigate('/')}>← Salir</button>
        </div>
      </aside>
    </>
  );
}
