import Image from 'next/image'
import Link from 'next/link'
import { Target } from 'lucide-react'

export default function FreeDemoStrip() {
  return (
    <section style={{ background:'linear-gradient(135deg,var(--orange-dark),var(--orange))', padding:'64px 5%', position:'relative', overflow:'hidden' }}>
      {/* Wave decoration */}
      <div style={{ position:'absolute', top:-20, right:-40, width:'22%', maxWidth:240, opacity:.1, pointerEvents:'none', animation:'blobFloat 10s ease-in-out infinite' }}>
        <Image src="/assets/brand-wave.png" alt="" width={240} height={240} style={{ width:'100%', height:'auto', filter:'brightness(0) invert(1)' }} />
      </div>
      <div style={{ position:'absolute', bottom:-20, left:-30, width:'16%', maxWidth:180, opacity:.08, pointerEvents:'none' }}>
        <Image src="/assets/brand-shapes.png" alt="" width={180} height={180} style={{ width:'100%', height:'auto', filter:'brightness(0) invert(1)' }} />
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', gap:32, flexWrap:'wrap' }}>
        <div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 14px', background:'rgba(255,255,255,.2)', borderRadius:50, fontSize:'.72rem', fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,.9)', marginBottom:16 }}>
            <Target size={13} /> Free Demo Session
          </div>
          <h2 className="h-display" style={{ fontSize:'clamp(1.6rem,3.5vw,2.6rem)', color:'#fff', marginBottom:12, lineHeight:1.15 }}>
            Not sure which program is right<br className="demo-br" /> for your child?
          </h2>
          <p style={{ fontSize:'1rem', color:'rgba(255,255,255,.8)', margin:0, lineHeight:1.65, maxWidth:520 }}>
            Book a Free Demo Session — experience the lab, meet the mentors and let your child try a hands-on session before you decide anything.
          </p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, flexShrink:0 }}>
          <Link href="/contact" className="btn btn-blue btn-lg demo-strip-btn" style={{ whiteSpace:'nowrap', paddingLeft:48, paddingRight:48 }}>
            Book Free Demo — It&apos;s Completely Free
          </Link>
          <p style={{ fontSize:'.78rem', color:'rgba(255,255,255,.6)', margin:0, textAlign:'center' }}>
            Seats fill fast · Vadodara only · No commitment required
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){
          .demo-br{display:none;}
          section[style*="orange-dark"]>div:last-child{flex-direction:column!important;align-items:flex-start!important;}
        }
      `}} />
    </section>
  )
}
