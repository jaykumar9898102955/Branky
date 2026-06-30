'use client'
import Image from 'next/image'
import { FlaskConical, Leaf, Bot, Zap, Settings, Users, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const features: { IC: LucideIcon; label: string; desc: string }[] = [
  { IC:FlaskConical, label:'Dedicated Robotics Lab',    desc:'Purpose-built lab with advanced kits' },
  { IC:Leaf,         label:'AC Classrooms',             desc:'Comfortable, focused environment' },
  { IC:Bot,          label:'Advanced Robotics Kits',    desc:'Latest equipment for every program' },
  { IC:Zap,          label:'Electronics & Coding Setup', desc:'Professional-grade workstations' },
  { IC:Settings,     label:'Practical Workstations',    desc:'Hands-on project building spaces' },
  { IC:Users,        label:'Small Batch Sizes',         desc:'8–12 students per batch' },
]

export default function FacilitySection() {
  return (
    <section style={{ background:'var(--gray-xlight)', padding:'96px 5%', position:'relative', overflow:'hidden' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'7%', alignItems:'center' }} className="facility-layout">

        {/* LEFT — Image with floating feature boxes */}
        <div className="reveal-left" style={{ position:'relative' }}>
          <div style={{ borderRadius:32, overflow:'hidden', boxShadow:'0 36px 80px rgba(29,92,227,.14)' }}>
            <Image src="/assets/robot3.png" alt="Branky STEM Labs facility" width={560} height={480} style={{ width:'100%', height:'clamp(300px,40vw,480px)', objectFit:'cover', objectPosition:'top', display:'block' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(29,92,227,.18) 0%,transparent 60%)', pointerEvents:'none' }} />
          </div>

          {/* Floating badge — bottom left */}
          <div className="facility-box" style={{ position:'absolute', bottom:-20, left:-20, padding:'14px 18px', display:'flex', alignItems:'center', gap:12, boxShadow:'0 12px 32px rgba(29,92,227,.18)' }}>
            <div style={{ width:44, height:44, background:'var(--blue)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#fff' }}>
              <Target size={22}/>
            </div>
            <div>
              <strong style={{ display:'block', fontSize:'.88rem', fontWeight:800, color:'var(--black)' }}>Robo Soccer Arena</strong>
              <span style={{ fontSize:'.73rem', color:'var(--gray)' }}>Competitive robotics</span>
            </div>
          </div>

          {/* Floating badge — top right */}
          <div className="facility-box" style={{ position:'absolute', top:-16, right:-16, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, boxShadow:'0 8px 24px rgba(255,147,30,.2)' }}>
            <div style={{ width:38, height:38, background:'var(--orange)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#fff' }}>
              <Users size={20}/>
            </div>
            <div>
              <strong style={{ display:'block', fontSize:'.85rem', fontWeight:800, color:'var(--black)', lineHeight:1.2 }}>8–12 Students</strong>
              <span style={{ fontSize:'.7rem', color:'var(--gray)' }}>Per batch</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Content */}
        <div className="reveal-right">
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:50, background:'rgba(29,92,227,.08)', border:'1.5px solid var(--blue-pale)', fontSize:'.7rem', fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--blue)', marginBottom:20 }}>
            Branky in Action
          </div>
          <h2 className="h-display" style={{ fontSize:'clamp(1.6rem,3vw,2.5rem)', color:'var(--black)', marginBottom:16, lineHeight:1.2 }}>
            A Space Built for <span style={{ color:'var(--blue)' }}>Curious Minds</span>
          </h2>
          <p style={{ fontSize:'.97rem', color:'var(--gray)', lineHeight:1.75, marginBottom:32, maxWidth:440 }}>
            At Branky STEM Labs, we believe technology is best understood through building, experimenting and creating. Our hands-on environment keeps young minds curious, engaged and actively exploring.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:32 }}>
            {features.map(f => (
              <div key={f.label} className="facility-box" style={{ padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:10 }}>
                <div style={{ width:36, height:36, background:'var(--blue-pale)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <f.IC size={18} style={{ color:'var(--blue)' }} />
                </div>
                <div>
                  <strong style={{ display:'block', fontSize:'.83rem', fontWeight:800, color:'var(--black)', lineHeight:1.3 }}>{f.label}</strong>
                  <span style={{ fontSize:'.72rem', color:'var(--gray)' }}>{f.desc}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:860px){
          .facility-layout{grid-template-columns:1fr!important;gap:48px!important;}
          .facility-layout>div:first-child{display:none;}
        }
        @media(max-width:480px){ section{padding:64px 16px!important;} }
      `}} />
    </section>
  )
}
