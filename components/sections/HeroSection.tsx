'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bot, Cpu } from 'lucide-react'

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: .1 }
    )
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.tl-box').forEach(el => io.observe(el))
    ref.current?.querySelectorAll<HTMLElement>('.cnum').forEach(el => {
      const cio = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          const t = parseInt(el.dataset.target!), d = 2000, s = performance.now()
          const step = (n: number) => { const p = Math.min((n - s) / d, 1); el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * t).toString(); if (p < 1) requestAnimationFrame(step) }
          requestAnimationFrame(step); cio.unobserve(el)
        }
      }, { threshold: .5 })
      cio.observe(el)
    })
  }, [])

  return (
    <section id="home" className="hero-section">

      {/* Grid bg */}
      <div className="hero-grid-bg" />

      {/* Floating dots */}
      <div className="hero-dot hd-1" />
      <div className="hero-dot hd-2" />
      <div className="hero-dot hd-3" />

      <div ref={ref} className="hero-inner">

        {/* ── LEFT: text ── */}
        <div className="hero-content reveal" id="hero-mobile">

          <div className="tag tag-blue hero-tag">
            <span className="hero-pulse-dot" />
            Vadodara&apos;s #1 STEM Learning Centre
          </div>

          <h1 className="h-display hero-h1">
            Shaping the Next<br />
            <span style={{ color: 'var(--blue)' }}>Generation</span> of<br />
            <span style={{ color: 'var(--orange)' }}>Tech Builders</span>
          </h1>

          <div className="hero-underline">
            <div className="hu-o" />
            <div className="hu-b" />
          </div>

          <p className="hero-para">
            A Full-Fledged AI, Robotics &amp; Coding Learning Hub for children aged{' '}
            <strong style={{ color: 'var(--blue)' }}>4 to 14 years</strong>. Real labs. Expert mentors. Real results.
          </p>

          {/* Mobile-only image */}
          <div className="mobile-hero-img">
            <Image src="/assets/image.png" alt="Branky STEM student" width={540} height={260}
              style={{ width: '100%', height: 260, objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
            <div className="mhi-overlay" />
            <div className="mhi-badge">
              <div className="mhi-badge-icon">
                <Image src="/assets/logo-icon-orange.png" alt="" width={20} height={20}
                  style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '.85rem', fontWeight: 800, color: 'var(--black)', lineHeight: 1.2 }}>Ages 4–14 Years</strong>
                <span style={{ fontSize: '.7rem', color: 'var(--gray)' }}>Vadodara, Gujarat</span>
              </div>
            </div>
          </div>

          <div className="hero-btns">
            <Link href="/contact" className="btn btn-orange btn-lg">Book Free Demo →</Link>
            <Link href="/programs" className="btn btn-outline btn-lg">Explore Programs</Link>
          </div>
        </div>

        {/* ── RIGHT: image panel ── */}
        <div className="hero-image-panel reveal d2">
          <div className="hip-blob" />

          <div className="hip-frame">
            <Image src="/assets/image.png" alt="Branky STEM student" width={540} height={520}
              className="hip-photo" priority />

            {/* Bottom badge */}
            <div className="hip-badge-bottom">
              <div className="hip-badge-icon">
                <Image src="/assets/logo-icon-orange.png" alt="" width={28} height={28}
                  style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', fontWeight: 800, color: 'var(--black)' }}>Ages 4 – 14 Years</strong>
                <span style={{ fontSize: '.78rem', color: 'var(--gray)' }}>Vadodara, Gujarat</span>
              </div>
            </div>

            {/* Top badge */}
            <div className="hip-badge-top">
              <div style={{ fontSize: '.68rem', fontWeight: 700, color: 'rgba(255,255,255,.7)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>Admissions</div>
              <div className="h-display" style={{ fontSize: '.95rem', fontWeight: 400, color: '#fff' }}>Open Now ✓</div>
            </div>
          </div>

          {/* Floating tech icons */}
          <div className="hip-icon hip-icon-bot"><Bot size={26} /></div>
          <div className="hip-icon hip-icon-cpu"><Cpu size={22} /></div>
          <div className="hip-logo-float">
            <Image src="/assets/logo-icon-orange.png" alt="" width={64} height={64} style={{ objectFit: 'contain' }} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll">
        <div className="hs-line" />
        <span className="hs-label">Scroll</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
    </section>
  )
}

const STYLES = `
/* ════════════════════════════════════════
   BASE TOKENS & KEYFRAMES
════════════════════════════════════════ */
@keyframes blobFloat2  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(12px)} }
@keyframes float1      { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-14px)} }
@keyframes float2      { 0%,100%{transform:translateY(0)}   50%{transform:translateY(10px)} }
@keyframes techFloat   { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-10px) rotate(4deg)} }
@keyframes fadeUp      { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
@keyframes pulse       { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

/* ════════════════════════════════════════
   LAPTOP  ≥ 901px  — 2-column split
════════════════════════════════════════ */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 5% 60px;
  position: relative;
  overflow: hidden;
  background: #fff;
}

.hero-grid-bg {
  position: absolute; inset: 0;
  background-image: url('/assets/brand-grid.png');
  background-size: cover;
  opacity: .045;
  pointer-events: none;
  z-index: 0;
}

.hero-dot { position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; }
.hd-1 { top:22%; right:44%; width:16px; height:16px; background:var(--orange); opacity:.5; animation:float1 4s ease-in-out infinite; }
.hd-2 { top:60%; left:6%;  width:10px; height:10px; background:var(--blue);   opacity:.4; animation:float2 5s ease-in-out infinite; }
.hd-3 { bottom:25%; right:8%; width:20px; height:20px; background:var(--orange); border-radius:4px; opacity:.2; transform:rotate(45deg); animation:float1 6s ease-in-out 1s infinite; }

.hero-inner {
  position: relative; z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6%;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* LEFT content */
.hero-tag  { margin-bottom: 28px; }
.hero-pulse-dot { width:8px; height:8px; background:var(--orange); border-radius:50%; display:inline-block; animation:pulse 2s ease infinite; flex-shrink:0; }

.hero-h1 {
  font-size: clamp(2.8rem,5vw,4.8rem);
  line-height: 1.05;
  color: var(--black);
  margin-bottom: 14px;
}

.hero-underline { display:flex; align-items:center; gap:10px; margin-bottom:24px; }
.hu-o { height:5px; width:52px;  background:var(--orange); border-radius:10px; }
.hu-b { height:5px; width:140px; background:var(--blue);   border-radius:10px; }

.hero-para {
  font-size: clamp(.95rem,2vw,1.1rem);
  color: var(--gray);
  line-height: 1.75;
  margin-bottom: 36px;
  max-width: 480px;
}

.mobile-hero-img { display: none; }

.hero-btns { display:flex; gap:14px; flex-wrap:wrap; margin-bottom:48px; }

/* RIGHT image panel */
.hero-image-panel { position: relative; }

.hip-blob {
  position: absolute;
  width:115%; height:115%; top:-7%; left:-7%;
  background: linear-gradient(135deg,var(--orange-pale),var(--blue-pale));
  border-radius: 40% 60% 55% 45% / 45% 55% 60% 40%;
  z-index: 0;
  animation: blobFloat2 9s ease-in-out infinite;
}

.hip-frame {
  position: relative; z-index: 1;
  border-radius: 32px; overflow: hidden;
  box-shadow: 0 36px 80px rgba(29,92,227,.18);
}

.hip-photo {
  width: 100%;
  height: clamp(320px,45vw,520px);
  object-fit: cover;
  object-position: top;
  display: block;
}

.hip-badge-bottom {
  position: absolute; bottom:24px; left:20px;
  background: rgba(255,255,255,.97); backdrop-filter:blur(16px);
  border-radius:18px; padding:13px 18px;
  box-shadow:0 8px 28px rgba(0,0,0,.1);
  display:flex; align-items:center; gap:12px;
  animation: fadeUp .8s .5s both;
}
.hip-badge-icon {
  width:44px; height:44px; background:var(--orange); border-radius:12px;
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}

.hip-badge-top {
  position:absolute; top:20px; right:20px;
  background:var(--blue); border-radius:14px; padding:10px 16px;
  box-shadow:0 6px 20px rgba(29,92,227,.4);
  animation: fadeUp .8s .7s both;
}

.hip-icon {
  position:absolute; display:flex; align-items:center; justify-content:center; color:#fff; z-index:2;
}
.hip-icon-bot {
  top:12%; right:-6%; width:52px; height:52px;
  background:var(--blue); border-radius:14px;
  animation:techFloat 5s ease-in-out infinite;
  box-shadow:0 8px 24px rgba(29,92,227,.3);
}
.hip-icon-cpu {
  bottom:18%; left:-5%; width:44px; height:44px;
  background:var(--orange); border-radius:12px;
  animation:techFloat 6s ease-in-out 1.5s infinite;
  box-shadow:0 8px 20px rgba(255,147,30,.3);
}
.hip-logo-float {
  position:absolute; bottom:-18px; right:-12px; z-index:2;
  animation:float2 5s ease-in-out infinite;
  filter:drop-shadow(0 8px 16px rgba(255,147,30,.25));
}

/* Scroll indicator */
.hero-scroll {
  position:absolute; bottom:28px; left:50%; transform:translateX(-50%);
  display:flex; flex-direction:column; align-items:center; gap:6px;
}
.hs-line { width:1px; height:52px; background:linear-gradient(to bottom,var(--blue),transparent); animation:blobFloat2 2.5s ease-in-out infinite; }
.hs-label { font-size:.65rem; color:var(--gray-mid); letter-spacing:.12em; text-transform:uppercase; font-weight:700; }


/* ════════════════════════════════════════
   TABLET  601px – 900px
   Image card sits at top, text below,
   accent colour panel on left edge
════════════════════════════════════════ */
@media (max-width:900px) {
  .hero-section {
    min-height: auto;
    padding: 88px 5% 56px;
    align-items: flex-start;
  }

  .hero-inner {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    gap: 40px;
  }

  /* Image panel goes ABOVE the text */
  .hero-image-panel {
    order: -1;
    max-width: 520px;
    margin: 0 auto;
    width: 100%;
  }

  .hip-photo { height: clamp(260px,40vw,360px); }

  /* Left accent strip for tablet feel */
  .hero-content {
    border-left: 4px solid var(--orange);
    padding-left: 24px;
  }

  .hero-h1   { font-size: clamp(2.2rem,6vw,3.2rem); }
  .hero-para { max-width: 100%; margin-bottom: 28px; }
  .hero-btns { margin-bottom: 0; }

  /* Floating icons hide on tablet to reduce clutter */
  .hip-icon-cpu  { display: none; }
  .hip-logo-float{ display: none; }

  /* Scroll indicator off */
  .hero-scroll { display: none; }
}


/* ════════════════════════════════════════
   PHONE  ≤ 600px
   Full-width mobile hero image,
   centred text, stacked buttons
════════════════════════════════════════ */
@media (max-width:600px) {
  .hero-section {
    padding: 80px 20px 48px;
    align-items: flex-start;
  }

  .hero-inner { gap: 0; }

  /* Hide desktop image, show mobile image */
  .hero-image-panel { display: none !important; }
  .mobile-hero-img {
    display: block;
    border-radius: 20px; overflow: hidden;
    margin-bottom: 24px; position: relative;
    box-shadow: 0 20px 48px rgba(29,92,227,.18);
  }
  .mhi-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to top,rgba(13,13,13,.5) 0%,transparent 50%);
    pointer-events:none;
  }
  .mhi-badge {
    position:absolute; bottom:14px; left:14px;
    background:rgba(255,255,255,.97); backdrop-filter:blur(16px);
    border-radius:14px; padding:10px 16px;
    display:flex; align-items:center; gap:10px;
    box-shadow:0 6px 20px rgba(0,0,0,.15);
  }
  .mhi-badge-icon {
    width:36px; height:36px; background:var(--orange); border-radius:10px;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }

  /* Centre all text */
  #hero-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border-left: none;
    padding-left: 0;
  }

  .hero-underline { justify-content: center; }
  .hero-para { font-size: .95rem; line-height: 1.7; margin-bottom: 20px; }
  .hero-btns {
    flex-direction: column;
    width: 100%;
    gap: 12px;
    margin-bottom: 0;
  }
  .hero-btns > a { width: 100%; justify-content: center; }

  .hero-h1 { font-size: clamp(2.2rem,8vw,2.8rem); }
  .hero-tag { margin-bottom: 16px; }
  .hero-scroll { display: none; }
}


/* ════════════════════════════════════════
   SMALL PHONE  ≤ 380px  — compact tweaks
════════════════════════════════════════ */
@media (max-width:380px) {
  .hero-section { padding: 76px 16px 40px; }
  .hero-h1 { font-size: clamp(1.9rem,9vw,2.4rem); }
}
`
