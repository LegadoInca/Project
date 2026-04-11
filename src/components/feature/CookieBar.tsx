import { useState } from 'react';

export default function CookieBar() {
  const [visible, setVisible] = useState(() => localStorage.getItem('cookies') !== 'ok');

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-inca-dark border-t border-inca-gold/20 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <p className="text-white/70 text-sm flex-1">
        Usamos cookies para mejorar tu experiencia. Sin cookies de terceros para publicidad.
      </p>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => { localStorage.setItem('cookies', 'ok'); setVisible(false); }}
          className="btn-primary text-xs px-4 py-2"
        >
          Aceptar
        </button>
        <button
          onClick={() => setVisible(false)}
          className="btn-outline text-xs px-4 py-2"
        >
          Solo esenciales
        </button>
      </div>
    </div>
  );
}
