'use client'
import Image from 'next/image'

const schoolItems = [
  'Very limited class time',
  '4 students share 1 kit',
  'Minimal AI & Robotics exposure',
  'Focus on theory',
  'No structured robotics curriculum',
  'Very little personal attention',
]

const brankyItems = [
  'Dedicated practical sessions',
  'Hands-on access to kits',
  'Structured curriculum',
  'Real-world applications',
  'Project-based learning',
  'Creativity & innovation driven',
]

export default function ComparisonSection() {
  return (
    <section id="comparison" style={{ background: 'var(--blue)', padding: '80px 5%', position: 'relative', overflow: 'hidden' }}>

      {/* Top gradient bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,var(--blue),var(--orange),var(--blue))' }} />

      {/* Decorative bg — wave top-left */}
      <div style={{ position: 'absolute', top: -40, left: -40, width: 260, pointerEvents: 'none', opacity: 0.08, animation: 'blobFloat 10s ease-in-out infinite' }}>
        <Image src="/assets/brand-wave.png" alt="" width={260} height={260} style={{ width: '100%', height: 'auto', filter: 'brightness(0) invert(1)' }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h2
          className="h-display reveal"
          style={{
            textAlign: 'center',
            color: 'var(--white)',
            fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
            fontWeight: 800,
            marginBottom: 48,
          }}
        >
          More Than Just a Robotics Period
        </h2>

        {/* Card */}
        <div
          className="reveal d1"
          style={{
            background: 'var(--white)',
            borderRadius: 24,
            padding: '48px 32px 40px',
            display: 'grid',
            gridTemplateColumns: '1fr 1px 1fr',
            gap: '0 32px',
          }}
        >
          {/* Left — Schools */}
          <div>
            <div
              style={{
                background: 'var(--orange)',
                color: 'var(--white)',
                fontWeight: 800,
                fontSize: '0.95rem',
                letterSpacing: '0.08em',
                textAlign: 'center',
                borderRadius: 10,
                padding: '10px 24px',
                marginBottom: 28,
                display: 'inline-block',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              SCHOOLS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {schoolItems.map((item) => (
                <div
                  key={item}
                  className="cmp-row"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    background: 'var(--light-gray)',
                    borderRadius: 12,
                    padding: '13px 18px',
                    transition: 'transform .22s, box-shadow .22s, background .22s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = 'translateX(6px)'
                    el.style.boxShadow = '0 4px 18px rgba(0,0,0,.1)'
                    el.style.background = '#dde0f5'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = ''
                    el.style.boxShadow = ''
                    el.style.background = 'var(--light-gray)'
                  }}
                >
                  <span style={{ color: '#ff0202', fontSize: '1.4rem', lineHeight: 1, flexShrink: 0, fontWeight: 900 }}>✕</span>
                  <span style={{ color: 'var(--blue)', fontWeight: 800, fontSize: '1rem' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ background: 'var(--light-gray)', borderRadius: 4 }} />

          {/* Right — Branky */}
          <div>
            <div
              style={{
                background: 'var(--orange)',
                color: 'var(--white)',
                fontWeight: 800,
                fontSize: '0.95rem',
                letterSpacing: '0.08em',
                textAlign: 'center',
                borderRadius: 10,
                padding: '10px 24px',
                marginBottom: 28,
                display: 'inline-block',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              BRANKY STEM LABS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {brankyItems.map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    background: 'var(--light-gray)',
                    borderRadius: 12,
                    padding: '13px 18px',
                    transition: 'transform .22s, box-shadow .22s, background .22s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = 'translateX(6px)'
                    el.style.boxShadow = '0 4px 18px rgba(249,115,22,.18)'
                    el.style.background = '#fff3e8'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.transform = ''
                    el.style.boxShadow = ''
                    el.style.background = 'var(--light-gray)'
                  }}
                >
                  <span style={{ color: 'var(--orange)', fontSize: '1.5rem', lineHeight: 1, flexShrink: 0, fontWeight: 900 }}>✓</span>
                  <span style={{ color: 'var(--blue)', fontWeight: 800, fontSize: '1rem' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 700px) {
          #comparison > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
          #comparison > div > div:last-child > div:nth-child(2) {
            display: none !important;
          }
        }
      ` }} />
    </section>
  )
}
