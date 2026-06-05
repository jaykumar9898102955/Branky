'use client'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Heart, Globe, Camera, PlayCircle, Bird, MessageCircle } from 'lucide-react'

export default function Footer() {
  const programs = [
    ['STEM Foundations (4–6 Yrs)', '/programs'],
    ['Foundation of Robotics L1 (7–10)', '/programs'],
    ['Advanced Robotics L2 (7–10)', '/programs'],
    ['Core Robotics & Coding (11–14)', '/programs'],
    ['Advanced Robotics & IoT (11–14)', '/programs'],
  ]
  const quickLinks = [
    ['Home', '/'],
    ['About Us', '/about'],
    ['Programs & Courses', '/programs'],
    ['Our Labs & Facilities', '/our-labs'],
    ['AI & Robotics Bootcamp', '/bootcamp-workshops'],
    ['Contact Us', '/contact'],
  ]

  return (
    <footer style={{ background:'#0d0d0d',color:'#fff',position:'relative',overflow:'hidden' }}>
      <div style={{ height:5,background:'linear-gradient(90deg,var(--orange),var(--blue),var(--orange))' }} />

      {/* Brand wave decoration */}
      <div style={{ position:'absolute',left:-40,bottom:40,width:'18%',maxWidth:180,opacity:.05,pointerEvents:'none',transform:'scaleX(-1)' }}>
        <Image src="/assets/brand-wave.png" alt="" width={180} height={180} style={{ width:'100%',height:'auto',filter:'brightness(0) invert(1)' }} />
      </div>

      <div className='footer-wrapper' style={{ maxWidth:1200,margin:'0 auto',padding:'64px 5% 36px',display:'grid',gridTemplateColumns:'2fr 1.2fr 1fr 1.2fr',gap:'4%' }}>

        {/* Column 1 — Brand */}
        <div>
          <Image src="/assets/logo-15.png" alt="Branky STEM Labs" width={150} height={48} style={{ objectFit:'contain',marginBottom:18,filter:'brightness(0) invert(1)',height:'auto' }} />
          <p style={{ fontSize:'.87rem',color:'rgba(255,255,255,.5)',lineHeight:1.8,marginBottom:24,maxWidth:280 }}>
            Vadodara's full-fledged AI, Robotics &amp; Coding centre for ages 4–14, built around hands-on learning, smart labs and real technology exposure.
          </p>
          <div style={{ display:'flex',gap:10,marginBottom:20,flexWrap:'wrap' }}>
            {([
              {IC:Globe, l:'Facebook', href:'#'},
              {IC:Camera, l:'Instagram', href:'#'},
              {IC:PlayCircle, l:'YouTube', href:'#'},
              {IC:Bird, l:'LinkedIn', href:'#'},
            ] as const).map(({IC,l,href}) => (
              <a key={l} href={href} title={l} style={{ width:40,height:40,background:'rgba(255,255,255,.08)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',textDecoration:'none',transition:'all .3s',border:'1.5px solid rgba(255,255,255,.1)',flexShrink:0,color:'rgba(255,255,255,.7)' }}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='var(--orange)';el.style.borderColor='var(--orange)';el.style.color='#fff'}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='rgba(255,255,255,.08)';el.style.borderColor='rgba(255,255,255,.1)';el.style.color='rgba(255,255,255,.7)'}}><IC size={18}/></a>
            ))}
          </div>
          <a href="https://wa.me/919104401104" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'8px 16px',background:'rgba(37,211,102,.15)',border:'1.5px solid rgba(37,211,102,.3)',borderRadius:50,textDecoration:'none',color:'#25d366',fontSize:'.82rem',fontWeight:700,transition:'all .3s' }}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.background='rgba(37,211,102,.25)';}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.background='rgba(37,211,102,.15)';}}>
            <MessageCircle size={15} /> WhatsApp Us
          </a>
        </div>

        {/* Column 2 — Quick Links */}
        <div>
          <h4 className="h-display" style={{ fontWeight:400,fontSize:'1rem',marginBottom:18,color:'rgba(255,255,255,.9)' }}>Quick Links</h4>
          <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:11 }}>
            {quickLinks.map(([label,href]) => (
              <li key={label}>
                <Link href={href} style={{ fontSize:'.84rem',color:'rgba(255,255,255,.45)',textDecoration:'none',transition:'color .25s',display:'flex',alignItems:'center',gap:6 }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--orange)'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.45)'}>
                  <span style={{ width:4,height:4,borderRadius:'50%',background:'var(--orange)',flexShrink:0 }} />
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" style={{ fontSize:'.84rem',color:'var(--orange)',fontWeight:800,textDecoration:'none',display:'flex',alignItems:'center',gap:6,transition:'opacity .25s' }}
                onMouseEnter={e=>e.currentTarget.style.opacity='.8'}
                onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                ✦ Book Free Demo
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 — Programs */}
        <div>
          <h4 className="h-display" style={{ fontWeight:400,fontSize:'1rem',marginBottom:18,color:'rgba(255,255,255,.9)' }}>Programs</h4>
          <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:11 }}>
            {programs.map(([label,href]) => (
              <li key={label}>
                <Link href={href} style={{ fontSize:'.82rem',color:'rgba(255,255,255,.45)',textDecoration:'none',transition:'color .25s',lineHeight:1.45 }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--blue-light)'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.45)'}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Contact */}
        <div>
          <h4 className="h-display" style={{ fontWeight:400,fontSize:'1rem',marginBottom:18,color:'rgba(255,255,255,.9)' }}>Contact</h4>
          <ul style={{ listStyle:'none',display:'flex',flexDirection:'column',gap:14 }}>
            <li style={{ display:'flex',alignItems:'flex-start',gap:8 }}>
              <MapPin size={14} style={{ color:'var(--orange)',marginTop:3,flexShrink:0 }} />
              <span style={{ fontSize:'.82rem',color:'rgba(255,255,255,.5)',lineHeight:1.6 }}>
                A-5, Shivangi Society, Opp. Time Square,<br/>Ashwamegh Nagar, Tandalja,<br/>Vadodara – 390020
              </span>
            </li>
            {([
              {IC:Phone, t:'+91 91044 01104', href:'tel:+919104401104'},
              {IC:Phone, t:'+91 75678 78715', href:'tel:+917567878715'},
              {IC:Mail, t:'brankystemlab@gmail.com', href:'mailto:brankystemlab@gmail.com'},
              {IC:Clock, t:'Mon–Sat  9AM – 6PM', href:null},
            ] as const).map(({IC,t,href}) => (
              <li key={t}>
                {href ? (
                  <a href={href} style={{ fontSize:'.82rem',color:'rgba(255,255,255,.45)',textDecoration:'none',transition:'color .25s',display:'flex',alignItems:'center',gap:8 }}
                    onMouseEnter={e=>e.currentTarget.style.color='var(--orange)'}
                    onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.45)'}><IC size={13} style={{flexShrink:0}}/>{t}</a>
                ) : (
                  <span style={{ fontSize:'.82rem',color:'rgba(255,255,255,.35)',display:'flex',alignItems:'center',gap:8 }}><IC size={13} style={{flexShrink:0}}/>{t}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ maxWidth:1200,margin:'0 auto',padding:'18px 5% 28px',borderTop:'1px solid rgba(255,255,255,.07)',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10 }}>
        <p style={{ fontSize:'.78rem',color:'rgba(255,255,255,.28)' }}>© 2026 Branky STEM Labs. All rights reserved.</p>
        <p style={{ fontSize:'.78rem',color:'rgba(255,255,255,.28)',margin:0,display:'flex',alignItems:'center',gap:4 }}>
          Made with <Heart size={12} style={{color:'var(--orange)',fill:'var(--orange)'}}/> in Vadodara
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){
          footer>div:nth-child(2){grid-template-columns:1fr 1fr!important;padding:48px 20px 32px!important;gap:36px!important;}
          footer>div:last-child{padding:14px 20px 24px!important;flex-direction:column!important;align-items:flex-start!important;gap:6px!important;}
          footer>div:nth-child(2)>div:first-child{grid-column:1/-1;}
        }
        @media(max-width:576px){
           .footer-wrapper{
             margin: 0 auto;
             padding: 64px 5% 36px;
             display: flex !important;
             gap: 3rem !important;
             flex-direction: column !important;
            }
        @media(max-width:480px){
          footer>div:nth-child(2){grid-template-columns:1fr!important;gap:24px!important;padding:36px 20px 24px!important;}
        }
      `}} />
    </footer>
  )
}
