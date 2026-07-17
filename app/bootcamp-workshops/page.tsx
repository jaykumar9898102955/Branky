import { redirect } from 'next/navigation'

export default function BootcampPage() {
  redirect('/')
}

/* ── Temporarily hidden ── restore by deleting above and uncommenting below ──

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
  alternates: { canonical: 'https://brankystemlab.com/bootcamp-workshops' },
  openGraph: {
    title: 'Bootcamp & Workshops — Branky STEM Labs Vadodara',
    description: 'Intensive bootcamps and workshops in AI, Robotics, Coding and STEM for children in Vadodara. Competition training, hackathons and project exhibitions.',
    url: '/bootcamp-workshops',
    images: [{ url: '/assets/brand-banner.png', width: 1200, height: 630, alt: 'Branky STEM Labs Bootcamp and Workshops Vadodara' }],
  },
  twitter: {
    title: 'Bootcamp & Workshops — Branky STEM Labs Vadodara',
    description: 'Intensive bootcamps and workshops in AI, Robotics, Coding and STEM for children in Vadodara. Competition training, hackathons and project exhibitions.',
    images: ['/assets/brand-banner.png'],
  },
}

export default function BootcampPage() {
  return (
    <>
      <RevealObserver />
      <Navbar />
      <main>
        <section style={{ padding:'120px 5% 72px', background:'var(--blue)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-60, width:'30%', maxWidth:340, opacity:.08, pointerEvents:'none', animation:'blobFloat 10s ease-in-out infinite', filter:'brightness(0) invert(1)' }}>
            <Image src="/assets/brand-wave.png" alt="" width={647} height={646} style={{ width:'100%', height:'auto' }} />
          </div>
          <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
            <div className="tag tag-white">Bootcamp &amp; Workshops</div>
            <h1 className="h-display" style={{ fontSize:'clamp(2rem,2vw,3.4rem)', color:'#fff', marginBottom:16, lineHeight:1.1 }}>
              Beyond the Classroom —<br/>
              <span style={{ color:'var(--orange)' }}>Compete, Build</span> &amp; <span style={{ color:'rgba(255,255,255,.75)' }}>Innovate</span>
            </h1>
            <p style={{ fontSize:'1.05rem', color:'rgba(255,255,255,.75)', lineHeight:1.75, maxWidth:580 }}>
              From hackathons to competitions, our bootcamps and workshops give students the platform to apply their skills, challenge themselves and grow beyond the regular curriculum.
            </p>
          </div>
        </section>

        <section style={{ padding:'80px 5%', background:'#fff' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <BootcampCards />
          </div>
        </section>

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

── end of hidden content ── */
