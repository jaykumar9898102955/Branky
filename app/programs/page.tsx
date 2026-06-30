import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProgramsSection from '@/components/sections/ProgramsSection'
import FreeDemoStrip from '@/components/sections/FreeDemoStrip'
import RevealObserver from '@/components/ui/RevealObserver'
import Image from 'next/image'
import { programs } from '@/lib/programs-data'

export const metadata: Metadata = {
  title: 'Programs & Courses — Branky STEM Labs Vadodara',
  description: 'Age-wise robotics, AI, coding and STEM programs for children aged 4–14 in Vadodara. 5 structured courses from beginner to advanced.',
  alternates: { canonical: 'https://brankystemlab.com/programs' },
  openGraph: {
    title: 'Programs & Courses — Branky STEM Labs Vadodara',
    description: 'Age-wise robotics, AI, coding and STEM programs for children aged 4–14 in Vadodara. 5 structured courses from beginner to advanced.',
    url: '/programs',
    images: [{ url: '/assets/brand-banner.png', width: 1200, height: 630, alt: 'Branky STEM Labs Programs — Robotics, AI & Coding for Kids in Vadodara' }],
  },
  twitter: {
    title: 'Programs & Courses — Branky STEM Labs Vadodara',
    description: 'Age-wise robotics, AI, coding and STEM programs for children aged 4–14 in Vadodara. 5 structured courses from beginner to advanced.',
    images: ['/assets/brand-banner.png'],
  },
}

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Robotics, AI & Coding Programs for Kids — Branky STEM Labs Vadodara',
  description: 'Age-wise STEM programs for children aged 4–14 in Vadodara covering robotics, AI, coding and IoT.',
  numberOfItems: programs.length,
  itemListElement: programs.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Course',
      name: p.title,
      description: p.shortDescription,
      url: `https://brankystemlab.com/programs/${p.slug}`,
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Branky STEM Labs',
        url: 'https://brankystemlab.com',
      },
      audience: {
        '@type': 'EducationalAudience',
        audienceType: `Children aged ${p.age}`,
      },
    },
  })),
}

export default function ProgramsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
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
            <h1 className="h-display" style={{ fontSize:'clamp(2rem,2vw,3.4rem)', color:'var(--black)', marginBottom:16, lineHeight:1.1 }}>
              Robotics, AI &amp; Coding Programs for Kids<br />
              <span style={{ color:'var(--blue)' }}>(Ages 4–14) in Vadodara</span>
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
