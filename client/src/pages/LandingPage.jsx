import Navbar from '../components/Navbar';
import HeroSection from '../components/landing/HeroSection';
import TickerBar from '../components/landing/TickerBar';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import ProgramsSection from '../components/landing/ProgramsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FooterSection from '../components/landing/FooterSection';

/**
 * LandingPage
 * The Navbar is rendered here as a sticky element that OVERLAYS the dark hero.
 * Because the Navbar uses `sticky top-0`, it floats naturally above the hero
 * (which has pt-0 / no extra padding). On scroll, the Navbar's own glassmorphism
 * kicks in via the scrolled state inside Navbar.jsx.
 *
 * On all OTHER pages the Navbar is also `sticky top-0` with the glassmorphism
 * always active (non landing-page paths).
 */
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#060914]">
      {/* Navbar: sticky at the very top; transparent on hero, blurs on scroll */}
      <Navbar />

      {/* Hero: no top padding needed — the hero itself accounts for its height */}
      <div style={{ marginTop: '-66px' }}>
        <HeroSection />
      </div>

      {/* Rest of sections */}
      <TickerBar />
      <StatsSection />
      <FeaturesSection />
      <ProgramsSection />
      <TestimonialsSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
