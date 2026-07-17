import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FreeDemoStrip from '@/components/sections/FreeDemoStrip'
import RevealObserver from '@/components/ui/RevealObserver'
import Image from 'next/image'
import Link from 'next/link'
import { programs, getProgramBySlug } from '@/lib/programs-data'
import { CheckCircle, Clock, Users } from 'lucide-react'

export function generateStaticParams() {
  return programs.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const program = getProgramBySlug(slug)
  if (!program) return {}

  const title = `${program.title} (Ages ${program.age}) — Branky STEM Labs Vadodara`
  const description = program.shortDescription

  return {
    title,
    description,
    alternates: { canonical: `https://brankystemlab.com/programs/${program.slug}` },
    openGraph: {
      title,
      description,
      url: `/programs/${program.slug}`,
      images: [{ url: '/assets/brand-banner.png', width: 1200, height: 630, alt: `${program.title} — Branky STEM Labs Vadodara` }],
    },
    twitter: {
      title,
      description,
      images: ['/assets/brand-banner.png'],
    },
  }
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = getProgramBySlug(slug)
  if (!program) notFound()

  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: program.title,
    description: program.description,
    url: `https://brankystemlab.com/programs/${program.slug}`,
    image: `https://brankystemlab.com${program.img}`,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Branky STEM Labs',
      url: 'https://brankystemlab.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'A-5, Shivangi Society, Opp. Time Square, Ashwamegh Nagar, Tandalja',
        addressLocality: 'Vadodara',
        addressRegion: 'Gujarat',
        postalCode: '390020',
        addressCountry: 'IN',
      },
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: `Children aged ${program.age}`,
    },
    timeRequired: program.durationISO,
    teaches: program.teaches,
    educationalLevel: program.age.startsWith('4') ? 'Beginner' : program.age.startsWith('7') ? 'Elementary' : 'Intermediate',
    inLanguage: 'en-IN',
    locationCreated: {
      '@type': 'Place',
      name: 'Branky STEM Labs',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Vadodara',
        addressRegion: 'Gujarat',
        addressCountry: 'IN',
      },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://brankystemlab.com' },
      { '@type': 'ListItem', position: 2, name: 'Programs', item: 'https://brankystemlab.com/programs' },
      { '@type': 'ListItem', position: 3, name: program.title, item: `https://brankystemlab.com/programs/${program.slug}` },
    ],
  }

  const accentColor = program.accent === 'orange' ? 'var(--orange)' : 'var(--blue)'
  const accentPale = program.accent === 'orange' ? 'var(--orange-pale)' : 'var(--blue-pale)'
  const btnClass = program.accent === 'orange' ? 'btn btn-orange btn-lg' : 'btn btn-blue btn-lg'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <RevealObserver />
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ padding: '80px 5% 0', background: 'linear-gradient(135deg,var(--blue-xpale) 0%,#fff 60%)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <ol style={{ listStyle: 'none', display: 'flex', gap: 8, alignItems: 'center', fontSize: '.82rem', color: 'var(--gray)', flexWrap: 'wrap' }}>
              <li><Link href="/" style={{ color: 'var(--blue)', textDecoration: 'none' }}>Home</Link></li>
              <li style={{ opacity: .5 }}>›</li>
              <li><Link href="/programs" style={{ color: 'var(--blue)', textDecoration: 'none' }}>Programs</Link></li>
              <li style={{ opacity: .5 }}>›</li>
              <li style={{ color: 'var(--text)', fontWeight: 600 }}>{program.title}</li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ padding: '32px 5% 72px', background: 'linear-gradient(135deg,var(--blue-xpale) 0%,#fff 60%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -60, width: '30%', maxWidth: 340, opacity: .12, pointerEvents: 'none', animation: 'blobFloat 10s ease-in-out infinite' }}>
            <Image src="/assets/brand-wave.png" alt="" width={647} height={646} style={{ width: '100%', height: 'auto' }} />
          </div>
          <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6%', alignItems: 'center' }} className="prog-hero-grid">
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 14px', borderRadius: 50, fontSize: '.75rem', fontWeight: 800, letterSpacing: '.07em', textTransform: 'uppercase', background: accentColor, color: '#fff' }}>
                  Ages {program.age}
                </span>
                <span style={{ padding: '4px 14px', borderRadius: 50, fontSize: '.75rem', fontWeight: 700, background: 'rgba(0,0,0,.07)', color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={12} /> {program.duration}
                </span>
              </div>
              <h1 className="h-display" style={{ fontSize: 'clamp(1.8rem,3.5vw,3rem)', color: 'var(--black)', marginBottom: 18, lineHeight: 1.1 }}>
                {program.title}
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--gray)', lineHeight: 1.8, marginBottom: 28, maxWidth: 520 }}>
                {program.description}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/contact" className={btnClass}>Book Free Demo →</Link>
                <Link href="/programs" className="btn btn-outline btn-lg">All Programs</Link>
              </div>
            </div>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 56px rgba(29,92,227,.14)', position: 'relative' }}>
              <Image
                src={program.img}
                alt={`Students in the ${program.title} at Branky STEM Labs, Vadodara`}
                width={560}
                height={400}
                style={{ width: '100%', height: 400, objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                priority
              />
            </div>
          </div>
        </section>

        {/* What You'll Learn */}
        <section style={{ padding: '80px 5%', background: '#fff' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6%' }} className="prog-content-grid">

            {/* Curriculum */}
            <div className="reveal-left">
              <div className="tag" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 50, background: accentPale, color: accentColor, fontSize: '.75rem', fontWeight: 800, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 18 }}>
                Curriculum
              </div>
              <h2 className="h-display" style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: 'var(--black)', marginBottom: 20, lineHeight: 1.2 }}>
                What Students <span style={{ color: accentColor }}>Learn & Build</span>
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {program.curriculum.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '.93rem', color: 'var(--gray)', lineHeight: 1.6 }}>
                    <CheckCircle size={18} style={{ color: accentColor, flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Outcomes */}
            <div className="reveal-right">
              <div className="tag" style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 50, background: accentPale, color: accentColor, fontSize: '.75rem', fontWeight: 800, letterSpacing: '.07em', textTransform: 'uppercase', marginBottom: 18 }}>
                Outcomes
              </div>
              <h2 className="h-display" style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: 'var(--black)', marginBottom: 20, lineHeight: 1.2 }}>
                Skills Your Child <span style={{ color: accentColor }}>Walks Away With</span>
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {program.outcomes.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '.93rem', color: 'var(--gray)', lineHeight: 1.6 }}>
                    <CheckCircle size={18} style={{ color: accentColor, flexShrink: 0, marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Quick details */}
              <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { icon: <Users size={18} style={{ color: accentColor }} />, label: 'Age Group', value: program.age },
                  { icon: <Clock size={18} style={{ color: accentColor }} />, label: 'Duration', value: program.duration },
                  { icon: <CheckCircle size={18} style={{ color: accentColor }} />, label: 'Batch Size', value: '8–12 Students' },
                  { icon: <CheckCircle size={18} style={{ color: accentColor }} />, label: 'Location', value: 'Tandalja, Vadodara' },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ background: 'var(--blue-xpale)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    {icon}
                    <div>
                      <div style={{ fontSize: '.7rem', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
                      <div style={{ fontSize: '.88rem', color: 'var(--black)', fontWeight: 700 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '72px 5%', background: 'var(--blue-xpale)' }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <h2 className="h-display reveal" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: 'var(--black)', marginBottom: 16 }}>
              Ready to get started?
            </h2>
            <p className="reveal d1" style={{ fontSize: '1rem', color: 'var(--gray)', lineHeight: 1.75, marginBottom: 28 }}>
              Book a free demo session at Branky STEM Labs in Vadodara and let your child experience hands-on robotics and technology learning firsthand.
            </p>
            <div className="reveal d2" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className={btnClass}>Book Free Demo →</Link>
              <Link href="/programs" className="btn btn-outline btn-lg">Explore All Programs</Link>
            </div>
          </div>
        </section>

        <FreeDemoStrip />
      </main>
      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @media(max-width:860px){
          .prog-hero-grid { grid-template-columns:1fr!important; gap:32px!important; }
          .prog-hero-grid>div:last-child { order:-1; }
          .prog-content-grid { grid-template-columns:1fr!important; gap:48px!important; }
        }
      ` }} />
    </>
  )
}
