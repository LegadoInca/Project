const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const grupos = [
  {
    key: 'fundadoras',
    pattern: '♀',
    bgColor: 'from-amber-950 to-inca-dark',
    tag: '👕 Las Fundadoras',
    name: 'Las Fundadoras',
    role: 'Mujeres que reconstruyeron su vida',
    desc: 'Sobrevivieron la violencia doméstica. Algunas lo perdieron todo. Pero encontraron en la tierra peruana su sanación. Hoy son las manos más cuidadosas del café — y los corazones más fuertes de los Andes.',
  },
  {
    key: 'semilla',
    pattern: '🌱',
    bgColor: 'from-emerald-950 to-inca-dark',
    tag: '👕 Semilla Nueva',
    name: 'Semilla Nueva',
    role: 'De la hoja de coca al grano de oro',
    desc: 'Cultivaban coca porque era lo único que daba dinero. Hoy eligieron el café. No fue fácil — significó coraje frente al miedo. Ahora sus fincas son ejemplo para toda la región.',
  },
  {
    key: 'guardianes',
    pattern: '⚔',
    bgColor: 'from-red-950 to-inca-dark',
    tag: '👕 Los Guardianes',
    name: 'Los Guardianes',
    role: 'Sobrevivientes del terrorismo',
    desc: 'Vivieron el horror del terrorismo en sus pueblos. Vieron destruirse todo lo que amaban. Pero no se fueron — se quedaron a reconstruir. Hoy guardan la tierra y el futuro de sus comunidades.',
  },
];

export default function GruposSection() {
  return (
    <section id="historias" className="bg-inca-dark py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Las tres familias</span>
          <h2 className="section-title mb-4">
            Tres historias.<br />Una misma <em>tierra.</em>
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
            No son solo agricultores. Son sobrevivientes. Cada uno lleva en sus manos una historia
            que no debería olvidarse — y que ahora, en cada taza, cada tableta y cada tejido, llega hasta ti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {grupos.map((g) => (
            <div
              key={g.key}
              className={`relative bg-gradient-to-b ${g.bgColor} border border-white/5 rounded-xl overflow-hidden group cursor-pointer hover:border-inca-gold/30 transition-all duration-300`}
              style={{ minHeight: '420px' }}
            >
              {/* Big pattern background */}
              <div className="absolute inset-0 flex items-center justify-center text-[180px] opacity-5 pointer-events-none select-none">
                {g.pattern}
              </div>

              <div className="relative z-10 p-8 flex flex-col justify-end h-full" style={{ minHeight: '420px' }}>
                <div className="mt-auto">
                  <span className="text-xs font-semibold text-inca-gold/80 bg-inca-gold/10 px-3 py-1 rounded-full mb-4 inline-block">
                    {g.tag}
                  </span>
                  <h3 className="font-playfair text-2xl font-bold text-white mb-1">{g.name}</h3>
                  <div className="text-inca-gold text-xs mb-4">{g.role}</div>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">{g.desc}</p>
                  <button
                    onClick={() => scrollTo('#personas-section')}
                    className="text-inca-gold text-sm font-medium hover:text-inca-gold-light transition-colors cursor-pointer"
                  >
                    Conocer sus historias →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
