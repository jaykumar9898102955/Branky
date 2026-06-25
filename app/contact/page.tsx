import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactCards from '@/components/ui/ContactCards'
import BookingForm from '@/components/ui/BookingForm'
import Image from 'next/image'
import Link from 'next/link'
import { Target, FlaskConical, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us & Book Free Demo — Branky STEM Labs Vadodara',
  description: 'Book a free demo session at Branky STEM Labs Vadodara. Visit A-5 Shivangi Society, Tandalja. Call +91 91044 01104.',
  openGraph: {
    title: 'Contact Us & Book Free Demo — Branky STEM Labs Vadodara',
    description: 'Book a free demo session at Branky STEM Labs Vadodara. Visit A-5 Shivangi Society, Tandalja. Call +91 91044 01104.',
    url: '/contact',
  },
  twitter: {
    title: 'Contact Us & Book Free Demo — Branky STEM Labs Vadodara',
    description: 'Book a free demo session at Branky STEM Labs Vadodara. Visit A-5 Shivangi Society, Tandalja. Call +91 91044 01104.',
  },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page Hero */}
        <section style={{ padding:'120px 5% 72px', background:'linear-gradient(135deg,var(--blue-xpale) 0%,#fff 70%)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-60, width:'30%', maxWidth:340, opacity:.12, pointerEvents:'none', animation:'blobFloat 10s ease-in-out infinite' }}>
            <Image src="/assets/brand-wave.png" alt="" width={340} height={340} style={{ width:'100%', height:'auto' }} />
          </div>
          <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1, textAlign:'center' }}>
<div className="tag tag-blue" style={{ margin:'0 auto 20px' }}>Get in Touch</div>
            <h1 className="h-display" style={{ fontSize:'clamp(2rem,4vw,3.4rem)', color:'var(--black)', marginBottom:16, lineHeight:1.1 }}>
              Start Your Child's<br/>
              <span style={{ color:'var(--blue)' }}>Technology Journey</span>
            </h1>
            <p style={{ fontSize:'1.05rem', color:'var(--gray)', lineHeight:1.75, maxWidth:620, margin:'0 auto' }}>
              At Branky STEM Labs, we're always excited to connect with families passionate about technology, creativity and future skills. Whether you have questions, want to explore our programs or experience our smart labs firsthand, our team is here to guide you.
            </p>
          </div>
          {/* Booking Form */}
        <div style={{ maxWidth:780, margin:'0 auto' }}>
         <BookingForm />
        </div>
        </section>

        {/* Contact Cards + Form */}
        <section id="demo" style={{ padding:'72px 5% 96px', background:'#fff' }}>
          <div style={{ maxWidth:1200, margin:'0 auto' }}>
            <ContactCards />

            {/* Bottom CTA strip */}
            <div style={{ background:'var(--blue-xpale)', borderRadius:24, padding:'24px 32px', marginBottom:64, display:'flex', alignItems:'center', justifyContent:'center', gap:20, flexWrap:'wrap', textAlign:'center' }}>
              <span style={{ fontSize:'.92rem', color:'var(--text)', fontWeight:700, display:'inline-flex', alignItems:'center', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Target size={16} style={{ color:'var(--blue)' }} /> Book a Free Demo</span>
                <span style={{ color:'var(--gray)' }}>•</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><FlaskConical size={16} style={{ color:'var(--blue)' }} /> Visit Our Smart Labs</span>
                <span style={{ color:'var(--gray)' }}>•</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Zap size={16} style={{ color:'var(--orange)' }} /> Explore Our Programs</span>
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
