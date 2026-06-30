'use client'
import { useEffect } from 'react'
import { FlaskConical, GraduationCap, BookOpen, Users } from 'lucide-react'

const badges = [
  { IC: FlaskConical,  label: 'Smart Labs',           accent: 'var(--blue)',   iconBg: 'var(--blue-pale)' },
  { IC: GraduationCap, label: 'Expert Mentors',        accent: 'var(--orange)', iconBg: 'var(--orange-pale)' },
  { IC: BookOpen,      label: 'Extensive Curriculum',  accent: 'var(--blue)',   iconBg: 'var(--blue-pale)' },
  { IC: Users,         label: 'Inclusive Batches',     accent: 'var(--orange)', iconBg: 'var(--orange-pale)' },
]

export default function TrustBarSection() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('tb-in'); io.unobserve(e.target) }
      }),
      { threshold: 0.15 }
    )
    document.querySelectorAll('.tb-card').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="tb-hero">
      <div className="tb-grid-bg" />
      <div className="tb-dot tb-dot-1" />
      <div className="tb-dot tb-dot-2" />
      <div className="tb-dot tb-dot-3" />

      <div className="tb-wrap">
        {badges.map((b, i) => (
          <div key={b.label} className="tb-card" style={{ '--i': i } as React.CSSProperties}>
            <div className="tb-icon-wrap" style={{ background: b.iconBg }}>
              <b.IC size={28} color={b.accent} strokeWidth={2.2} />
            </div>
            <strong className="tb-label">{b.label}</strong>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
    </section>
  )
}

const STYLES = `
.tb-hero {
  background: rgba(255, 255, 255, .6);
  padding: 48px 5%;
  border-top: 1px solid var(--blue-pale);
  border-bottom: 1px solid var(--blue-pale);
  position: relative;
  overflow: hidden;
}

.tb-grid-bg {
  position: absolute; inset: 0;
  background-image: url('/assets/brand-grid.png');
  background-size: cover;
  opacity: .03;
  pointer-events: none;
}

.tb-dot { position: absolute; border-radius: 50%; pointer-events: none; }
.tb-dot-1 { width: 14px; height: 14px; background: var(--orange); top: 18%; left: 4%; opacity: .35; animation: tbDot1 4s ease-in-out infinite; }
.tb-dot-2 { width: 9px;  height: 9px;  background: var(--blue);   bottom: 20%; right: 6%; opacity: .25; animation: tbDot2 5s ease-in-out 1s infinite; }
.tb-dot-3 { width: 16px; height: 16px; background: var(--orange); bottom: 10%; left: 42%; border-radius: 4px; transform: rotate(45deg); opacity: .15; animation: tbDot1 6s ease-in-out .5s infinite; }

@keyframes tbDot1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes tbDot2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }

.tb-wrap {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  position: relative;
  z-index: 1;
}

.tb-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 24px;
  background: #fff;
  border-radius: 18px;
  border: 2px solid var(--blue-pale);
  box-shadow: var(--shadow-card);
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity .55s ease calc(var(--i,0) * .12s),
    transform .55s cubic-bezier(.23,1,.32,1) calc(var(--i,0) * .12s),
    box-shadow .28s;
}

.tb-card.tb-in { opacity: 1; transform: none; }
.tb-card:hover { box-shadow: 0 10px 32px rgba(29,92,227,.14); transform: translateY(-4px); }

.tb-icon-wrap {
  width: 52px; height: 52px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.tb-label {
  font-size: .97rem;
  font-weight: 800;
  color: var(--black);
  font-family: 'Karla', sans-serif;
  letter-spacing: .02em;
  line-height: 1.3;
}

@media (max-width: 860px) {
  .tb-wrap { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .tb-hero { padding: 36px 4%; }
  .tb-wrap { grid-template-columns: 1fr; gap: 14px; }
}
`
