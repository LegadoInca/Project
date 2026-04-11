import { useState, useEffect } from 'react';

interface NavbarProps {
  onOpenLogin: () => void;
}

const navLinks = [
  { label: 'Personas', href: '#personas-section' },
  { label: 'Historias', href: '#historias' },
  { label: 'Marcas', href: '#universo' },
  { label: 'Impacto ONG', href: '#impacto' },
  { label: 'Contacto', href: '#footer-contact' },
];

export default function Navbar({ onOpenLogin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'bg-inca-dark/95 backdrop-blur-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer"
          >
            <div className="font-playfair text-lg font-bold text-white leading-tight">
              LEGADO INCA
            </div>
            <div className="text-inca-gold text-[10px] tracking-widest uppercase">
              Café · Cacao · Artesanías · Perú
            </div>
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => scrollTo(link.href)}
                  className="text-white/70 text-sm font-medium hover:text-inca-gold transition-colors cursor-pointer whitespace-nowrap"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="hidden md:flex items-center gap-1.5 border border-inca-gold/50 text-inca-gold text-xs font-medium px-4 py-2 rounded-full cursor-pointer transition-all hover:bg-inca-gold/10 whitespace-nowrap"
            >
              🔐 Iniciar Sesión
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-white text-xl w-8 h-8 flex items-center justify-center"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-inca-dark/98 z-50 flex flex-col items-center justify-center gap-6">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-5 right-6 text-white/60 text-2xl cursor-pointer"
          >
            ✕
          </button>
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="font-playfair text-2xl text-white hover:text-inca-gold transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setMobileOpen(false); onOpenLogin(); }}
            className="btn-outline mt-4"
          >
            🔐 Iniciar Sesión
          </button>
        </div>
      )}
    </>
  );
}
