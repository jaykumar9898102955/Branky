'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const LEFT_TAGS = [
  'Coding',
  'IoT & Smart Systems',
  'Artificial Intelligence',
  'Problem Solving',
]

const RIGHT_TAGS = [
  'Robotics',
  'Drones',
  'Mechatronics',
  'Electronics & Circuits',
]


const CARDS = [
  { num: 1, title: 'Curious Kids',    desc: 'Curious Minds Who Love To Explore.' },
  { num: 2, title: 'Mini Engineers',  desc: 'Kids Interested In Robotics & Technology.' },
  { num: 3, title: 'Problem Solvers', desc: 'Problem Solvers Ready For New Challenges.' },
  { num: 4, title: 'Challengers',     desc: 'Ready For Hackathons & Robotics Competitions.' },
  { num: 5, title: 'Future Leaders',  desc: 'Students Who Want To Build Their Own Projects.' },
]

export default function TeachAndJoinSection() {
  const secRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('tj-in'); io.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    secRef.current?.querySelectorAll('.tj').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section ref={secRef}>

      {/* ═══════════════════ WHAT WE TEACH ═══════════════════ */}
      <div className="teach">
        <div className="teach-grid-bg" />

        <div className="c-wrap">

          {/* Heading */}
          <div className="tj tj-head teach-head">
            <h2 className="h-display teach-h2">What We Teach</h2>
            <div className="t-rule">
              <span className="r-o" /><span className="r-b" />
            </div>
          </div>

          {/* Tags float around the centred image */}
          <div className="t-scene">

            {/* Left tags – absolutely positioned, slide in from left */}
            {LEFT_TAGS.map((label, i) => (
              <span
                key={label}
                className={`tj tj-l t-tag tl-${i}`}
                style={{ '--i': i } as React.CSSProperties}
              >
                {label}
              </span>
            ))}

            {/* Centre: floating dots + large photo */}
            <div className="tj tj-img t-center">
              <div className="t-dot t-dot-1" />
              <div className="t-dot t-dot-2" />
              <div className="t-dot t-dot-3" />
              <Image
                src="/assets/image2.png"
                alt="Branky STEM student"
                width={520}
                height={640}
                className="t-photo"
                priority
              />
            </div>

            {/* Right tags – absolutely positioned, slide in from right */}
            {RIGHT_TAGS.map((label, i) => (
              <span
                key={label}
                className={`tj tj-r t-tag tr-${i}`}
                style={{ '--i': i } as React.CSSProperties}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>


      {/* ═══════════════════ WHO CAN JOIN ═══════════════════ */}
      <div className="join">
        {/* Animated logo icon */}
        <Image
          src="/assets/logo-icon-orange.png"
          alt=""
          width={120}
          height={120}
          className="join-logo-icon"
          aria-hidden="true"
        />
        {/* Decorative wave bg */}
        <Image
          src="/assets/brand-wave.png"
          alt=""
          width={900}
          height={600}
          className="join-wave"
          aria-hidden="true"
        />
        <div className="c-wrap">
          <div className="tj tj-head join-head">
            <div className="j-title-row">
              <h2 className="h-display join-h2">Who Can Join?</h2>
            </div>
            <span className="j-age-badge">4–14 Years</span>
            <div className="t-rule t-rule-l">
              <span className="r-o" /><span className="r-b" />
            </div>
            <p className="j-sub">
              If your child loves to build, explore, ask questions or is curious about technology, Branky STEM Labs is the perfect place to begin their innovation journey.
            </p>
          </div>

          <div className="j-grid">
            {CARDS.map((c, i) => (
              <div
                key={c.num}
                className={`tj j-card${c.num === 5 ? ' j-solo' : ''}`}
                style={{ '--i': i } as React.CSSProperties}
              >
                <div className="j-card-head">
                  <span className="j-card-title">{c.title}</span>
                </div>
                <div className="j-card-body">
                  <p className="j-card-desc">{c.desc}</p>
                  <span className="j-card-num">{c.num}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
    </section>
  )
}

const STYLES = `
/* ─── SHARED ─────────────────────────────────── */
.c-wrap { max-width:1200px; margin:0 auto; position:relative; z-index:1; }
.t-rule { display:flex; align-items:center; gap:8px; justify-content:center; }
.t-rule-l { justify-content:flex-start; }
.r-o { display:block; height:5px; width:52px; background:var(--orange); border-radius:10px; }
.r-b { display:block; height:5px; width:110px; background:var(--blue); border-radius:10px; }

/* ─── WHAT WE TEACH ───────────────────────────── */
.teach {
  padding:50px 5% 0;
  background:var(#3c3c3c00);
  position:relative; overflow:hidden;
}
.teach-grid-bg {
  position:absolute; inset:0;
  background-image:url('/assets/brand-grid.png');
  background-size:cover; opacity:.045; pointer-events:none;
}

/* Heading */
.teach-head { text-align:center; margin-bottom:-75px; }
.teach-h2 {
  font-size:clamp(2.4rem,5.5vw,4rem);
  color:var(--blue); text-transform:uppercase; margin-bottom:14px;
}

/* Scene: tags float absolutely around centred image */
.t-scene {
  position:relative;
  min-height:650px;
  display:flex;
  align-items:flex-end;
  justify-content:center;
  padding:40px 0 0;
}

/* Tags: absolutely positioned, floating */
.t-tag {
  position:absolute; z-index:20;
  display:inline-flex;
  background:var(--blue); color:#fff;
  padding:14px 28px; border-radius:12px;
  font-size:.88rem; font-weight:800; letter-spacing:.07em; text-transform:uppercase;
  font-family:'Karla',sans-serif; white-space:nowrap;
  border:2.5px solid var(--orange);
  box-shadow:0 4px 16px rgba(29,92,227,.28);
  cursor:default;
}

/* Left tag positions (spread top → bottom) */
.tl-0 { left:30%;  top:25%;  }
.tl-1 { left:15%;  top:40%; }
.tl-2 { left:10%;  top:55%; }
.tl-3 { left:10%;  top:70%; }

/* Right tag positions (spread top → bottom) */
.tr-0 { right:30%; top:25%;  }
.tr-1 { right:25%; top:40%; }
.tr-2 { right:18%; top:55%; }
.tr-3 { right:8%; top:70%; }

/* Centre */
.t-center {
  position:relative; z-index:1;
  display:flex; align-items:flex-end; justify-content:center;
}

/* Floating accent dots */
.t-dot { position:absolute; border-radius:50%; pointer-events:none; }
.t-dot-1 { width:13px; height:13px; background:var(--orange); top:6%; right:-6%; animation:dotF1 4s ease-in-out infinite; }
.t-dot-2 { width:9px;  height:9px;  background:var(--blue);   bottom:22%; left:-5%; animation:dotF2 5s ease-in-out 1s infinite; }
.t-dot-3 { width:17px; height:17px; background:var(--orange); border-radius:4px; bottom:3%; right:-4%; transform:rotate(45deg); opacity:.5; animation:dotF1 6s ease-in-out .5s infinite; }

/* Photo – large, blend-mode removes bg */
.t-photo {
  width:clamp(560px,62vw,820px); height:auto; display:block;
  object-fit:contain; object-position:bottom;
  mix-blend-mode:multiply;
  -webkit-mask-image:linear-gradient(to bottom, black 78%, transparent 98%);
  mask-image:linear-gradient(to bottom, black 78%, transparent 98%);
}


/* ─── WHO CAN JOIN ────────────────────────────── */
.join {
  padding:72px 5% 88px;
  background:var(--blue);
  position:relative; overflow:hidden;
}
.join-logo-icon {
  position:absolute; top:100px; left:87%; z-index:2;
  width:clamp(72px,8vw,110px); height:auto;
  opacity:1;
  animation:logoFloat 5s ease-in-out infinite;
  pointer-events:none; user-select:none;
}
@keyframes logoFloat {
  0%,100% { transform:translateY(0) rotate(-6deg); }
  50%      { transform:translateY(-14px) rotate(4deg); }
}

.join-wave {
  position:absolute;
  bottom:-60px; right:-80px;
  width:clamp(420px,55vw,780px); height:auto;
  opacity:.08; pointer-events:none; user-select:none;
  filter:brightness(0) invert(1);
}

.join-head { margin-bottom:40px; }
.j-title-row {
  display:flex; align-items:center; gap:16px; flex-wrap:wrap; margin-bottom:14px;
}
.join-h2 {
  font-size:clamp(2.4rem,5.5vw,4rem);
  color:#fff; text-transform:uppercase; line-height:1; text-align:center;
}
.j-age-badge {
  position:absolute; top:-30px; right:43%; z-index:2;
  background:var(--orange); color:#fff;
  font-size:1.1rem; font-weight:800; padding:12px 26px; border-radius:12px;
  letter-spacing:.07em; text-transform:uppercase; font-family:'Karla',sans-serif;
  white-space:nowrap;
  transform:rotate(16deg);
  box-shadow:0 6px 20px rgba(255,147,30,.4);
}
.join-head .r-o { background:#fff; }
.join-head .r-b { background:rgba(255,255,255,.4); }
.j-sub {
  font-size:1rem; color:rgba(255,255,255,.72);
  line-height:1.75; margin:18px 0 0; max-width:580px;
}

/* 2-col grid, last card centred */
.j-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }
.j-solo { grid-column:1/-1; max-width:calc(50% - 10px); margin:0 auto; width:100%; }

/* Card */
.j-card {
  border-radius:16px; overflow:hidden;
  box-shadow:0 4px 24px rgba(0,0,0,.12);
  transition:transform .28s cubic-bezier(.23,1,.32,1), box-shadow .28s;
}
.j-card:hover { transform:translateY(-6px); box-shadow:0 18px 44px rgba(0,0,0,.2); }

/* Blue header */
.j-card-head { background:var(--orange); padding:16px 22px; }
.j-card-title {
  font-size:1rem; font-weight:800; color:#fff;
  letter-spacing:.06em; text-transform:uppercase; font-family:'Karla',sans-serif;
}

/* White body */
.j-card-body {
  background:var(--white); padding:0px 22px 0px;
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  min-height:65px;
}
.j-card-desc {
  font-size:.92rem; color:#333; line-height:1.6; font-weight:500; margin:0; flex:1;
}
.j-card-num {
  font-family:'Fredoka One','Karla',sans-serif; font-size:3.4rem;
  color:var(--orange); line-height:1; opacity:.25; flex-shrink:0; user-select:none;
}

/* ─── ANIMATION: initial hidden state ─────────── */
.tj { opacity:0; }

.tj-head.tj {
  transform:translateY(24px);
  transition:opacity .7s ease, transform .7s cubic-bezier(.23,1,.32,1);
}
.tj-img.tj {
  transform:scale(.93) translateY(20px);
  transition:opacity .85s ease .1s, transform .85s cubic-bezier(.23,1,.32,1) .1s;
}
.tj-l.tj {
  transform:translateX(-38px);
  transition:
    opacity  .6s ease                        calc(var(--i,0) * .12s),
    transform .6s cubic-bezier(.23,1,.32,1)  calc(var(--i,0) * .12s);
}
.tj-r.tj {
  transform:translateX(56px) scale(.82);
  transition:
    opacity  .55s ease                             calc(var(--i,0) * .15s),
    transform .65s cubic-bezier(.34,1.56,.64,1)   calc(var(--i,0) * .15s);
}

.j-card.tj {
  transform:translateY(28px);
  transition:
    opacity  .6s ease                       calc(var(--i,0) * .1s),
    transform .6s cubic-bezier(.23,1,.32,1) calc(var(--i,0) * .1s);
}

/* ─── ANIMATION: triggered (visible) ─────────── */
.tj.tj-in { opacity:1; transform:none; }
.j-card.tj.tj-in {
  transition:transform .28s cubic-bezier(.23,1,.32,1), box-shadow .28s;
}

/* All tags: hover transition after reveal */
.t-tag.tj.tj-in {
  transition:transform .28s cubic-bezier(.34,1.56,.64,1), box-shadow .28s;
}

/* Unique continuous animation per tag (left) */
.tl-0.tj.tj-in { animation:tagBob   2.8s ease-in-out 0s    infinite; }
.tl-1.tj.tj-in { animation:tagGlowB 2.5s ease-in-out .4s   infinite; }
.tl-2.tj.tj-in { animation:tagGlowO 2.4s ease-in-out .9s   infinite; }
.tl-3.tj.tj-in { animation:tagBob   3.1s ease-in-out 1.3s  infinite; }

/* Unique continuous animation per tag (right) */
.tr-0.tj.tj-in { animation:tagGlowB 2.6s ease-in-out .2s   infinite; }
.tr-1.tj.tj-in { animation:tagBob   2.9s ease-in-out .7s   infinite; }
.tr-2.tj.tj-in { animation:tagGlowO 2.3s ease-in-out 1.1s  infinite; }
.tr-3.tj.tj-in { animation:tagBob   3.2s ease-in-out 1.6s  infinite; }

/* Hover: pause ongoing animation and lift */
.t-tag.tj.tj-in:hover {
  animation-play-state:paused;
  transform:scale(1.1) translateY(-4px) !important;
  box-shadow:0 12px 30px rgba(29,92,227,.55) !important;
  z-index:10;
}



/* ─── KEYFRAMES ───────────────────────────────── */
@keyframes dotF1 {
  0%,100% { transform:translateY(0);    }
  50%      { transform:translateY(-14px); }
}
@keyframes dotF2 {
  0%,100% { transform:translateY(0);  }
  50%      { transform:translateY(10px); }
}
/* Tag ongoing animations (shared left + right) */
@keyframes tagBob {
  0%,100% { transform:translateY(0);    box-shadow:0 4px 16px rgba(29,92,227,.28); }
  50%      { transform:translateY(-6px); box-shadow:0 10px 22px rgba(29,92,227,.42); }
}
@keyframes tagGlowB {
  0%,100% { box-shadow:0 4px 16px rgba(29,92,227,.28); }
  50%      { box-shadow:0 6px 26px rgba(29,92,227,.58), 0 0 0 6px rgba(29,92,227,.1); }
}
@keyframes tagGlowO {
  0%,100% { box-shadow:0 4px 16px rgba(29,92,227,.28); }
  50%      { box-shadow:0 6px 26px rgba(255,147,30,.5),  0 0 0 6px rgba(255,147,30,.1); }
}

/* ─── RESPONSIVE ──────────────────────────────── */

/* Tablet (≤900px): hero layout — image first, chips below */
@media (max-width:900px) {
  .teach { padding:40px 5% 0; }
  .teach-head { text-align:center; margin-bottom:16px; }
  .teach-h2 { font-size:clamp(1.8rem,6vw,2.8rem); }

  .t-scene {
    flex-direction:row;
    flex-wrap:wrap;
    justify-content:center;
    align-items:flex-end;
    min-height:unset;
    gap:10px;
    padding:0 0 28px;
  }
  /* All tags become static flex items */
  .tl-0,.tl-1,.tl-2,.tl-3,
  .tr-0,.tr-1,.tr-2,.tr-3 {
    position:static;
    margin:4px;
  }
  /* Image: hero — first, full width */
  .t-center { order:0; width:100%; justify-content:center; margin:0 0 14px; }
  .t-photo { width:min(68vw, 420px); }
  /* All tags below image */
  .tj-l { order:1; }
  .tj-r { order:1; }
}

/* Phone (≤640px): hero layout */
@media (max-width:640px) {
  /* Teach section — hero style: big image first, chips below */
  .teach { padding:30px 4% 0; }
  .teach-head { text-align:center; margin-bottom:16px; }
  .teach-h2 { font-size:clamp(1.6rem,7vw,2.2rem); }

  .t-scene {
    flex-direction:row;
    flex-wrap:wrap;
    justify-content:center;
    align-items:flex-end;
    gap:8px;
    padding:0 0 24px;
  }
  /* Image: hero — first, full width */
  .t-center { order:0; width:100%; margin:0 0 12px; }
  .t-photo { width:90vw; max-width:340px; }
  /* All tags below image */
  .tj-l { order:1; }

  .t-tag {
    padding:9px 14px;
    font-size:.72rem;
    border-radius:9px;
    border:none;
    box-shadow:none;
    animation:none;
  }

  /* Join section */
  .join { padding:56px 4% 64px; }
  .join-h2 { font-size:clamp(1.8rem,7vw,2.4rem); }
  .j-sub { font-size:.9rem; }

  /* Move badge back inline on phone — absolute position overlaps heading */
  .j-age-badge {
    position:static;
    display:inline-block;
    margin-top:12px;
    transform:rotate(4deg);
  }

  /* Hide floating logo icon — too cluttered on small screens */
  .join-logo-icon { display:none; }

  /* Single column cards */
  .j-grid { grid-template-columns:1fr; }
  .j-solo { max-width:100%; grid-column:auto; }
}
`
