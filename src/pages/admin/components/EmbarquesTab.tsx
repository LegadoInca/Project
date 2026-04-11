const timelineSteps = [
  { label: 'Callao', done: true },
  { label: 'Panamá', done: true },
  { label: 'Atlántico', done: false, active: true },
  { label: 'Rotterdam', done: false },
  { label: 'Praga', done: false },
];

export default function EmbarquesTab() {
  return (
    <div>
      <div className="portal-header"><h1>Embarques</h1></div>
      <div className="panel">
        <div className="panel-hdr">
          <span className="panel-title">Contenedor Activo — #CTR-2025-04</span>
          <span className="badge warn"><span className="badge-dot" />En tránsito</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div><div className="text-white/40 text-xs">Naviera</div><div className="text-white text-sm">Maersk Line</div></div>
          <div><div className="text-white/40 text-xs">Bill of Lading</div><div className="text-white text-sm font-mono">MAEU-204987XX</div></div>
          <div><div className="text-white/40 text-xs">ETA Rotterdam</div><div className="text-inca-gold text-sm">28 Jul 2025</div></div>
        </div>

        {/* Timeline */}
        <div className="relative flex items-center justify-between mt-8 px-4">
          <div className="absolute h-0.5 bg-white/10 left-4 right-4 top-4" />
          {timelineSteps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center gap-2 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                step.done ? 'bg-inca-gold border-inca-gold text-inca-dark' :
                step.active ? 'bg-inca-brown-2 border-inca-gold text-inca-gold animate-pulseGold' :
                'bg-inca-brown-2 border-white/20 text-white/30'
              }`}>
                {step.done ? '✓' : step.active ? '◉' : '○'}
              </div>
              <span className={`text-xs whitespace-nowrap ${step.done ? 'text-inca-gold' : step.active ? 'text-white' : 'text-white/30'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
