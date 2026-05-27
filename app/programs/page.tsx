import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProgramsSection from '@/components/sections/ProgramsSection'
import FreeDemoStrip from '@/components/sections/FreeDemoStrip'
import RevealObserver from '@/components/ui/RevealObserver'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Programs & Courses — Branky STEM Labs Vadodara',
  description: 'Age-wise robotics, AI, coding and STEM programs for children aged 4–14 in Vadodara. 5 structured courses from beginner to advanced.',
}

export default function ProgramsPage() {
  return (
    <>
      <RevealObserver />
      <Navbar />
      <main>
        {/* Page Hero */}
        <section style={{ padding:'120px 5% 72px', background:'linear-gradient(135deg,var(--blue-xpale) 0%,#fff 60%)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-60, width:'30%', maxWidth:340, opacity:.12, pointerEvents:'none', animation:'blobFloat 10s ease-in-out infinite' }}>
            <Image src="/assets/brand-wave.png" alt="" width={340} height={340} style={{ width:'100%', height:'auto' }} />
          </div>
          <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
            <div className="tag tag-blue">Programs at Branky STEM Labs</div>
            <h1 className="h-display" style={{ fontSize:'clamp(2rem,4vw,3.4rem)', color:'var(--black)', marginBottom:16, lineHeight:1.1 }}>
              Hands-on, <span style={{ color:'var(--blue)' }}>level-wise learning</span> designed to help<br />
              young minds explore, build and understand future technologies.
            </h1>
            <div style={{ display:'flex', gap:8, marginBottom:0 }}>
              <div style={{ height:4, width:40, background:'var(--orange)', borderRadius:8 }} />
              <div style={{ height:4, width:120, background:'var(--blue)', borderRadius:8 }} />
            </div>
          </div>
        </section>

        <ProgramsSection />
        <FreeDemoStrip />
      </main>
      <Footer />
    </>
  )
}
