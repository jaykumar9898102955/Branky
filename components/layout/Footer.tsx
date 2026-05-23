import Image from 'next/image'
import Link from 'next/link'
import { Globe, Camera, PlayCircle, Bird, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react'

export default function Footer({ onApply }: { onApply: () => void }) {
  return (
    <footer style={{ background:'#0d0d0d',color:'#fff',position:'relative',overflow:'hidden' }}>
      <div style={{ height:5,background:'linear-gradient(90deg,var(--orange),var(--blue),var(--orange))' }} />

      {/* Brand wave decoration */}
      <div style={{ position:'absolute',left:-40,bottom:40,width:'18%',maxWidth:180,opacity:.05,pointerEvents:'none',transform:'scaleX(-1)' }}>
        <Image src="/assets/brand-wave.png" alt="" width={180} height={180} style={{ width:'100%',height:'auto',filter:'brightness(0) invert(1)' }} />
      </div>

      <div style={{ maxWidth:1200,margin:'0 auto',padding:'64px 5% 36px',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'5%' }}>
        <div>
          <Image src="/assets/logo-15.png" alt="Branky" width={150} height={48} style={{ objectFit:'contain',marginBottom:18,filter:'brightness(0) invert(1)',height:'auto' }} />
          <p style={{ fontSize:'.87rem',color:'rgba(255,255,255,.5)',lineHeight:1.8,marginBottom:24,maxWidth:280 }}>Branky S.T.E.M. Labs empowers young minds with hands-on STEM education. Based in Ahmedabad, India.</p>
          <div style={{ display:'flex',gap:10,marginBottom:20 }}>
            {([{IC:Globe,l:'Facebook'},{IC:Camera,l:'Instagram'},{IC:PlayCircle,l:'YouTube'},{IC:Bird,l:'Twitter'}] as const).map(({IC,l}) => (
              <a key={l} href="#" title={l} style={{ width:40,height:40,background:'rgba(255,255,255,.08)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',transition:'all .3s',border:'1.5px solid rgba(255,255,255,.1)',flexShrink:0,color:'rgba(255,255,255,.7)' }}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='var(--orange)';el.style.borderColor='var(--orange)';el.style.color='#fff'}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='rgba(255,255,255,.08)';el.style.borderColor='rgba(255,255,255,.1)';el.style.color='rgba(255,255,255,.7)'}}><IC size={18}/></a>
            ))}
          </div>
          {/* App icon */}
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <Image src="/assets/app-icon.png" alt="Branky App Icon" width={40} height={40} style={{ borderRadius:10,objectFit:'cover' }} />
            <div>
              <div style={{ fontSize:'.72rem',color:'rgba(255,255,255,.35)',letterSpacing:'.06em',textTransform:'uppercase' }}>Follow us</div>
              <div style={{ fontSize:'.82rem',color:'rgba(255,255,255,.7)',fontWeight:700 }}>@brankystemlabs</div>
            </div>
          </div>
        </div>

        {[
          { title:'Programs', items:[['Robotics Bootcamp','#'],['AI & Coding Camp','#'],['Engineering Design','#'],['Space Science','#'],['Summer Intensive','#']] },
          { title:'Company', items:[['About Us','/#about'],['Gallery','/#gallery'],['Blog','#'],['Careers','#'],['Admin Panel','/admin']] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="h-display" style={{ fontWeight:400,fontSize:'1rem',marginBottom:18,color:'rgba(255,255,255,.9)' }}>{col.title}</h4>
            <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:11 }}>
              {col.items.map(([label,href]) => (
                <li key={label}>
                  {href.startsWith('/') || href.startsWith('#') ? (
                    <Link href={href} style={{ fontSize:'.84rem',color:'rgba(255,255,255,.45)',textDecoration:'none',transition:'color .25s' }}
                      onMouseEnter={e=>e.currentTarget.style.color='var(--orange)'}
                      onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.45)'}>{label}</Link>
                  ) : (
                    <span style={{ fontSize:'.84rem',color:'rgba(255,255,255,.45)' }}>{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="h-display" style={{ fontWeight:400,fontSize:'1rem',marginBottom:18,color:'rgba(255,255,255,.9)' }}>Contact</h4>
          <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:11 }}>
            {([{IC:MapPin,t:'Ahmedabad, Gujarat'},{IC:Phone,t:'+91 98765 43210'},{IC:Mail,t:'hello@brankylabs.in'},{IC:Clock,t:'Mon–Sat 9AM–6PM'}] as const).map(({IC,t})=>(
              <li key={t}><Link href="#" style={{ fontSize:'.84rem',color:'rgba(255,255,255,.45)',textDecoration:'none',transition:'color .25s',display:'flex',alignItems:'center',gap:7 }}
                onMouseEnter={e=>e.currentTarget.style.color='var(--orange)'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.45)'}><IC size={13} style={{flexShrink:0}}/>{t}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ maxWidth:1200,margin:'0 auto',padding:'18px 5% 28px',borderTop:'1px solid rgba(255,255,255,.07)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10 }}>
        <p style={{ fontSize:'.78rem',color:'rgba(255,255,255,.28)' }}>© 2026 Branky S.T.E.M. Labs. All rights reserved.</p>
        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
          <Image src="/assets/logo-icon-orange.png" alt="" width={20} height={20} style={{ objectFit:'contain',opacity:.45 }} />
          <p style={{ fontSize:'.78rem',color:'rgba(255,255,255,.28)',margin:0,display:'flex',alignItems:'center',gap:4 }}>Made with <Heart size={12} style={{color:'var(--orange)',fill:'var(--orange)'}}/> in Ahmedabad</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        /* PC: 2fr 1fr 1fr 1fr — default inline style */
        /* Tablet+Phone */
        @media(max-width:860px){
          footer>div:nth-child(2){grid-template-columns:1fr 1fr!important;padding:48px 20px 32px!important;gap:36px!important;}
          footer>div:last-child{padding:14px 20px 24px!important;flex-direction:column!important;align-items:flex-start!important;gap:6px!important;}
          footer>div:nth-child(2)>div:first-child{grid-column:1/-1;}
        }
        /* Phone only */
        @media(max-width:480px){
          footer>div:nth-child(2){grid-template-columns:1fr!important;gap:24px!important;padding:36px 20px 24px!important;}
        }
      `}} />
    </footer>
  )
}
