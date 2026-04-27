const marcas = [
  {
    img: '/images/holzen.jpg',
    eyebrow: 'Café de Especialidad',
    name: 'HOLZEN',
    sub: 'Arábica de altura. 86+ SCA. Geisha, Natural, Honey. Directo del productor al tostador europeo.',
    arrow: 'Explorar HOLZEN →',
    badge: 'Disponible',
    badgeClass: 'bg-emerald-700 text-white',
    href: 'https://legadoinca.github.io/Holzen/',
    external: true,
  },
  {
    img: '/images/coya.jpg',
    eyebrow: 'Cacao Premium',
    name: 'COYA',
    sub: 'Chuncho del Cusco. CCN-51. Monzón Heritage. Fermentación artesanal. Del árbol al alma.',
    arrow: 'Explorar COYA →',
    badge: 'Disponible',
    badgeClass: 'bg-emerald-700 text-white',
    href: 'https://legadoinca.github.io/Coya/',
    external: true,
  },
  {
    img: '/images/artesania.jpg',
    eyebrow: 'Artesanías Andinas',
    name: 'Próximamente',
    sub: 'Textiles Shipibo. Cerámica Quechua. Orfebrería Aymara. Cada pieza lleva un nombre.',
    arrow: 'Explorar colección →',
    badge: 'En desarrollo',
    badgeClass: 'bg-white/10 text-white/60',
    href: '#',
    external: false,
  },
];

export default function UniversoSection() {
  return (
    <section id="universo" className="relative py-20 px-6 overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <img
          src="/images/fondo1.jpeg"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Nuestras marcas</span>
          <h2 className="section-title mb-3">
            El universo<br /><em>Legado Inca</em>
          </h2>
          <p className="text-white/50 text-sm">Tres mundos. Tres marcas. Una misma raíz peruana.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marcas.map((m) => (
            <div
              key={m.name}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              style={{ height: '420px' }}
              onClick={() => {
                if (m.external && m.href !== '#') window.open(m.href, '_blank');
              }}
            >
              <div className="w-full h-full">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <div className="text-inca-gold text-xs font-semibold tracking-wider uppercase mb-2">{m.eyebrow}</div>
                <h3 className="font-playfair text-3xl font-bold text-white mb-2">{m.name}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">{m.sub}</p>
                <span className="text-inca-gold text-sm font-medium group-hover:text-inca-gold-light transition-colors">
                  {m.arrow}
                </span>
              </div>
              <div className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full ${m.badgeClass}`}>
                {m.badge}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
