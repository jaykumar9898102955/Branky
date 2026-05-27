import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import TrustBarSection from '@/components/sections/TrustBarSection'
import TickerSection from '@/components/sections/TickerSection'
import TechPillsSection from '@/components/sections/TechPillsSection'
import PainPointSection from '@/components/sections/PainPointSection'
import ProgramsSection from '@/components/sections/ProgramsSection'
import FreeDemoStrip from '@/components/sections/FreeDemoStrip'
import FacilitySection from '@/components/sections/FacilitySection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBarSection />
        <TickerSection />
        <TechPillsSection />
        <PainPointSection />
        <ProgramsSection />
        <FreeDemoStrip />
        <FacilitySection />
      </main>
      <Footer />
    </>
  )
}
