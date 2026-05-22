import Image from 'next/image'

export default function AboutSection() {
  const points = [
    { icon:'/assets/logo-icon-blue.png', bg:'var(--blue)', title:'Project-Based Learning', desc:'Students build real, working projects from Day 1 — not just theory.' },
    { icon:'/assets/logo-icon-orange.png', bg:'var(--orange)', title:'Competition-Ready Training', desc:'Trained for WRO, FLL, and national robotics olympiads.' },
    { icon:'/assets/logo-icon-blue.png', bg:'var(--blue)', title:'Expert-Led Mentorship', desc:'Industry engineers guide every session with real-world experience.' },
  ]
  return (
    <section id="about" style={{ background:'var(--gray-xlight)',padding:'96px 5%',position:'relative',overflow:'hidden' }}>
      {/* Brand shapes bg */}
      <div style={{ position:'absolute',bottom:-60,right:-40,width:'30%',maxWidth:260,opacity:.04,pointerEvents:'none' }}>
        <Image src="/assets/brand-shapes.png" alt="" width={260} height={260} style={{ width:'100%',height:'auto' }} />
      </div>

      <div style={{ maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8%',alignItems:'center' }}>
        {/* Images */}
        <div className="reveal-left">
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
            <div style={{ gridColumn:'1/-1',borderRadius:24,overflow:'hidden',boxShadow:'0 16px 48px rgba(29,92,227,.1)',border:'3px solid var(--blue-pale)' }}>
              <Image src="/assets/robot3.png" alt="Students building robots" width={640} height={280} style={{ width:'100%',height:260,objectFit:'cover',display:'block',transition:'transform .5s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.04)'}
                onMouseLeave={e=>e.currentTarget.style.transform=''} />
            </div>
            <div style={{ borderRadius:20,overflow:'hidden',boxShadow:'0 10px 32px rgba(29,92,227,.09)',border:'3px solid var(--blue-pale)' }}>
              <Image src="/assets/robot4.png" alt="Robotic arm" width={300} height={210} style={{ width:'100%',height:200,objectFit:'cover',display:'block',transition:'transform .5s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                onMouseLeave={e=>e.currentTarget.style.transform=''} />
            </div>
            <div style={{ borderRadius:20,overflow:'hidden',boxShadow:'0 10px 32px rgba(255,147,30,.09)',border:'3px solid var(--orange-pale)' }}>
              <Image src="/assets/robot2.png" alt="RC car project" width={300} height={210} style={{ width:'100%',height:200,objectFit:'cover',display:'block',transition:'transform .5s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                onMouseLeave={e=>e.currentTarget.style.transform=''} />
            </div>
          </div>
        </div>

        {/* Text */}
        <div>
          <div className="tag tag-blue reveal">Who We Are</div>
          <h2 className="h-display reveal d1" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)',color:'var(--black)',marginBottom:14 }}>
            Where young minds<br />meet <span style={{ color:'var(--orange)' }}>big ideas</span>
          </h2>
          <div className="reveal d1" style={{ display:'flex',gap:8,marginBottom:20 }}>
            <div style={{ height:4,width:40,background:'var(--orange)',borderRadius:8 }} />
            <div style={{ height:4,width:110,background:'var(--blue)',borderRadius:8 }} />
          </div>
          <p className="reveal d2" style={{ fontSize:'1rem',color:'var(--gray)',lineHeight:1.75,marginBottom:28 }}>
            Branky S.T.E.M. Labs creates immersive, project-based experiences that turn curiosity into capability. Every child has an inventor inside — our job is to bring them out.
          </p>
          <div className="reveal d3" style={{ display:'flex',flexDirection:'column',gap:14 }}>
            {points.map(p => (
              <div key={p.title} style={{ display:'flex',gap:14,alignItems:'flex-start',padding:'16px 18px',background:'#fff',borderRadius:16,border:'2px solid var(--blue-pale)',transition:'all .3s',cursor:'default' }}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='var(--blue)';el.style.boxShadow='0 6px 20px rgba(29,92,227,.09)'}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='var(--blue-pale)';el.style.boxShadow='none'}}>
                <div style={{ width:42,height:42,borderRadius:11,background:p.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,padding:9 }}>
                  <Image src={p.icon} alt="" width={24} height={24} style={{ objectFit:'contain',filter:'brightness(0) invert(1)' }} />
                </div>
                <div>
                  <strong style={{ display:'block',fontWeight:800,color:'var(--black)',marginBottom:4,fontSize:'.93rem' }}>{p.title}</strong>
                  <span style={{ fontSize:'.86rem',color:'var(--gray)',lineHeight:1.6 }}>{p.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:860px){#about{padding:64px 20px!important;} #about>div{grid-template-columns:1fr!important;gap:40px!important;}}`}</style>
    </section>
  )
}
