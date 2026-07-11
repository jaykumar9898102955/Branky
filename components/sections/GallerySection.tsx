'use client'
import Image from 'next/image'

const bannerSrc = '/assets/BSLAB - Web Banner-01.png'

export default function GallerySection() {
  return (
    <section id="gallery" style={{ background:'#1255e8',padding:'50px 5%',position:'relative',overflow:'hidden' }}>

      <div style={{ maxWidth:1200,margin:'0 auto',position:'relative',zIndex:1 }}>
        <div className="tag tag-white reveal">Student Creations</div>
        <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)',color:'#fff',marginBottom:12 }}>
          What our <span style={{ color:'var(--orange)' }}>kids build</span>
        </h2>
        <div className="reveal d1" style={{ display:'flex',gap:8,marginBottom:14 }}>
          <div style={{ height:4,width:40,background:'var(--orange)',borderRadius:8 }} />
          <div style={{ height:4,width:110,background:'rgba(255,255,255,.35)',borderRadius:8 }} />
        </div>
        <p className="reveal d2" style={{ color:'rgba(255,255,255,.72)',fontSize:'1rem',lineHeight:1.7,marginBottom:44 }}>Real projects. Real engineering. Real pride. Built by Branky students.</p>

        <div className="reveal d1" style={{ borderRadius:18,overflow:'hidden'}}>
          <div className="banner-track" style={{ display:'flex',width:'calc(259% + 50px)' }}>
            <div style={{ position:'relative',width:'calc(50% - 25px)',marginRight:25,height:'clamp(300px,40vw,520px)',flexShrink:0 }}>
              <Image src={bannerSrc} alt="Branky Student Creations" fill style={{ objectFit:'cover' }} priority />
            </div>
            <div style={{ position:'relative',width:'calc(50% - 25px)',marginRight:25,height:'clamp(300px,40vw,520px)',flexShrink:0 }}>
              <Image src={bannerSrc} alt="" aria-hidden="true" fill style={{ objectFit:'cover' }} />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @keyframes bannerSlide {
          from { transform:translateX(0); }
          to { transform:translateX(-50%); }
        }
        .banner-track{ animation:bannerSlide 16s linear infinite; }
        @media(max-width:860px){
          #gallery{padding:70px 20px!important;}
        }
      `}} />
    </section>
  )
}
