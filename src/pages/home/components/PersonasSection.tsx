import { useState, useEffect, useRef } from 'react';

const personas = [
  {
    num: '01',
    tag: 'Las Fundadoras',
    name: 'María Elena',
    product: 'Café Geisha · Villa Rica, Pasco',
    quote: '\"Me quedé sin nada. Solo con mis tres hijos y esta tierra. Aprendí sola a cultivar el café. Hoy mis granos llegan a Alemania.\"',
    photo: '/images/personas2.jpg',
    objectPosition: '60% 15%',
    accent: '#c9972c',
    accentMuted: 'rgba(201,151,44,0.15)',
  },
  {
    num: '02',
    tag: 'Semilla Nueva',
    name: 'Jorge',
    product: 'Café Natural · Chanchamayo, Junín',
    quote: '\"Cultivé coca 15 años. No había otra salida. Cuando cambié al café, me amenazaron. Pero seguí. Hoy mi café es lo mejor que he hecho en mi vida.\"',
    photo: '/images/personas1.jpeg',
    objectPosition: '50% 20%',
    accent: '#6ee7b7',
    accentMuted: 'rgba(110,231,183,0.10)',
  },
  {
    num: '03',
    tag: 'Los Guardianes',
    name: 'Rosa',
    product: 'Artesanías Kené · Ucayali',
    quote: '\"Sendero Luminoso quemó nuestra comunidad. Volví 10 años después a tejer donde antes había ceniza.\"',
    photo: '/images/personas3.jpg',
    objectPosition: '50% 25%',
    accent: '#fca5a5',
    accentMuted: 'rgba(252,165,165,0.10)',
  },
];

export default function PersonasSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (index: number, dir: 'next' | 'prev') => {
    if (animating || index === current) return;
    setDirection(dir);
    setPrev(current);
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => {
      setPrev(null);
      setAnimating(false);
    }, 700);
  };

  const goNext = () => go((current + 1) % personas.length, 'next');
  const goPrev = () => go((current - 1 + personas.length) % personas.length, 'prev');

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, 7000);
  };

  useEffect(() => {
    timerRef.current = setInterval(goNext, 7000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const slideInClass = direction === 'next'
    ? 'animate-slide-in-right'
    : 'animate-slide-in-left';

  const slideOutClass = direction === 'next'
    ? 'animate-slide-out-left'
    : 'animate-slide-out-right';

  return (
    <section id="personas-section" className="bg-inca-brown py-0">
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-60px); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(60px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(1.02); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-slide-in-right  { animation: slideInRight 0.65s cubic-bezier(.22,.68,0,1.2) forwards; }
        .animate-slide-in-left   { animation: slideInLeft  0.65s cubic-bezier(.22,.68,0,1.2) forwards; }
        .animate-slide-out-left  { animation: slideOutLeft  0.45s cubic-bezier(.4,0,.6,1) forwards; }
        .animate-slide-out-right { animation: slideOutRight 0.45s cubic-bezier(.4,0,.6,1) forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.55s ease forwards; }
        .animate-scale-in   { animation: scaleIn  0.75s ease forwards; }

        .personas-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 99px;
          border: 1px solid currentColor;
          opacity: 0.85;
        }
        .progress-bar {
          height: 2px;
          background: rgba(255,255,255,0.15);
          border-radius: 99px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.3s ease;
        }
        .thumb-circle {
          position: relative;
          border-radius: 50%;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(.22,.68,0,1.2), box-shadow 0.35s ease;
          cursor: pointer;
        }
        .thumb-circle:hover {
          transform: scale(1.08) !important;
        }
        .thumb-circle.active {
          transform: scale(1.15) !important;
        }
      `}</style>

      <div className="relative w-full overflow-hidden" style={{ height: 620 }}>

        {/* ── PHOTO LAYERS ── */}
        {personas.map((persona, i) => {
          const isActive = i === current;
          const isPrev   = i === prev;
          return (
            <div
              key={i}
              className="absolute inset-0"
              style={{ zIndex: isActive ? 2 : isPrev ? 1 : 0 }}
            >
              <img
                src={persona.photo}
                alt={persona.name}
                className={`w-full h-full object-cover ${isActive ? 'animate-scale-in' : ''}`}
                style={{ objectPosition: persona.objectPosition, willChange: 'transform, opacity' }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(
                    to right,
                    rgba(30,18,8,0.18) 0%,
                    rgba(30,18,8,0.35) 35%,
                    rgba(30,18,8,0.82) 60%,
                    rgba(30,18,8,0.97) 100%
                  )`,
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-32"
                style={{ background: 'linear-gradient(to top, #1e1208, transparent)' }}
              />
            </div>
          );
        })}

        {/* ── CONTENT PANEL ── */}
        <div className="absolute inset-0 flex items-center justify-end z-10">
          <div className="w-full lg:w-[52%] px-8 md:px-14 py-10 relative">
            {prev !== null && (
              <div
                key={`prev-${prev}`}
                className={`absolute inset-0 px-8 md:px-14 py-10 flex flex-col justify-center ${slideOutClass}`}
                style={{ zIndex: 1 }}
              >
                <ContentBlock persona={personas[prev]} />
              </div>
            )}
            <div
              key={`curr-${current}`}
              className={`relative flex flex-col justify-center ${animating ? slideInClass : ''}`}
              style={{ zIndex: 2 }}
            >
              <ContentBlock persona={personas[current]} />
            </div>
          </div>
        </div>

        {/* ── THUMBNAIL STRIP ── */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-0">
          {personas.map((persona, i) => {
            const isActive = i === current;
            return (
              <div key={i} className="flex flex-col items-center">
                {i > 0 && (
                  <div
                    className="w-px transition-all duration-500"
                    style={{
                      height: 28,
                      background: isActive || i - 1 === current
                        ? `linear-gradient(to bottom, ${personas[i - 1].accent}, ${persona.accent})`
                        : 'rgba(255,255,255,0.15)',
                    }}
                  />
                )}
                <button
                  onClick={() => { go(i, i > current ? 'next' : 'prev'); resetTimer(); }}
                  className={`thumb-circle ${isActive ? 'active' : ''}`}
                  style={{
                    width: isActive ? 72 : 52,
                    height: isActive ? 72 : 52,
                    boxShadow: isActive
                      ? `0 0 0 3px ${persona.accent}, 0 0 20px ${persona.accent}55`
                      : '0 0 0 2px rgba(255,255,255,0.12)',
                    transition: 'width 0.35s ease, height 0.35s ease, box-shadow 0.35s ease, transform 0.35s cubic-bezier(.22,.68,0,1.2)',
                  }}
                >
                  <img
                    src={persona.photo}
                    alt={persona.name}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: persona.objectPosition,
                      filter: isActive ? 'none' : 'brightness(0.4) saturate(0.3)',
                      transition: 'filter 0.4s ease',
                    }}
                  />
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${persona.accent}33, transparent 70%)`,
                      }}
                    />
                  )}
                </button>
                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{
                    maxHeight: isActive ? 32 : 0,
                    opacity: isActive ? 1 : 0,
                    marginTop: isActive ? 6 : 0,
                    transition: 'max-height 0.4s ease, opacity 0.4s ease, margin-top 0.3s ease',
                  }}
                >
                  <span
                    className="text-xs font-bold tracking-widest uppercase whitespace-nowrap"
                    style={{ color: persona.accent }}
                  >
                    {persona.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── NAV ARROWS ── */}
        <button
          onClick={() => { goPrev(); resetTimer(); }}
          className="absolute bottom-6 right-24 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-white/60 bg-black/30 hover:bg-black/50 transition-all duration-200 cursor-pointer"
        >
          <i className="ri-arrow-left-s-line text-white text-xl" />
        </button>
        <button
          onClick={() => { goNext(); resetTimer(); }}
          className="absolute bottom-6 right-10 z-20 w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-white/60 bg-black/30 hover:bg-black/50 transition-all duration-200 cursor-pointer"
        >
          <i className="ri-arrow-right-s-line text-white text-xl" />
        </button>

        {/* ── PROGRESS BARS ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
          {personas.map((persona, i) => (
            <button
              key={i}
              onClick={() => { go(i, i > current ? 'next' : 'prev'); resetTimer(); }}
              className="cursor-pointer progress-bar"
              style={{ width: i === current ? 48 : 20, transition: 'width 0.4s ease' }}
            >
              <div
                className="progress-bar-fill"
                style={{ width: '100%', background: i === current ? persona.accent : 'rgba(255,255,255,0.4)' }}
              />
            </button>
          ))}
        </div>

        {/* ── SECTION TITLE ── */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
          <h3
            className="font-playfair text-base md:text-lg font-bold tracking-[0.18em] uppercase"
            style={{
              color: 'rgba(255,255,255,0.82)',
              textShadow: '0 2px 12px rgba(0,0,0,0.7)',
              letterSpacing: '0.18em',
            }}
          >
            Estas son las personas detrás de cada producto
          </h3>
        </div>

        {/* ── SLIDE COUNTER ── */}
        <div className="absolute top-6 right-10 z-20 text-white/40 text-sm font-mono">
          <span className="text-white/80 font-semibold">{String(current + 1).padStart(2, '0')}</span>
          <span className="mx-1">/</span>
          {String(personas.length).padStart(2, '0')}
        </div>

      </div>
    </section>
  );
}

function ContentBlock({ persona }: { persona: typeof personas[0] }) {
  return (
    <div>
      <div className="mb-5">
        <span className="personas-tag-pill" style={{ color: persona.accent, borderColor: persona.accent }}>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: persona.accent }}
          />
          {persona.tag}
        </span>
      </div>
      <div
        className="font-playfair text-8xl font-bold leading-none mb-2 select-none"
        style={{ color: `${persona.accent}22` }}
      >
        {persona.num}
      </div>
      <h2 className="font-playfair text-5xl md:text-6xl font-bold text-white leading-tight mb-2">
        {persona.name}
      </h2>
      <div className="text-sm font-semibold tracking-widest uppercase mb-6" style={{ color: persona.accent }}>
        {persona.product}
      </div>
      <div className="w-12 h-px mb-6" style={{ background: persona.accent }} />
      <blockquote
        className="text-white/85 text-lg md:text-xl font-playfair italic leading-relaxed max-w-md"
        style={{
          borderLeft: `3px solid ${persona.accent}`,
          paddingLeft: '1.2rem',
        }}
      >
        {persona.quote}
      </blockquote>
    </div>
  );
}
