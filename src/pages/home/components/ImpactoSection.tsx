import { useEffect, useRef, useState } from 'react';

/* ─── Animated Counter ─── */
function Counter({ target, active, suffix = '' }: { target: number; active: boolean; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const duration = 2200;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(ease * target));
      if (t < 1) requestAnimationFrame(animate);
      else setDone(true);
    };
    requestAnimationFrame(animate);
  }, [active, target]);

  return (
    <span className={done ? 'animate-pulse-once' : ''}>
      {count}{suffix}
    </span>
  );
}

/* ─── SVG Ring Progress ─── */
function RingProgress({ pct, active, delay }: { pct: number; active: boolean; delay: number }) {
  const [progress, setProgress] = useState(0);
  const r = 36;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => {
      const duration = 2000;
      const start = performance.now();
      const animate = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        setProgress(t * pct);
        if (t < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, delay);
    return () => clearTimeout(timer);
  }, [active, pct, delay]);

  return (
    <svg width="88" height="88" className="rotate-[-90deg]">
      <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle
        cx="44" cy="44" r={r} fill="none"
        stroke="#C9A84C"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ - (circ * progress) / 100}
        style={{ transition: 'stroke-dashoffset 0.05s linear' }}
      />
    </svg>
  );
}

/* ─── Particles overlay ─── */
function Particles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-inca-gold/20"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatUp ${6 + Math.random() * 8}s ${Math.random() * 5}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Typewriter ─── */
function Typewriter({ text, active }: { text: string; active: boolean }) {
  const [displayed, setDisplayed] = useState('');
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [active, text]);

  return (
    <>
      {displayed}
      {displayed.length < text.length && active && (
        <span className="animate-pulse text-inca-gold">|</span>
      )}
    </>
  );
}

/* ─── Live Ticker ─── */
const tickerItems = [
  '🌱 María Elena recibió apoyo de vivienda · hace 2h',
  '☕ Lote de café exportado a Praga · hace 5h',
  '🎓 3 niños iniciaron escuela · hoy',
  '💛 Familia en Cusco accedió al programa · hace 1 día',
  '📦 Embarque a Amsterdam confirmado · hace 3h',
  '🤝 Nueva familia Guardian vinculada · hace 6h',
];

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((p) => (p + 1) % tickerItems.length);
        setFade(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-inca-gold/20 rounded-full px-5 py-2.5 mt-8 backdrop-blur-sm">
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
      <span
        className="text-white/70 text-xs font-mono tracking-wide"
        style={{ transition: 'opacity 0.4s', opacity: fade ? 1 : 0 }}
      >
        {tickerItems[idx]}
      </span>
    </div>
  );
}

/* ─── Stats Data ─── */
const stats = [
  { num: 142, suffix: '', label: 'Familias apoyadas', pct: 71, delay: 0 },
  { num: 340, suffix: '', label: 'Niños en educación', pct: 85, delay: 150 },
  { num: 48, suffix: 'K€', label: 'Donados en 2024', pct: 60, delay: 300 },
  { num: 38, suffix: '', label: 'Mujeres en prog. vivienda', pct: 48, delay: 450 },
];

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function ImpactoSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="impacto" className="relative py-24 px-6 overflow-hidden">
      {/* Video BG */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source
          src="https://res.cloudinary.com/djfmngyl0/video/upload/v1774742813/3365440-uhd_3840_2160_30fps_mvpetn.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#3b1f0a]/65 to-black/85" />

      {/* Horizontal scanline effect */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)' }}
      />

      {/* Floating particles */}
      <Particles />

      {/* Content */}
      <div ref={ref} className="relative z-20 max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{ transform: inView ? 'translateY(0)' : 'translateY(30px)', opacity: inView ? 1 : 0, transition: 'all 0.8s ease' }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="section-eyebrow">ONG Semilla Nueva · 10% de cada venta</span>
          </div>
          <h2 className="section-title">
            Tu compra<br /><em>cambia vidas</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Stats rings grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="group relative border border-inca-gold/20 rounded-2xl p-6 text-center bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-inca-gold/50 cursor-default"
                style={{
                  transform: inView ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                  opacity: inView ? 1 : 0,
                  transition: `all 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 120}ms`,
                }}
              >
                {/* Ring */}
                <div className="relative flex items-center justify-center mx-auto mb-3 w-[88px] h-[88px]">
                  <RingProgress pct={s.pct} active={inView} delay={s.delay} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-playfair text-xl font-bold text-inca-gold">
                      {inView ? <Counter target={s.num} active={inView} suffix={s.suffix} /> : '0'}
                    </span>
                  </div>
                </div>
                <div className="text-white/60 text-xs uppercase tracking-wider leading-tight">{s.label}</div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-inca-gold/0 group-hover:bg-inca-gold/5 transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Quote + text */}
          <div
            style={{
              transform: inView ? 'translateX(0)' : 'translateX(50px)',
              opacity: inView ? 1 : 0,
              transition: 'all 0.9s ease 0.4s',
            }}
          >
            <blockquote className="font-playfair text-2xl md:text-3xl italic text-white leading-snug mb-6 border-l-2 border-inca-gold pl-6 min-h-[4rem]">
              "<Typewriter text="No vendemos café. Exportamos dignidad." active={inView} />"
            </blockquote>

            <p className="text-white/65 text-sm leading-relaxed mb-2">
              La ONG Semilla Nueva trabaja directamente con las tres comunidades. Con cada venta, el
              10% va a programas de vivienda para mujeres, educación para los hijos de los Guardianes,
              y apoyo psicológico para familias que vivieron el conflicto armado.
            </p>

            {/* Live activity ticker */}
            <LiveTicker />

            <button
              className="btn-primary mt-8"
              onClick={() => scrollTo('#universo')}
            >
              Compra y genera impacto
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(8px); opacity: 0.7; }
          50% { transform: translateY(-35px) translateX(-5px); opacity: 0.4; }
          75% { transform: translateY(-15px) translateX(10px); opacity: 0.6; }
        }
        @keyframes pulse-once {
          0% { text-shadow: 0 0 0px #C9A84C; }
          50% { text-shadow: 0 0 20px #C9A84C, 0 0 40px #C9A84C88; }
          100% { text-shadow: 0 0 0px #C9A84C; }
        }
        .animate-pulse-once { animation: pulse-once 1s ease-out forwards; }
      `}</style>
    </section>
  );
}
