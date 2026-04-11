import { useEffect, useRef, useState } from 'react';

const stats = [
  { num: 142, label: 'Familias productoras', counter: true },
  { num: 3, label: 'Grupos de vida', counter: false, display: '3' },
  { num: 1800, label: 'Altitud promedio', counter: false, display: '1,800m' },
  { num: 18, label: 'Países destino', counter: true },
  { num: 10, label: 'De cada venta a la ONG', counter: false, display: '10%' },
];

function Counter({ target, active }: { target: number; active: boolean }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [active, target]);

  return <>{count}</>;
}

export default function StatsBar() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-inca-brown border-b border-inca-gold/10 py-8 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="font-playfair text-3xl font-bold text-inca-gold mb-1">
              {s.counter ? (
                <Counter target={s.num} active={inView} />
              ) : (
                s.display
              )}
            </div>
            <div className="text-white/50 text-xs uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
