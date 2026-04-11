import { useEffect, useRef, useState } from 'react';

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function OngBanner() {
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * 10));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="relative bg-inca-brown-2 border-y border-inca-gold/15 py-7 px-6 overflow-hidden"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-inca-gold/5 blur-3xl" />
        <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-inca-gold/5 blur-2xl" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <div
          className={`flex flex-col md:flex-row items-center gap-8 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Icono + contador */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div
              className={`w-16 h-16 rounded-full bg-inca-gold/10 border border-inca-gold/20 flex items-center justify-center text-3xl transition-all duration-500 ${
                inView ? 'scale-100' : 'scale-75'
              }`}
            >
              🌱
            </div>
            <div className="text-center">
              <span className="font-playfair text-3xl font-bold text-inca-gold leading-none">
                {count}%
              </span>
              <div className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">
                de cada venta
              </div>
            </div>
          </div>

          {/* Divisor vertical */}
          <div className="hidden md:block w-px h-16 bg-inca-gold/20 flex-shrink-0" />

          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-4 h-px bg-inca-gold/50" />
              <span className="text-inca-gold text-[11px] font-semibold tracking-[0.25em] uppercase">
                ONG Semilla Nueva
              </span>
              <span className="w-4 h-px bg-inca-gold/50" />
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xl">
              De cada compra que realizas,{' '}
              <strong className="text-inca-gold font-semibold">
                el 10% va directamente a SEMILLA NUEVA
              </strong>
              , la ONG que apoya a mujeres víctimas de violencia, familias que dejaron los
              cultivos de coca y sobrevivientes del terrorismo en los Andes peruanos.
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollTo('#impacto')}
              className="group relative overflow-hidden border border-inca-gold/40 text-inca-gold text-sm font-semibold px-6 py-3 rounded-full tracking-wide whitespace-nowrap cursor-pointer transition-all duration-300 hover:border-inca-gold hover:text-inca-brown"
            >
              <span className="absolute inset-0 bg-inca-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
              <span className="relative flex items-center gap-2">
                Ver el impacto
                <i className="ri-arrow-right-line text-base transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
