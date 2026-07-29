import Navbar from '@/components/Navbar';
import HeroV2 from '@/components/home/HeroV2';
import PainPoints from '@/components/home/PainPoints';
import SolutionShowcase from '@/components/home/SolutionShowcase';
import FeatureCards from '@/components/FeatureCards';
import StrategyMap from '@/components/StrategyMap';
import AISection from '@/components/AISection';
import TrustProof from '@/components/home/TrustProof';
import FAQ from '@/components/home/FAQ';
import FinalCTA from '@/components/home/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 tactical-grid opacity-30 pointer-events-none -z-10" aria-hidden="true" />
      <Navbar />
      <HeroV2 />
      <PainPoints />
      <SolutionShowcase />
      <FeatureCards />
      <StrategyMap />
      <AISection />
      <TrustProof />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
