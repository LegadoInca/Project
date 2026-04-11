import { useState } from 'react';
import Navbar from '../../components/feature/Navbar';
import LoginModal from '../../components/feature/LoginModal';
import Footer from '../../components/feature/Footer';
import CookieBar from '../../components/feature/CookieBar';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import StatsBar from './components/StatsBar';
import OngBanner from './components/OngBanner';
import PersonasSection from './components/PersonasSection';
import GruposSection from './components/GruposSection';
import UniversoSection from './components/UniversoSection';
import ImpactoSection from './components/ImpactoSection';
import ContactSection from './components/ContactSection';

export default function HomePage() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-inca-brown">
      <Navbar onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main>
        <HeroSection />
        <MarqueeSection />
        <StatsBar />
        <OngBanner />
        <PersonasSection />
        <GruposSection />
        <UniversoSection />
        <ImpactoSection />
        <ContactSection />
      </main>

      <Footer />
      <CookieBar />
    </div>
  );
}
