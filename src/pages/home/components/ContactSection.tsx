export default function ContactSection() {
  return (
    <section id="footer-contact" className="bg-inca-brown py-20 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <span className="section-eyebrow">¿Listo para empezar?</span>
        <h2 className="section-title mb-5">
          Hablemos de<br /><em>propósito</em>
        </h2>
        <p className="text-white/60 text-sm max-w-md mx-auto mb-10 leading-relaxed">
          Trabajamos con importadores, tostadoras, hoteles y cafeterías en Europa.
          Respuesta en menos de 24 horas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/51999999999?text=Hola,%20me%20interesa%20Legado%20Inca"
            target="_blank"
            rel="nofollow noreferrer"
            className="btn-primary"
          >
            📱 WhatsApp
          </a>
          <a href="mailto:info@legadoinca.com" className="btn-outline">
            ✉️ Email
          </a>
        </div>
      </div>
    </section>
  );
}
