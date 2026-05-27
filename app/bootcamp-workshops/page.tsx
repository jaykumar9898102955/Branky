import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FreeDemoStrip from '@/components/sections/FreeDemoStrip'
import BootcampCards from '@/components/ui/BootcampCards'
import RevealObserver from '@/components/ui/RevealObserver'
import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bootcamp & Workshops — Branky STEM Labs Vadodara',
  description: 'Intensive bootcamps and workshops in AI, Robotics, Coding and STEM for children in Vadodara. Competition training, hackathons and project exhibitions.',
}

export default function BootcampPage() {
  return (
    <>
      <RevealObserver />
      <Navbar />
      <main>
        {/* Page Hero */}
        <section style={{ padding:'120px 5% 72px', background:'linear-gradient(135deg,var(--orange-pale) 0%,#fff 60%)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-60, width:'30%', maxWidth:340, opacity:.15, pointerEvents:'none', animation:'blobFloat 10s ease-in-out infinite' }}>
            <Image src="/assets/brand-wave.png" alt="" width={340} height={340} style={{ width:'100%', height:'auto' }} />
          </div>
          <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
<div className="tag tag-orange">Bootcamp &amp; Workshops</div>
            <h1 className="h-display" style={{ fontSize:'clamp(2rem,4vw,3.4rem)', color:'var(--black)', marginBottom:16, lineHeight:1.1 }}>
              Beyond the Classroom —<br/>
              <span style={{ color:'var(--orange)' }}>Compete, Build</span> &amp; <span style={{ color:'var(--blue)' }}>Innovate</span>
            </h1>
            <p style={{ fontSize:'1.05rem', color:'var(--gray)', lineHeight:1.75, maxWidth:580 }}>
              From hackathons to competitions, our bootcamps and workshops give students the platform to apply their skills, challenge themselves and grow beyond the regular curriculum.
            </p>
          </div>
        </section>

        {/* Events Grid */}
        <section style={{ padding:'80px 5%', background:'#fff' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <BootcampCards />
          </div>
        </section>

        {/* CTA — Coming Soon */}
        <section style={{ padding:'80px 5%', background:'var(--blue-xpale)' }}>
          <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center' }}>
            <div style={{ width:64, height:64, background:'var(--blue-pale)', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Clock size={32} style={{ color:'var(--blue)' }} />
            </div>
            <h2 className="h-display" style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', color:'var(--black)', marginBottom:16 }}>
              Upcoming Events — <span style={{ color:'var(--blue)' }}>Coming Soon</span>
            </h2>
            <p style={{ fontSize:'1rem', color:'var(--gray)', lineHeight:1.75, marginBottom:32 }}>
              Our bootcamp and workshop schedule is being finalised. Register your interest and we&apos;ll notify you when dates are announced.
            </p>
            <Link href="/contact" className="btn btn-blue btn-lg">Register Interest →</Link>
          </div>
        </section>

        <FreeDemoStrip />
      </main>
      <Footer />
    </>
  )
}
