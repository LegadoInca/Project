const steps = [
  { n: '01', icon: '🌱', title: 'Cultivo artesanal', desc: 'Entre 1,400 y 2,100 msnm. Sombra, biodiversidad y manos que conocen cada planta por su nombre.' },
  { n: '02', icon: '✋', title: 'Cosecha selectiva', desc: 'Solo cerezas maduras, recogidas a mano. Sin máquinas. Sin prisa. Con el respeto de quien sabe que cada fruto es un futuro.' },
  { n: '03', icon: '☀️', title: 'Beneficio y secado', desc: 'Proceso natural, lavado o miel según cada finca. Fermentación controlada. Secado bajo el sol andino.' },
  { n: '04', icon: '🔬', title: 'Cata y certificación', desc: 'Cada lote catado por Q-Graders SCA. Solo los que superan 84 puntos llevan el nombre Legado Inca.' },
  { n: '05', icon: '🚢', title: 'Exportación directa', desc: 'En sacos GrainPro desde Lima. Trazabilidad completa con código QR que te lleva directo a la finca.' },
  { n: '06', icon: '☕', title: 'En tu taza', desc: '24-72 horas después del tostado. Fresco. Con nombre y apellido. Con la historia de quien lo plantó.' },
];

export default function ProcesoSection() {
  return (
    <section id="proceso" className="relative">
      {/* Video background header */}
      <div className="relative h-80 overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="https://res.cloudinary.com/djfmngyl0/video/upload/v1773436299/14701095_1920_1080_30fps_amrqfg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <span className="section-eyebrow">De la tierra a tu taza</span>
          <h2 className="section-title">
            Transparencia total<br />en cada <em>paso</em>
          </h2>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-inca-brown-2 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.n} className="flex gap-4">
              <div>
                <div className="text-inca-gold/30 font-playfair text-xs font-bold mb-1">{s.n}</div>
                <div className="text-2xl">{s.icon}</div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-2">{s.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
