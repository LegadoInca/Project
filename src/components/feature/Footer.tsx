const footerBrands = [
  { label: 'HOLZEN — Café', href: 'https://holzen.netlify.app' },
  { label: 'COYA — Cacao', href: '#' },
  { label: 'Artesanías Andinas', href: '#' },
];

const footerPeople = [
  { label: 'Las Fundadoras', href: '#historias' },
  { label: 'Semilla Nueva', href: '#historias' },
  { label: 'Los Guardianes', href: '#historias' },
  { label: 'ONG Semilla Nueva', href: '#impacto' },
];

const scrollTo = (href: string) => {
  if (href.startsWith('#')) {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Footer() {
  return (
    <footer className="bg-inca-dark border-t border-inca-gold/10 pt-14 pb-8 px-6" id="footer-madre">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="font-playfair text-xl font-bold text-white mb-1">LEGADO INCA</div>
            <div className="text-inca-gold text-xs tracking-widest uppercase mb-4">
              Café · Cacao · Artesanías · Perú
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Tres productos. Tres comunidades de supervivientes. Una ONG. Una compra que cambia el mundo.
            </p>
            <div className="text-inca-gold text-sm">🌱 10% a ONG Semilla Nueva</div>
          </div>

          {/* Brands */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Nuestras Marcas</h5>
            <ul className="space-y-2 list-none">
              {footerBrands.map((b) => (
                <li key={b.label}>
                  <a
                    href={b.href}
                    target={b.href.startsWith('http') ? '_blank' : undefined}
                    rel={b.href.startsWith('http') ? 'nofollow noreferrer' : undefined}
                    className="text-white/50 text-sm hover:text-inca-gold transition-colors cursor-pointer"
                  >
                    {b.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* People */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Las Personas</h5>
            <ul className="space-y-2 list-none">
              {footerPeople.map((p) => (
                <li key={p.label}>
                  <button
                    onClick={() => scrollTo(p.href)}
                    className="text-white/50 text-sm hover:text-inca-gold transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Portales</h5>
            <ul className="space-y-2 list-none">
              <li>
                <a href="/admin" className="text-white/50 text-sm hover:text-inca-gold transition-colors">
                  🛡 Administrador
                </a>
              </li>
              <li>
                <a href="/proveedor" className="text-white/50 text-sm hover:text-inca-gold transition-colors">
                  🌿 Portal Proveedor
                </a>
              </li>
              <li>
                <a href="/praga" className="text-white/50 text-sm hover:text-inca-gold transition-colors">
                  🇨🇿 Portal Praga
                </a>
              </li>
              <li>
                <a href="mailto:info@legadoinca.com" className="text-white/50 text-sm hover:text-inca-gold transition-colors">
                  ✉️ Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">
            © 2025 Legado Inca · Lima, Perú · Todos los derechos reservados
          </p>
          <p className="text-white/30 text-xs">
            IVA incluido · Envíos a toda Europa · GDPR compliant
          </p>
        </div>
      </div>
    </footer>
  );
}
