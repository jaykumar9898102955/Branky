import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FacilitySection from '@/components/sections/FacilitySection'
import MentorsSection from '@/components/sections/MentorsSection'
import ProgressStepsSection from '@/components/sections/ProgressStepsSection'
import BeyondProgramsSection from '@/components/sections/BeyondProgramsSection'
import FreeDemoStrip from '@/components/sections/FreeDemoStrip'
import RevealObserver from '@/components/ui/RevealObserver'
import Image from 'next/image'
import Link from 'next/link'
import { Medal } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us — Branky STEM Labs Vadodara',
  description: 'Learn about Branky STEM Labs — Vadodara\'s AI, Robotics & STEM learning centre for children aged 4–14. Our story, mission and facilities.',
  openGraph: {
    title: 'About Us — Branky STEM Labs Vadodara',
    description: 'Learn about Branky STEM Labs — Vadodara\'s AI, Robotics & STEM learning centre for children aged 4–14. Our story, mission and facilities.',
    url: '/about',
  },
  twitter: {
    title: 'About Us — Branky STEM Labs Vadodara',
    description: 'Learn about Branky STEM Labs — Vadodara\'s AI, Robotics & STEM learning centre for children aged 4–14. Our story, mission and facilities.',
  },
}

export default function AboutPage() {
  return (
    <>
      <RevealObserver />
      <Navbar />
      <main>
        {/* Page Hero */}
        <section style={{ padding:'120px 5% 80px', background:'linear-gradient(135deg,var(--blue-xpale) 0%,#fff 70%)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-60, width:'30%', maxWidth:340, opacity:.12, pointerEvents:'none', animation:'blobFloat 10s ease-in-out infinite' }}>
            <Image src="/assets/brand-wave.png" alt="" width={340} height={340} style={{ width:'100%', height:'auto' }} />
          </div>
          <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
<div className="tag tag-blue">About Branky STEM Labs</div>
            <h1 className="h-display" style={{ fontSize:'clamp(2rem,4vw,3.4rem)', color:'var(--black)', marginBottom:16, lineHeight:1.1, maxWidth:680 }}>
              Building the <span style={{ color:'var(--blue)' }}>Next Generation</span> of<br/>
              <span style={{ color:'var(--orange)' }}>Tech Creators</span> &amp; Innovators
            </h1>
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ height:4, width:40, background:'var(--orange)', borderRadius:8 }} />
              <div style={{ height:4, width:120, background:'var(--blue)', borderRadius:8 }} />
            </div>
          </div>
        </section>

        {/* Section 1 — About Text */}
        <section style={{ padding:'80px 5%', background:'#fff' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8%', alignItems:'center' }} className="about-split">
            <div className="reveal-left">
              <div className="tag tag-blue" style={{ marginBottom:20 }}>Our Story</div>
              <h2 className="h-display" style={{ fontSize:'clamp(1.6rem,3vw,2.4rem)', color:'var(--black)', marginBottom:20, lineHeight:1.2 }}>
                Where Technology Meets <span style={{ color:'var(--orange)' }}>Imagination</span>
              </h2>
              <p style={{ fontSize:'.97rem', color:'var(--gray)', lineHeight:1.85, marginBottom:20 }}>
                At Branky STEM Labs, we believe technology is best understood through building, experimenting and hands-on learning. As a newly launched AI, Robotics &amp; STEM learning centre in Vadodara, our mission is to transform curiosity into creation by giving students meaningful exposure to future technologies.
              </p>
              <p style={{ fontSize:'.97rem', color:'var(--gray)', lineHeight:1.85, marginBottom:28 }}>
                Through structured programs, expert mentorship, project-based learning and dedicated smart labs, students explore robotics, coding, engineering, AI, electronics, drones, IoT and emerging technologies in an engaging, age-appropriate environment. With advanced equipment, AC smart classrooms, small inclusive batches and practical workspaces, Branky is more than a classroom — it's a place where children build confidence, solve problems, think creatively and innovate through real-world technology experiences.
              </p>
              <Link href="/contact" className="btn btn-blue btn-lg">Book Free Demo →</Link>
            </div>
            <div className="reveal-right" style={{ position:'relative' }}>
              <div style={{ borderRadius:28, overflow:'hidden', boxShadow:'0 28px 64px rgba(29,92,227,.14)' }}>
                <Image src="/assets/robot2.png" alt="Branky STEM Labs" width={500} height={420} style={{ width:'100%', height:420, objectFit:'cover', objectPosition:'top', display:'block' }} />
              </div>
              <div style={{ position:'absolute', bottom:-18, right:-18, padding:'14px 18px', background:'#fff', borderRadius:20, border:'2px solid var(--blue-pale)', boxShadow:'0 10px 28px rgba(29,92,227,.14)', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, background:'var(--blue-pale)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Medal size={22} style={{ color:'var(--blue)' }} />
                </div>
                <div>
                  <strong style={{ display:'block', fontSize:'.9rem', fontWeight:800, color:'var(--black)' }}>Vadodara&apos;s Newest</strong>
                  <span style={{ fontSize:'.75rem', color:'var(--gray)' }}>STEM Learning Centre</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 — Message for Parents */}
        <section style={{ padding:'80px 5%', background:'var(--blue-xpale)' }}>
          <div style={{ maxWidth:760, margin:'0 auto' }}>
            <div className="tag tag-blue reveal" style={{ marginBottom:20 }}>A Message for Parents</div>
            <div className="reveal d1" style={{ background:'#fff', borderRadius:28, padding:'48px 44px', boxShadow:'0 12px 40px rgba(29,92,227,.08)', border:'2px solid var(--blue-pale)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-10, left:24, fontSize:'8rem', fontFamily:"'Fredoka One',sans-serif", color:'var(--blue-xpale)', lineHeight:1, pointerEvents:'none', userSelect:'none' }}>&ldquo;</div>
              <div style={{ position:'relative', zIndex:1 }}>
                <p style={{ fontSize:'1rem', color:'var(--gray)', lineHeight:1.9, marginBottom:16 }}>Dear Parents,</p>
                <p style={{ fontSize:'1.05rem', color:'var(--text)', lineHeight:1.85, marginBottom:20 }}>
                  Tomorrow&apos;s world will demand more than traditional learning — it will need creators, innovators and problem solvers. At Branky STEM Labs, students gain hands-on exposure to robotics, coding, engineering and future technologies while building creativity, logical thinking, confidence and real-world problem-solving skills.
                </p>
                <p style={{ fontSize:'1.05rem', color:'var(--text)', lineHeight:1.85, marginBottom:32 }}>
                  Through projects, competitions, workshops and expert mentorship, we help students grow into capable builders, with opportunities to participate in robotics leagues, technology competitions and innovation platforms worldwide.
                </p>
                <div style={{ borderTop:'2px solid var(--blue-pale)', paddingTop:24, display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ width:48, height:48, background:'var(--orange)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Image src="/assets/logo-icon-orange.png" alt="" width={28} height={28} style={{ objectFit:'contain', filter:'brightness(0) invert(1)' }} />
                  </div>
                  <div>
                    <strong style={{ display:'block', fontSize:'.95rem', fontWeight:800, color:'var(--black)' }}>Warm Regards,</strong>
                    <span style={{ fontSize:'.85rem', color:'var(--gray)' }}>Team Branky STEM Labs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 — Progress Steps */}
        <ProgressStepsSection />

        {/* Section 4 — Beyond Programs */}
        <BeyondProgramsSection />

        {/* Section 5 — Facility / Why Branky */}
        <FacilitySection />

        <MentorsSection />
        <FreeDemoStrip />
      </main>
      <Footer />

      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){ .about-split{grid-template-columns:1fr!important;gap:36px!important;} }
      `}} />
    </>
  )
}
