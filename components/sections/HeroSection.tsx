'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Rocket } from 'lucide-react'

export default function HeroSection({ onApply }: { onApply: (p?: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)} }), { threshold:.1 })
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.tl-box').forEach(el => io.observe(el))
    ref.current?.querySelectorAll<HTMLElement>('.cnum').forEach(el => {
      const cio = new IntersectionObserver(([e]) => {
        if(e.isIntersecting){
          const t=parseInt(el.dataset.target!),d=2000,s=performance.now()
          const step=(n:number)=>{ const p=Math.min((n-s)/d,1); el.textContent=Math.round((1-Math.pow(1-p,3))*t).toString(); if(p<1)requestAnimationFrame(step) }
          requestAnimationFrame(step); cio.unobserve(el)
        }
      },{threshold:.5})
      cio.observe(el)
    })
  },[])

  return (
    <section id="home" style={{ minHeight:'100vh',display:'flex',alignItems:'center',padding:'80px 5% 60px',position:'relative',overflow:'hidden',background:'#fff' }}>

      {/* Brand blueprint grid background — Asset 27 */}
      <div style={{ position:'absolute',inset:0,backgroundImage:`url('/assets/brand-grid.png')`,backgroundSize:'cover',opacity:.045,pointerEvents:'none',zIndex:0 }} />

      {/* Brand wavy line decoration — Asset 28 */}
      <div style={{ position:'absolute',top:-20,right:-40,width:'38%',maxWidth:380,pointerEvents:'none',zIndex:0,animation:'blobFloat 10s ease-in-out infinite',opacity:.18 }}>
        <Image src="/assets/brand-wave.png" alt="" fill={false} width={380} height={380} style={{ width:'100%',height:'auto',objectFit:'contain' }} />
      </div>

      {/* Floating orange dot accents */}
      <div style={{ position:'absolute',top:'22%',right:'44%',width:16,height:16,borderRadius:'50%',background:'var(--orange)',opacity:.5,zIndex:0,animation:'float1 4s ease-in-out infinite' }} />
      <div style={{ position:'absolute',top:'60%',left:'6%',width:10,height:10,borderRadius:'50%',background:'var(--blue)',opacity:.4,zIndex:0,animation:'float2 5s ease-in-out infinite' }} />
      <div style={{ position:'absolute',bottom:'25%',right:'8%',width:20,height:20,borderRadius:4,background:'var(--orange)',opacity:.2,transform:'rotate(45deg)',zIndex:0,animation:'float1 6s ease-in-out 1s infinite' }} />

      <div style={{ position:'relative',zIndex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6%',alignItems:'center',maxWidth:1200,margin:'0 auto',width:'100%' }}>

        {/* LEFT */}
        <div className="reveal">
          {/* Eyebrow */}
          <div className="tag tag-blue" style={{ marginBottom:28 }}>
            <span style={{ width:8,height:8,background:'var(--orange)',borderRadius:'50%',display:'inline-block',animation:'pulse 2s ease infinite',flexShrink:0 }} />
            2026 Bootcamp · Applications Open
          </div>

          <h1 className="h-display" style={{ fontSize:'clamp(3rem,5.5vw,5.5rem)',lineHeight:1.0,color:'var(--black)',marginBottom:14 }}>
            Learn.<br />
            <span style={{ color:'var(--blue)' }}>Build.</span><br />
            <span style={{ color:'var(--orange)' }}>Launch.</span>
          </h1>

          {/* Brand underline bar */}
          <div className="hero-underline" style={{ display:'flex',alignItems:'center',gap:10,marginBottom:24 }}>
            <div style={{ height:5,width:52,background:'var(--orange)',borderRadius:10 }} />
            <div style={{ height:5,width:140,background:'var(--blue)',borderRadius:10 }} />
          </div>

          <p className="hero-para" style={{ fontSize:'clamp(.95rem,2vw,1.1rem)',color:'var(--gray)',lineHeight:1.75,marginBottom:36,maxWidth:460 }}>
            India's most hands-on STEM bootcamp for young innovators — where kids become creators, engineers, and problem-solvers. Real labs. Real mentors. Real results.
          </p>

          {/* Mobile-only hero image — hidden on desktop, shown on phone */}
          <div className="mobile-hero-img" style={{ display:'none',borderRadius:24,overflow:'hidden',marginBottom:26,position:'relative',boxShadow:'0 20px 48px rgba(29,92,227,.18)' }}>
            <Image src="/assets/robot1.png" alt="Branky student robot project" width={540} height={250} style={{ width:'100%',height:250,objectFit:'cover',objectPosition:'top center',display:'block' }} />
            <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,rgba(13,13,13,.5) 0%,transparent 50%)',pointerEvents:'none' }} />
            <div style={{ position:'absolute',bottom:14,left:14,background:'rgba(255,255,255,.97)',backdropFilter:'blur(16px)',borderRadius:14,padding:'10px 16px',display:'flex',alignItems:'center',gap:10,boxShadow:'0 6px 20px rgba(0,0,0,.15)' }}>
              <div style={{ width:36,height:36,background:'var(--orange)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <Image src="/assets/logo-icon-orange.png" alt="" width={20} height={20} style={{ objectFit:'contain',filter:'brightness(0) invert(1)' }} />
              </div>
              <div>
                <strong style={{ display:'block',fontSize:'.85rem',fontWeight:800,color:'var(--black)',lineHeight:1.2 }}>100+ Projects</strong>
                <span style={{ fontSize:'.7rem',color:'var(--gray)' }}>Built by students</span>
              </div>
            </div>
            <div style={{ position:'absolute',top:14,right:14,background:'var(--blue)',borderRadius:12,padding:'8px 14px',boxShadow:'0 6px 18px rgba(29,92,227,.5)' }}>
              <div style={{ fontSize:'.6rem',fontWeight:700,color:'rgba(255,255,255,.65)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:2 }}>Next Batch</div>
              <div style={{ fontSize:'.88rem',color:'#fff',fontWeight:800,display:'flex',alignItems:'center',gap:5 }}>July 2026 <Rocket size={13}/></div>
            </div>
          </div>

          <div className="hero-btns" style={{ display:'flex',gap:14,flexWrap:'wrap',marginBottom:48 }}>
            <button className="btn btn-blue btn-lg" onClick={() => onApply()}>Apply for 2026 ↗</button>
            <button className="btn btn-outline btn-lg" onClick={() => document.getElementById('programs')?.scrollIntoView({behavior:'smooth'})}>Explore Programs</button>
          </div>

          {/* Stats */}
          <div ref={ref} className="hero-stats-grid" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0,paddingTop:24,borderTop:'2.5px solid var(--blue-pale)' }}>
            {[{t:1200,l:'Students',s:'+'},{t:94,l:'% Happy',s:''},{t:12,l:'Programs',s:''},{t:6,l:'Cities',s:'+'}].map((s,i) => (
              <div key={s.l} className="stat-col" style={{ padding:'10px 16px',borderRight:i<3?'2px solid var(--blue-pale)':'none',textAlign:i===0?'left':'center' }}>
                <div style={{ display:'flex',alignItems:'baseline',gap:2,justifyContent:i===0?'flex-start':'center' }}>
                  <span className="cnum" data-target={s.t} style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)',fontWeight:800,color:'var(--blue)',fontFamily:"'Fredoka One','Karla',sans-serif",lineHeight:1 }}>0</span>
                  <span style={{ fontSize:'1.1rem',fontWeight:800,color:'var(--orange)' }}>{s.s}</span>
                </div>
                <div style={{ fontSize:'.72rem',color:'var(--gray)',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginTop:3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="reveal d2 hero-image-panel" style={{ position:'relative' }}>
          {/* Blob bg behind image */}
          <div style={{ position:'absolute',width:'115%',height:'115%',top:'-7%',left:'-7%',background:'linear-gradient(135deg,var(--orange-pale),var(--blue-pale))',borderRadius:'40% 60% 55% 45% / 45% 55% 60% 40%',zIndex:0,animation:'blobFloat2 9s ease-in-out infinite' }} />

          <div style={{ position:'relative',zIndex:1,borderRadius:32,overflow:'hidden',boxShadow:'0 36px 80px rgba(29,92,227,.18)' }}>
            <Image src="/assets/robot1.png" alt="Branky student robot project" width={540} height={520} style={{ width:'100%',height:'clamp(320px,45vw,520px)',objectFit:'cover',objectPosition:'top',display:'block' }} priority />

            {/* Badge bottom */}
            <div style={{ position:'absolute',bottom:24,left:20,background:'rgba(255,255,255,.97)',backdropFilter:'blur(16px)',borderRadius:18,padding:'13px 18px',boxShadow:'0 8px 28px rgba(0,0,0,.1)',display:'flex',alignItems:'center',gap:12,animation:'fadeUp .8s .5s both' }}>
              <div style={{ width:44,height:44,background:'var(--orange)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <Image src="/assets/logo-icon-orange.png" alt="" width={28} height={28} style={{ objectFit:'contain',filter:'brightness(0) invert(1)' }} />
              </div>
              <div>
                <strong style={{ display:'block',fontSize:'1rem',fontWeight:800,color:'var(--black)' }}>100+ Projects</strong>
                <span style={{ fontSize:'.78rem',color:'var(--gray)' }}>Built by our students</span>
              </div>
            </div>

            {/* Badge top */}
            <div style={{ position:'absolute',top:20,right:20,background:'var(--blue)',borderRadius:14,padding:'10px 16px',boxShadow:'0 6px 20px rgba(29,92,227,.4)',animation:'fadeUp .8s .7s both' }}>
              <div style={{ fontSize:'.68rem',fontWeight:700,color:'rgba(255,255,255,.7)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:2 }}>Next Batch</div>
              <div className="h-display" style={{ fontSize:'.95rem',fontWeight:400,color:'#fff',display:'flex',alignItems:'center',gap:6 }}>July 2026 <Rocket size={15}/></div>
            </div>
          </div>

          {/* Floating logo icon */}
          <div style={{ position:'absolute',bottom:-18,right:-12,zIndex:2,animation:'float2 5s ease-in-out infinite',filter:'drop-shadow(0 8px 16px rgba(255,147,30,.25))' }}>
            <Image src="/assets/logo-icon-orange.png" alt="" width={64} height={64} style={{ objectFit:'contain' }} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:'absolute',bottom:28,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:6 }}>
        <div style={{ width:1,height:52,background:'linear-gradient(to bottom,var(--blue),transparent)',animation:'blobFloat 2.5s ease-in-out infinite' }} />
        <span style={{ fontSize:'.65rem',color:'var(--gray-mid)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:700 }}>Scroll</span>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes blobFloat2 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(12px);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

        /* ── Tablet + Phone (≤860px) ── */
        @media(max-width:860px){
          #home { padding:84px 20px 52px !important; min-height:auto !important; align-items:flex-start !important; }
          #home > div > div { grid-template-columns:1fr !important; gap:0 !important; }
          .hero-image-panel { display:none !important; }
          .mobile-hero-img  { display:block !important; }
          #home > div:last-child { display:none !important; }
          #home h1.h-display { font-size:clamp(2.6rem,8.5vw,3.4rem) !important; line-height:1.05 !important; margin-bottom:12px !important; }
          #home .hero-underline { margin-bottom:18px !important; }
          #home .tag { margin-bottom:16px !important; }
          #home .hero-para { max-width:100% !important; margin-bottom:18px !important; font-size:.97rem !important; line-height:1.7 !important; }
          #home .hero-btns { gap:12px !important; margin-bottom:28px !important; }
          #home .hero-stats-grid { grid-template-columns:repeat(2,1fr) !important; gap:10px !important; border-top:none !important; padding-top:0 !important; }
          #home .stat-col { background:#fff !important; border-radius:18px !important; border-right:none !important; border-top:3px solid var(--blue) !important; padding:16px 12px !important; text-align:center !important; box-shadow:0 4px 18px rgba(29,92,227,.07) !important; }
          #home .stat-col:nth-child(2), #home .stat-col:nth-child(3) { border-top-color:var(--orange) !important; }
          #home .stat-col .cnum { font-size:clamp(1.5rem,5vw,1.9rem) !important; }
        }

        /* ── Phone only (≤420px) ── */
        @media(max-width:420px){
          #home { padding:80px 16px 44px !important; }
          #home h1.h-display { font-size:clamp(2.3rem,9vw,2.8rem) !important; }
          #home .hero-btns { flex-direction:column !important; gap:10px !important; }
          #home .hero-btns > button { width:100% !important; justify-content:center !important; }
          #home .hero-stats-grid { gap:8px !important; }
          #home .stat-col { padding:14px 8px !important; border-radius:14px !important; }
        }
      `}} />
    </section>
  )
}
