import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FacilitySection from '@/components/sections/FacilitySection'
import GallerySection from '@/components/sections/GallerySection'
import FreeDemoStrip from '@/components/sections/FreeDemoStrip'
import RevealObserver from '@/components/ui/RevealObserver'
import Image from 'next/image'


export const metadata: Metadata = {
  title: 'Our Labs & Facilities — Branky STEM Labs Vadodara',
  description: 'Explore our dedicated robotics lab, AC classrooms, advanced robotics kits, electronics & coding setup, and Robo Soccer Arena in Vadodara.',
  alternates: { canonical: 'https://brankystemlab.com/our-labs' },
  openGraph: {
    title: 'Our Labs & Facilities — Branky STEM Labs Vadodara',
    description: 'Explore our dedicated robotics lab, AC classrooms, advanced robotics kits, electronics & coding setup, and Robo Soccer Arena in Vadodara.',
    url: '/our-labs',
    images: [{ url: '/assets/brand-banner.png', width: 1200, height: 630, alt: 'Branky STEM Labs Facilities and Robotics Lab Vadodara' }],
  },
  twitter: {
    title: 'Our Labs & Facilities — Branky STEM Labs Vadodara',
    description: 'Explore our dedicated robotics lab, AC classrooms, advanced robotics kits, electronics & coding setup, and Robo Soccer Arena in Vadodara.',
    images: ['/assets/brand-banner.png'],
  },
}

export default function OurLabsPage() {
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
<div className="tag tag-blue">Our Labs & Facilities</div>
            <h1 className="h-display" style={{ fontSize:'clamp(2rem,2vw,3.4rem)', color:'var(--black)', marginBottom:16, lineHeight:1.1 }}>
              Building the Next Generation of<br/>
              <span style={{ color:'var(--orange)' }}>Tech Creators</span> &amp; <span style={{ color:'var(--blue)' }}>Innovators</span>
            </h1>
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ height:4, width:40, background:'var(--orange)', borderRadius:8 }} />
              <div style={{ height:4, width:120, background:'var(--blue)', borderRadius:8 }} />
            </div>
          </div>
        </section>

        <FacilitySection />
        <GallerySection />
        <FreeDemoStrip />
      </main>
      <Footer />

    </>
  )
}
