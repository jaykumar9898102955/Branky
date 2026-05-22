'use client'
import { useState } from 'react'
import Cursor from '@/components/ui/Cursor'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import TickerSection from '@/components/sections/TickerSection'
import AboutSection from '@/components/sections/AboutSection'
import ProgramsSection from '@/components/sections/ProgramsSection'
import GallerySection from '@/components/sections/GallerySection'
import TimelineSection from '@/components/sections/TimelineSection'
import WhySection from '@/components/sections/WhySection'
import MentorsSection from '@/components/sections/MentorsSection'
import ApplyCtaSection from '@/components/sections/ApplyCtaSection'
import ApplyModal from '@/components/ui/ApplyModal'

export default function HomePage() {
  const [open, setOpen] = useState(false)
  const [prog, setProg] = useState('')
  const openModal = (p = '') => { setProg(p); setOpen(true) }
  return (
    <>
      <Cursor />
      <Navbar onApply={() => openModal()} />
      <main>
        <HeroSection onApply={openModal} />
        <TickerSection />
        <AboutSection />
        <ProgramsSection onApply={openModal} />
        <GallerySection />
        <TimelineSection />
        <WhySection />
        <MentorsSection />
        <ApplyCtaSection onApply={() => openModal()} />
      </main>
      <Footer onApply={() => openModal()} />
      <ApplyModal isOpen={open} onClose={() => setOpen(false)} defaultProgram={prog} />
    </>
  )
}
