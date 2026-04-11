import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import DashboardTab from './components/DashboardTab';
import PedidosTab from './components/PedidosTab';
import StockTab from './components/StockTab';
import ProveedoresTab from './components/ProveedoresTab';
import CalidadTab from './components/CalidadTab';
import ContratosTab from './components/ContratosTab';
import SatelitalTab from './components/SatelitalTab';
import FinanzasTab from './components/FinanzasTab';
import PagosTab from './components/PagosTab';
import EmbarquesTab from './components/EmbarquesTab';
import NotificacionesTab from './components/NotificacionesTab';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard');
  const navigate = useNavigate();
  const role = localStorage.getItem('legado_role');
  const { unreadCount } = useAdminNotifications();

  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-inca-dark flex items-center justify-center flex-col gap-4">
        <div className="text-6xl">🛡</div>
        <h2 className="font-playfair text-2xl text-white">Acceso restringido</h2>
        <p className="text-white/50 text-sm">Necesitas iniciar sesión como administrador.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  const renderTab = () => {
    switch (tab) {
      case 'dashboard': return <DashboardTab />;
      case 'pedidos': return <PedidosTab />;
      case 'stock': return <StockTab />;
      case 'proveedores': return <ProveedoresTab />;
      case 'calidad': return <CalidadTab />;
      case 'contratos': return <ContratosTab />;
      case 'satelital': return <SatelitalTab />;
      case 'finanzas': return <FinanzasTab />;
      case 'pagos': return <PagosTab />;
      case 'embarques': return <EmbarquesTab />;
      case 'notificaciones': return <NotificacionesTab />;
      default: return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-inca-dark">
      <div className="portal-layout">
        <AdminSidebar activeTab={tab} setActiveTab={setTab} />
        <main className="portal-main">{renderTab()}</main>
      </div>
    </div>
  );
}
