import { useState, useEffect } from 'react';

type Slide = { type: 'image' | 'video'; src: string };

const slides: Slide[] = [
  { type: 'image', src: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1774742808/pexels-daniel-delgado-574115773-16957837_wpwbjg.jpg' },
  { type: 'video', src: 'https://res.cloudinary.com/djfmngyl0/video/upload/v1774742817/17618554-hd_1920_1080_30fps_snriob.mp4' },
  { type: 'video', src: 'https://res.cloudinary.com/djfmngyl0/video/upload/v1774742813/3365440-uhd_3840_2160_30fps_mvpetn.mp4' },
  { type: 'image', src: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1774742806/pexels-jvalenciazz-12833203_zopukm.jpg' },
  { type: 'image', src: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1773517329/6d8dfba46ceeb0a8f8614947c9f56a04_i4z16w.jpg' },
];

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

export default function HeroSection() {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          {slide.type === 'image' ? (
            <img
              src={slide.src}
              alt="Legado Inca"
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          )}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6">
        <p className="text-inca-gold text-xs font-semibold tracking-[0.3em] uppercase mb-5">
          Café · Cacao · Artesanías · Perú · Europa
        </p>
        <h1 className="font-playfair text-6xl md:text-8xl font-bold text-white leading-none mb-6">
          LEGADO<br /><em className="text-inca-gold italic">INCA</em>
        </h1>
        <p className="text-white/80 text-sm md:text-base max-w-2xl leading-relaxed mb-10">
          Detrás de cada grano, cada semilla y cada tejido, hay una mujer que reconstruyó su vida,
          un hombre que cambió la coca por esperanza, y un guardián que sobrevivió el terror para
          darte este legado.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="btn-primary" onClick={() => scrollTo('#universo')}>
            Compra con propósito
          </button>
          <button className="btn-outline" onClick={() => scrollTo('#historias')}>
            Conoce su historia
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === current ? 'w-6 h-2 bg-inca-gold' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
