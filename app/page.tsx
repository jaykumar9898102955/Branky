import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: 'Branky STEM Labs — AI, Robotics & Coding for Kids | Vadodara',
  description: "Vadodara's full-fledged AI, Robotics & Coding learning centre for children aged 4–14. Hands-on programs, smart labs, expert mentors.",
  openGraph: {
    title: 'Branky STEM Labs — AI, Robotics & Coding for Kids | Vadodara',
    description: "Vadodara's full-fledged AI, Robotics & Coding learning centre for children aged 4–14. Hands-on programs, smart labs, expert mentors.",
    url: '/',
  },
  twitter: {
    title: 'Branky STEM Labs — AI, Robotics & Coding for Kids | Vadodara',
    description: "Vadodara's full-fledged AI, Robotics & Coding learning centre for children aged 4–14. Hands-on programs, smart labs, expert mentors.",
  },
}

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
