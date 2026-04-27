export default function ProcesoSection() {
  return (
    <section id="proceso" className="relative">
      {/* Video background header */}
      <div className="relative h-80 overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={import.meta.env.BASE_URL + 'videos/video2.mp4'} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <span className="section-eyebrow">De la tierra a tu taza</span>
          <h2 className="section-title">
            Transparencia total<br />en cada <em>paso</em>
          </h2>
        </div>
      </div>
    </section>
  );
}
