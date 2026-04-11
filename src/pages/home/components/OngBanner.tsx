const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function OngBanner() {
  return (
    <div className="bg-inca-brown-2 border-y border-inca-gold/15 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6">
        <div className="text-5xl flex-shrink-0">🌱</div>
        <div className="flex-1">
          <div className="text-inca-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            ONG Semilla Nueva
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            De cada compra que realizas, el{' '}
            <strong className="text-inca-gold">10% va directamente a SEMILLA NUEVA</strong>, la ONG que
            apoya a mujeres víctimas de violencia, familias que dejaron los cultivos de coca y
            sobrevivientes del terrorismo en los Andes peruanos.
          </p>
        </div>
        <button className="btn-outline flex-shrink-0" onClick={() => scrollTo('#impacto')}>
          Ver el impacto
        </button>
      </div>
    </div>
  );
}
