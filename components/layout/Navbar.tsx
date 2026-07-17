'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label:'Home', href:'/' },
  { label:'Programs', href:'/programs' },
  //{ label:'Bootcamp & Workshops', href:'/bootcamp-workshops' },
  { label:'Our Labs', href:'/our-labs' },
  { label:'About Us', href:'/about' },
  { label:'Contact Us', href:'/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:200,height:68,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 10%',background:scrolled?'rgba(255,255,255,.97)':'rgba(255,255,255,.93)',backdropFilter:'blur(20px)',borderBottom:scrolled?'2px solid var(--blue-pale)':'2px solid transparent',boxShadow:scrolled?'0 2px 24px rgba(29,92,227,.08)':'none',transition:'all .35s' }}>

        {/* Logo */}
        <Link href="/" style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
          <Image src="/assets/logo-main.png" alt="Branky STEM Labs" width={761} height={285} style={{ objectFit:'contain', width:140, height:'auto' }} priority />
        </Link>

        {/* Desktop nav */}
        <ul style={{ display:'flex',gap:24,listStyle:'none',alignItems:'center',margin:0 }} className="desktop-nav">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link href={link.href}
                style={{ fontFamily:'Karla,sans-serif',fontWeight:700,fontSize:'.88rem',color: pathname===link.href?'var(--blue)':'var(--text)',textDecoration:'none',padding:'4px 0',transition:'color .25s',letterSpacing:'.01em',borderBottom: pathname===link.href?'2px solid var(--orange)':'2px solid transparent',paddingBottom:3 }}
                onMouseEnter={e => { if(pathname!==link.href) e.currentTarget.style.color='var(--blue)' }}
                onMouseLeave={e => { if(pathname!==link.href) e.currentTarget.style.color='var(--text)' }}
              >{link.label}</Link>
            </li>
          ))}
        </ul>

        <Link href="/contact" className="btn btn-orange btn-md desktop-nav" style={{ flexShrink:0 }}>
          Book Free Demo →
        </Link>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} aria-label="Menu" style={{ display:'none',flexDirection:'column',gap:5,background:'none',border:'none',cursor:'pointer',padding:8,borderRadius:8 }} className="hamburger">
          <span style={{ display:'block',width:24,height:2.5,background:open?'var(--orange)':'var(--blue)',borderRadius:2,transition:'all .3s',transform:open?'translateY(7.5px) rotate(45deg)':'none' }} />
          <span style={{ display:'block',width:24,height:2.5,background:'var(--blue)',borderRadius:2,transition:'opacity .3s',opacity:open?0:1 }} />
          <span style={{ display:'block',width:open?'24px':'18px',height:2.5,background:open?'var(--orange)':'var(--blue)',borderRadius:2,transition:'all .3s',transform:open?'translateY(-7.5px) rotate(-45deg)':'none' }} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div style={{ position:'fixed',top:68,left:0,right:0,zIndex:199,background:'#fff',borderBottom:'2px solid var(--blue-pale)',padding:open?'20px 24px 28px':'0 24px',maxHeight:open?'500px':'0',overflow:'hidden',transition:'all .35s cubic-bezier(.23,1,.32,1)',boxShadow:open?'0 8px 32px rgba(29,92,227,.1)':'none' }}>
        <div style={{ display:'flex',flexDirection:'column',gap:4 }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              style={{ fontFamily:'Karla,sans-serif',fontWeight:700,fontSize:'1rem',color: pathname===link.href?'var(--blue)':'var(--text)',textDecoration:'none',display:'block',padding:'12px 0',borderBottom:'1px solid var(--blue-pale)',transition:'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color='var(--blue)'}
              onMouseLeave={e => { if(pathname!==link.href) e.currentTarget.style.color='var(--text)' }}
            >{link.label}</Link>
          ))}
          <Link href="/contact" className="btn btn-orange btn-md" onClick={() => setOpen(false)} style={{ marginTop:12,width:'100%',borderRadius:14,justifyContent:'center' }}>
            Book Free Demo →
          </Link>
        </div>
      </div>

      <style>{`
        .desktop-nav { display:flex!important; }
        .hamburger { display:none!important; }
        @media(max-width:860px) {
          .desktop-nav { display:none!important; }
          .hamburger { display:flex!important; }
          nav { padding:0 20px!important; }
        }
      `}</style>
    </>
  )
}
