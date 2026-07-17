import Image from 'next/image'
import { Clock } from 'lucide-react'

export default function ApplyCtaSection({ onApply }: { onApply: () => void }) {
  return (
    <section className="apply-cta" style={{ background:'linear-gradient(135deg,var(--blue-dark) 0%,var(--blue) 100%)', padding:'96px 5%', position:'relative', overflow:'hidden' }}>
      {/* Wave top */}
      <div style={{ position:'absolute', top:-1, left:0, right:0, overflow:'hidden', lineHeight:0 }}>
        <svg viewBox="0 0 1440 60" style={{ display:'block', width:'100%' }} preserveAspectRatio="none">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="#fff" />
        </svg>
      </div>

      {/* Brand grid bg */}
      <div style={{ position:'absolute', inset:0, backgroundImage:"url('/assets/brand-grid.png')", backgroundSize:'cover', opacity:.04, pointerEvents:'none', zIndex:0 }} />

      {/* Brand wave decor */}
      <div style={{ position:'absolute', right:-20, top:20, width:'22%', maxWidth:220, opacity:.08, pointerEvents:'none', animation:'blobFloat 9s ease-in-out infinite' }}>
        <Image src="/assets/brand-wave.png" alt="" width={647} height={646} style={{ width:'100%', height:'auto', filter:'brightness(0) invert(1)' }} />
      </div>
      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', gap:48, flexWrap:'wrap' }}>
        <div style={{ flex:'1 1 300px' }}>
          <h2 className="h-display" style={{ fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:400, color:'#fff', lineHeight:1.1, marginBottom:16 }}>
            Ready to build<br /><span style={{ color:'var(--orange)' }}>something amazing?</span>
          </h2>
          <div style={{ display:'flex', gap:8, marginBottom:20 }}>
            <div style={{ height:4, width:40, background:'var(--orange)', borderRadius:8 }} />
            <div style={{ height:4, width:100, background:'rgba(255,255,255,.3)', borderRadius:8 }} />
          </div>
          <p style={{ fontSize:'1.02rem', color:'rgba(255,255,255,.76)', lineHeight:1.72, maxWidth:500 }}>
            120 seats. 6 tracks. Zero limits. Applications close June 30, 2026. Early bird discount ends May 31.
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16, alignItems:'flex-start', flexShrink:0 }}>
          <button className="btn btn-orange btn-lg cta-apply-btn" onClick={onApply} style={{ fontSize:'1.08rem', padding:'16px 48px' }}>
            Apply Now — It's Free ↗
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Image src="/assets/app-icon.png" alt="" width={28} height={28} style={{ borderRadius:7, objectFit:'cover', opacity:.6 }} />
            <p style={{ fontSize:'.8rem', color:'rgba(255,255,255,.55)', margin:0, display:'flex', alignItems:'center', gap:6 }}><Clock size={14}/> Early bird closes May 31 · Only 120 seats</p>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        /* PC: side-by-side flex — default inline style */
        /* Phone */
        @media(max-width:760px){
          .apply-cta{padding:70px 20px!important;}
          .apply-cta>div:last-child{flex-direction:column!important;align-items:stretch!important;gap:20px!important;}
          .cta-apply-btn{width:100%!important;justify-content:center!important;}
        }
      `}} />
    </section>
  )
}
