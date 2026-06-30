import { MapPin, Phone, Mail } from 'lucide-react'

export default function ContactCards() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, marginBottom:64 }} className="contact-cards-grid">

      {/* Visit */}
      <div className="contact-card">
        <div style={{ width:56, height:56, background:'var(--blue-pale)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <MapPin size={26} style={{ color:'var(--blue)' }} />
        </div>
        <div>
          <h3 style={{ fontSize:'1.05rem', fontWeight:800, color:'var(--black)', marginBottom:8 }}>Visit Our Centre</h3>
          <p style={{ fontSize:'.88rem', color:'var(--gray)', lineHeight:1.75, margin:0 }}>
            Branky STEM Labs<br/>
            A-5, Shivangi Society,<br/>
            Opp. Time Square, Ashwamegh Nagar,<br/>
            Tandalja, Vadodara – 390020
          </p>
        </div>
        <a href="https://maps.app.goo.gl/h4HwoN54xdgM5zEL6" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ alignSelf:'flex-start', marginTop:'auto' }}>
          Get Directions →
        </a>
      </div>

      {/* Call */}
      <div className="contact-card">
        <div style={{ width:56, height:56, background:'var(--orange-pale)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Phone size={26} style={{ color:'var(--orange)' }} />
        </div>
        <div>
          <h3 style={{ fontSize:'1.05rem', fontWeight:800, color:'var(--black)', marginBottom:8 }}>Contact Us</h3>
          <p style={{ fontSize:'.88rem', color:'var(--gray)', lineHeight:1.75, marginBottom:12 }}>
            <a href="tel:+919104401104" style={{ color:'var(--blue)', fontWeight:700, textDecoration:'none', display:'block' }}>+91 91044 01104</a>
            <a href="tel:+917567878715" style={{ color:'var(--blue)', fontWeight:700, textDecoration:'none', display:'block' }}>+91 75678 78715</a>
          </p>
          <p style={{ fontSize:'.82rem', color:'var(--gray-mid)', margin:0 }}>
            For admissions, demos, programs &amp; general inquiries.
          </p>
        </div>
        <a href="tel:+919104401104" className="btn btn-orange btn-sm" style={{ alignSelf:'flex-start', marginTop:'auto' }}>
          Call Now →
        </a>
      </div>

      {/* Email */}
      <div className="contact-card">
        <div style={{ width:56, height:56, background:'var(--blue-pale)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Mail size={26} style={{ color:'var(--blue)' }} />
        </div>
        <div>
          <h3 style={{ fontSize:'1.05rem', fontWeight:800, color:'var(--black)', marginBottom:8 }}>Email Us</h3>
          <a href="mailto:brankystemlab@gmail.com" style={{ fontSize:'.9rem', color:'var(--blue)', fontWeight:700, textDecoration:'none', display:'block', marginBottom:12, wordBreak:'break-all' }}>
            brankystemlab@gmail.com
          </a>
          <p style={{ fontSize:'.82rem', color:'var(--gray-mid)', margin:0, lineHeight:1.65 }}>
            Reach out for program details, partnerships, workshops or support.
          </p>
        </div>
        <a href="mailto:brankystemlab@gmail.com" className="btn btn-outline btn-sm" style={{ alignSelf:'flex-start', marginTop:'auto' }}>
          Send Email →
        </a>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){ .contact-cards-grid{grid-template-columns:1fr!important;} }
      `}} />
    </div>
  )
}
