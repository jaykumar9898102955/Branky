import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FacilitySection from '@/components/sections/FacilitySection'
import GallerySection from '@/components/sections/GallerySection'
import FreeDemoStrip from '@/components/sections/FreeDemoStrip'
import RevealObserver from '@/components/ui/RevealObserver'
import Image from 'next/image'
import Link from 'next/link'
import { FlaskConical, Leaf, Bot, Zap, Settings, Users, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Labs & Facilities — Branky STEM Labs Vadodara',
  description: 'Explore our dedicated robotics lab, AC classrooms, advanced robotics kits, electronics & coding setup, and Robo Soccer Arena in Vadodara.',
}

const facilities: { IC: LucideIcon; title: string; desc: string }[] = [
  { IC:FlaskConical, title:'Dedicated Robotics Lab',    desc:'Purpose-built workspace stocked with the latest robotics kits, sensors, actuators and programming tools for every age group.' },
  { IC:Leaf,         title:'AC Classrooms',             desc:'Comfortable, climate-controlled learning environments so students stay focused and engaged during every session.' },
  { IC:Bot,          title:'Advanced Robotics Kits',    desc:'Professional-grade equipment covering mechanical assembly, electronics and programming across all program levels.' },
  { IC:Zap,          title:'Electronics & Coding Setup',desc:'Dedicated electronics benches with components, microcontrollers, oscilloscopes and coding stations ready for every project.' },
  { IC:Settings,     title:'Practical Workstations',    desc:'Individual project workspaces so every student can build, test and iterate on their own creations in every class.' },
  { IC:Users,        title:'Small Batch Sizes',         desc:'8–12 students per batch ensures every child gets personal attention, guidance and hands-on time with the equipment.' },
  { IC:Target,       title:'Robo Soccer Arena',         desc:'Our competitive robotics arena where students test their builds in friendly matches and prepare for external competitions.' },
]

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
            <h1 className="h-display" style={{ fontSize:'clamp(2rem,4vw,3.4rem)', color:'var(--black)', marginBottom:16, lineHeight:1.1 }}>
              Where <span style={{ color:'var(--orange)' }}>Curiosity</span> Meets<br/>
              <span style={{ color:'var(--blue)' }}>World-Class Equipment</span>
            </h1>
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ height:4, width:40, background:'var(--orange)', borderRadius:8 }} />
              <div style={{ height:4, width:120, background:'var(--blue)', borderRadius:8 }} />
            </div>
          </div>
        </section>

        {/* Full Facility Grid */}
        <section style={{ padding:'80px 5%', background:'#fff' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }} className="labs-grid">
              {facilities.map((f, i) => (
                <div key={f.title} className={`facility-box reveal d${(i%3)+1}`} style={{ padding:'28px 24px' }}>
                  <div style={{ width:52, height:52, background:'var(--blue-pale)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                    <f.IC size={26} style={{ color:'var(--blue)' }} />
                  </div>
                  <h3 className="h-display" style={{ fontSize:'1.1rem', fontWeight:400, color:'var(--black)', marginBottom:10 }}>{f.title}</h3>
                  <p style={{ fontSize:'.88rem', color:'var(--gray)', lineHeight:1.7, margin:0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FacilitySection />
        <GallerySection />
        <FreeDemoStrip />
      </main>
      <Footer />

      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){ .labs-grid{grid-template-columns:repeat(2,1fr)!important;} }
        @media(max-width:480px){ .labs-grid{grid-template-columns:1fr!important;} }
      `}} />
    </>
  )
}
