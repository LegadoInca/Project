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
    <div
      className="overflow-hidden py-3"
      style={{ background: 'linear-gradient(135deg, rgba(201,151,44,0.72) 0%, rgba(232,184,75,0.78) 50%, rgba(201,151,44,0.72) 100%)', backdropFilter: 'blur(4px)' }}
    >
      <div className="flex animate-marquee whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="font-playfair text-xs font-black tracking-wider uppercase px-6"
              style={{ color: '#3d1f00' }}
            >
              {item}
            </span>
            <span style={{ color: 'rgba(61,31,0,0.4)' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
