const items = [
  'Café de Especialidad Peruano',
  'HOLZEN — Café Premium',
  'COYA — Cacao del Perú',
  '10% a ONG Semilla Nueva',
  'Artesanías Andinas Certificadas',
  'Comercio Justo · EUDR Compliant',
  'Envío a toda Europa',
];

export default function MarqueeSection() {
  const doubled = [...items, ...items];

  return (
    <div className="bg-inca-gold/10 border-y border-inca-gold/20 overflow-hidden py-3">
      <div className="flex animate-marquee whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="text-inca-gold text-xs font-semibold tracking-wider uppercase px-6">
              {item}
            </span>
            <span className="text-inca-gold/40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
