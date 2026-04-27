import { useState, useEffect, useRef, useCallback } from 'react';

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

const grupos = [
  {
    key: 'fundadoras',
    accent: '#c9972c',
    tag: 'Las Fundadoras',
    icon: 'ri-heart-line',
    name: 'Las Fundadoras',
    role: 'Mujeres que reconstruyeron su vida',
    desc: 'Sobrevivieron la violencia doméstica. Algunas lo perdieron todo. Pero encontraron en la tierra peruana su sanación. Hoy son las manos más cuidadosas del café — y los corazones más fuertes de los Andes.',
    stat: '120+',
    statLabel: 'familias beneficiadas',
    photo: '/Project/images/fundadoras.jpg',
  },
  {
    key: 'semilla',
    accent: '#6ee7b7',
    tag: 'Semilla Nueva',
    icon: 'ri-seedling-line',
    name: 'Semilla Nueva',
    role: 'De la hoja de coca al grano de oro',
    desc: 'Cultivaban coca porque era lo único que daba dinero. Hoy eligieron el café. No fue fácil — significó coraje frente al miedo. Ahora sus fincas son ejemplo para toda la región.',
    stat: '85+',
    statLabel: 'agricultores reconvertidos',
    photo: '/Project/images/semillanueva.jpg',
  },
  {
    key: 'guardianes',
    accent: '#fca5a5',
    tag: 'Los Guardianes',
    icon: 'ri-shield-line',
    name: 'Los Guardianes',
    role: 'Sobrevivientes del terrorismo',
    desc: 'Vivieron el horror del terrorismo en sus pueblos. Vieron destruirse todo lo que amaban. Pero no se fueron — se quedaron a reconstruir. Hoy guardan la tierra y el futuro de sus comunidades.',
    stat: '200+',
    statLabel: 'comunidades protegidas',
    photo: '/Project/images/guardianes.jpeg',
  },
];

export default function GruposSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = grupos.length;

  const go = useCallback((index: number) => {
    if (animating || index === current) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 500);
  }, [animating, current]);

  const goNext = useCallback(() => go((current + 1) % total), [current, go, total]);
  const goPrev = useCallback(() => go((current - 1 + total) % total), [current, go, total]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, 6000);
  };

  useEffect(() => {
    timerRef.current = setInterval(goNext, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [goNext]);

  const getPos = (i: number) => {
    const diff = (i - current + total) % total;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === total - 1) return 'left';
    return 'hidden';
  };

  return (
    <section id="historias" className="relative py-0 overflow-hidden">
      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .grupos-progress { animation: progressFill 6s linear forwards; }

        .grupos-card {
          position: absolute;
          top: 0;
          transition: transform 0.55s cubic-bezier(.22,.68,0,1.15),
                      opacity 0.55s ease,
                      filter 0.55s ease,
                      z-index 0s;
          will-change: transform, opacity, filter;
          cursor: pointer;
        }
        .grupos-card.center {
          transform: translateX(-50%) scale(1);
          left: 50%;
          opacity: 1;
          filter: brightness(1);
          z-index: 10;
          cursor: default;
        }
        .grupos-card.left {
          transform: translateX(-94%) scale(0.84);
          left: 50%;
          opacity: 0.85;
          filter: brightness(0.5) saturate(0.4);
          z-index: 5;
        }
        .grupos-card.right {
          transform: translateX(-6%) scale(0.84);
          left: 50%;
          opacity: 0.85;
          filter: brightness(0.5) saturate(0.4);
          z-index: 5;
        }
        .grupos-card.hidden {
          transform: translateX(-50%) scale(0.6);
          left: 50%;
          opacity: 0;
          z-index: 0;
          pointer-events: none;
        }
        .grupos-card.left:hover,
        .grupos-card.right:hover {
          filter: brightness(0.7) saturate(0.6);
          opacity: 1;
        }
      `}</style>

      {/* Video de fondo */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Project/videos/video4.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/82" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center pt-10 mb-10">
          <span className="section-eyebrow">Las tres familias</span>
          <h2 className="section-title mb-3" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.8)' }}>
            Tres historias.<br />Una misma <em>tierra.</em>
          </h2>
          <p className="text-white/65 text-sm max-w-xl mx-auto leading-relaxed" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
            No son solo agricultores. Son sobrevivientes. Cada uno lleva en sus manos una historia
            que no debería olvidarse — y que ahora, en cada taza, cada tableta y cada tejido, llega hasta ti.
          </p>
        </div>

        {/* Cards stage */}
        <div className="relative mx-auto" style={{ height: 480, maxWidth: 1000 }}>
          {grupos.map((g, i) => {
            const pos = getPos(i);
            const isCenter = pos === 'center';
            return (
              <div
                key={g.key}
                className={`grupos-card ${pos}`}
                style={{ width: isCenter ? 400 : 320 }}
                onClick={() => { if (!isCenter) { go(i); resetTimer(); } }}
              >
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    height: isCenter ? 460 : 420,
                    boxShadow: isCenter ? `0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${g.accent}30` : 'none',
                  }}
                >
                  <img
                    src={g.photo}
                    alt={g.name}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isCenter
                        ? 'linear-gradient(to top, rgba(10,6,2,0.97) 0%, rgba(10,6,2,0.55) 50%, rgba(10,6,2,0.1) 100%)'
                        : 'linear-gradient(to top, rgba(10,6,2,0.85) 0%, rgba(10,6,2,0.3) 100%)',
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="mb-3">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
                        style={{ color: g.accent, borderColor: `${g.accent}50`, background: `${g.accent}15` }}
                      >
                        <i className={`${g.icon} text-xs`} />
                        {g.tag}
                      </span>
                    </div>
                    <h3 className={`font-playfair font-bold text-white leading-tight mb-2 ${isCenter ? 'text-2xl' : 'text-xl'}`}>
                      {g.name}
                    </h3>
                    <div
                      className="text-xs font-semibold tracking-widest uppercase mb-3"
                      style={{ color: g.accent }}
                    >
                      {g.role}
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <i className="ri-group-line text-xs" style={{ color: g.accent }} />
                      <span className={`font-playfair font-bold ${isCenter ? 'text-2xl' : 'text-lg'}`} style={{ color: g.accent }}>
                        {g.stat}
                      </span>
                      <span className="text-white/40 text-xs">{g.statLabel}</span>
                    </div>
                    {isCenter && (
                      <>
                        <p className="text-white/65 text-sm leading-relaxed mb-5">
                          {g.desc}
                        </p>
                        <button
                          onClick={() => scrollTo('#personas-section')}
                          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 cursor-pointer group w-fit"
                          style={{ color: g.accent }}
                        >
                          Conocer sus historias
                          <i className="ri-arrow-right-line transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                      </>
                    )}
                  </div>
                  {isCenter && (
                    <div className="absolute top-5 right-5 font-mono text-xs text-white/40">
                      <span className="text-white/70 font-semibold">{String(current + 1).padStart(2, '0')}</span>
                      <span className="mx-1">/</span>
                      {String(total).padStart(2, '0')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom controls */}
        <div className="mt-6 pb-10 flex items-center justify-center gap-6">
          <button
            onClick={() => { goPrev(); resetTimer(); }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 hover:border-white/50 bg-black/30 hover:bg-black/50 transition-all cursor-pointer"
          >
            <i className="ri-arrow-left-s-line text-white text-xl" />
          </button>

          <div className="flex items-center gap-4">
            {grupos.map((gr, i) => (
              <button
                key={gr.key}
                onClick={() => { go(i); resetTimer(); }}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <span
                  className="text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-300"
                  style={{
                    color: i === current ? gr.accent : 'rgba(255,255,255,0.22)',
                    fontSize: i === current ? '11px' : '10px',
                  }}
                >
                  {gr.tag}
                </span>
                <div
                  className="h-0.5 rounded-full overflow-hidden transition-all duration-400"
                  style={{ width: i === current ? 56 : 28, background: 'rgba(255,255,255,0.12)' }}
                >
                  {i === current && (
                    <div
                      key={`prog-${current}`}
                      className="h-full rounded-full grupos-progress"
                      style={{ background: gr.accent }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => { goNext(); resetTimer(); }}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 hover:border-white/50 bg-black/30 hover:bg-black/50 transition-all cursor-pointer"
          >
            <i className="ri-arrow-right-s-line text-white text-xl" />
          </button>
        </div>
      </div>
    </section>
  );
}
