import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const CREDENTIALS: Record<string, { password: string; role: string; route: string; name: string }> = {
  admin: { password: 'admin123', role: 'admin', route: '/admin', name: 'Administrador' },
  'PROV-001': { password: 'prov001', role: 'supplier', route: '/proveedor', name: 'Coop. Villa Rica' },
  czech: { password: 'czech123', role: 'czech', route: '/praga', name: 'Portal Praga' },
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  if (!open) return null;

  const doLogin = () => {
    const cred = CREDENTIALS[user];
    if (cred && cred.password === pass) {
      setError(false);
      localStorage.setItem('legado_role', cred.role);
      localStorage.setItem('legado_user', user);
      localStorage.setItem('legado_name', cred.name);
      onClose();
      navigate(cred.route);
    } else {
      setError(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-inca-brown-2 border border-inca-gold/20 rounded-xl p-8 w-full max-w-sm relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          ✕
        </button>
        <div className="section-eyebrow">Acceso Privado</div>
        <h2 className="font-playfair text-2xl font-bold text-white mb-1">Iniciar Sesión</h2>
        <p className="text-white/50 text-sm mb-6">Ingresa tu código de acceso y contraseña</p>

        {error && (
          <div className="alert-box err mb-4 text-xs">
            Credenciales incorrectas. Intenta de nuevo.
          </div>
        )}

        <div className="f-group">
          <label className="f-label">Código / Usuario</label>
          <input
            className="f-input"
            placeholder="Ej: admin · PROV-001 · czech"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div className="f-group">
          <label className="f-label">Contraseña</label>
          <input
            className="f-input"
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doLogin()}
          />
        </div>

        <button className="btn-gold w-full justify-center flex mt-2" onClick={doLogin}>
          Ingresar →
        </button>

        <p className="text-white/30 text-xs mt-4 text-center">
          Demo: <strong className="text-white/50">admin/admin123 · PROV-001/prov001 · czech/czech123</strong>
        </p>
      </div>
    </div>
  );
}
