'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { AlertCircle, Lock, PartyPopper, X, Phone, ClipboardList, Rocket } from 'lucide-react'

interface Props { isOpen:boolean; onClose:()=>void; defaultProgram?:string }

export default function ApplyModal({ isOpen, onClose, defaultProgram }: Props) {
  const [form,setForm] = useState({studentName:'',parentName:'',phone:'',age:'',program:'',city:'',source:'',message:''})
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const [success,setSuccess] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(isOpen){document.body.style.overflow='hidden';setSuccess(false);setError('');if(defaultProgram)setForm(f=>({...f,program:defaultProgram}))}
    else document.body.style.overflow=''
  },[isOpen,defaultProgram])

  useEffect(() => {
    const fn=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()}
    window.addEventListener('keydown',fn); return()=>window.removeEventListener('keydown',fn)
  },[onClose])

  const tilt=(e:React.MouseEvent)=>{
    if(!boxRef.current)return
    const r=boxRef.current.getBoundingClientRect()
    const dx=(e.clientX-r.left-r.width/2)/(r.width/2)
    const dy=(e.clientY-r.top-r.height/2)/(r.height/2)
    boxRef.current.style.transform=`perspective(900px) rotateX(${-dy*3.5}deg) rotateY(${dx*3.5}deg) scale(1.01)`
  }
  const untilt=()=>{if(boxRef.current)boxRef.current.style.transform=''}
  const set=(k:string)=>(e:React.ChangeEvent<any>)=>setForm(f=>({...f,[k]:e.target.value}))

  const submit=async()=>{
    const{studentName,parentName,phone,age,program,city}=form
    if(!studentName||!parentName||!phone||!age||!program||!city){setError('Please fill in all required fields.');return}
    setLoading(true);setError('')
    try{
      const res=await fetch('/api/registrations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      const data=await res.json()
      if(!res.ok){setError(data.error||'Something went wrong.');setLoading(false);return}
      setSuccess(true)
    }catch{setError('Network error. Please check your connection.')}
    finally{setLoading(false)}
  }

  if(!isOpen)return null

  const Lbl=({t,req}:{t:string;req?:boolean})=>(
    <label style={{display:'block',fontSize:'.73rem',fontWeight:800,color:'var(--text)',marginBottom:7,letterSpacing:'.06em',textTransform:'uppercase'}}>
      {t}{req&&<span style={{color:'var(--orange)',marginLeft:3}}>*</span>}
    </label>
  )

  return(
    <div onMouseMove={tilt} style={{position:'fixed',inset:0,zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      {/* Phone only: collapse form grids to 1 column */}
      <style>{`@media(max-width:480px){.modal-grid{grid-template-columns:1fr!important;}}`}</style>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(13,13,13,.83)',backdropFilter:'blur(18px)'}} />

      <div ref={boxRef} onMouseLeave={untilt} style={{position:'relative',zIndex:1,background:'#fff',borderRadius:28,width:'min(580px,96vw)',maxHeight:'94vh',overflowY:'auto',padding:'clamp(28px,5vw,52px)',boxShadow:'0 40px 100px rgba(0,0,0,.28)',animation:'modal3d .5s cubic-bezier(.23,1,.32,1) both',transition:'transform .2s ease'}}>
        {/* Brand bar top */}
        <div style={{position:'absolute',top:0,left:0,right:0,height:5,background:'linear-gradient(90deg,var(--blue),var(--orange))',borderRadius:'28px 28px 0 0'}} />

        <button onClick={onClose} style={{position:'absolute',top:18,right:18,background:'var(--gray-light)',border:'none',width:36,height:36,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gray)',transition:'all .3s'}}
          onMouseEnter={e=>{const el=e.currentTarget;el.style.background='var(--orange)';el.style.color='#fff'}}
          onMouseLeave={e=>{const el=e.currentTarget;el.style.background='var(--gray-light)';el.style.color='var(--gray)'}}><X size={16}/></button>

        {!success?(
          <>
            <Image src="/assets/logo-main.png" alt="Branky" width={130} height={42} style={{objectFit:'contain',marginBottom:18,display:'block',height:'auto'}} />
            <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'5px 14px',background:'var(--orange-pale)',border:'1.5px solid var(--orange-light)',borderRadius:50,fontSize:'.71rem',fontWeight:800,color:'var(--orange-dark)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:18}}>
              <span style={{width:7,height:7,background:'var(--orange)',borderRadius:'50%',animation:'pulse 2s ease infinite',display:'inline-block'}} />
              2026 Cohort · 120 Seats Only
            </div>
            <h3 className="h-display" style={{fontSize:'1.65rem',color:'var(--black)',marginBottom:6,fontWeight:400}}>Apply to Branky</h3>
            <p style={{fontSize:'.9rem',color:'var(--gray)',marginBottom:24,lineHeight:1.6}}>Our team will contact you within 24 hours.</p>

            {error&&<div style={{background:'#fef2f2',border:'2px solid #fecaca',borderRadius:12,padding:'11px 16px',marginBottom:18,fontSize:'.87rem',color:'#dc2626',fontWeight:700,display:'flex',alignItems:'center',gap:8}}><AlertCircle size={16}/> {error}</div>}

            <div className="modal-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div><Lbl t="Student Name" req /><input value={form.studentName} onChange={set('studentName')} placeholder="Full name" /></div>
              <div><Lbl t="Age / Grade" req /><input value={form.age} onChange={set('age')} placeholder="e.g. 13 / Gr.8" /></div>
            </div>
            <div className="modal-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:14}}>
              <div><Lbl t="Parent Name" req /><input value={form.parentName} onChange={set('parentName')} placeholder="Guardian name" /></div>
              <div><Lbl t="Phone" req /><input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" /></div>
            </div>
            <div className="modal-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:14}}>
              <div><Lbl t="Program" req />
                <select value={form.program} onChange={set('program')}>
                  <option value="">Select program</option>
                  {['Robotics Bootcamp','AI & Coding Camp','Engineering Design','Space Science','Electronics & IoT','Summer Intensive'].map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div><Lbl t="City" req />
                <select value={form.city} onChange={set('city')}>
                  <option value="">Select city</option>
                  {['Ahmedabad','Surat','Vadodara','Rajkot','Mumbai','Delhi','Pune','Bangalore','Other'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginTop:14}}><Lbl t="How did you hear about us?" />
              <select value={form.source} onChange={set('source')}>
                <option value="">Select source</option>
                {['Instagram','Facebook','YouTube','Friend/Family','School','Google Search','Other'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{marginTop:14}}><Lbl t="Message (optional)" /><textarea value={form.message} onChange={set('message')} placeholder="Any questions or special requirements?" style={{height:76,resize:'vertical'}} /></div>

            <button onClick={submit} disabled={loading} className="btn btn-blue btn-lg" style={{width:'100%',marginTop:18,borderRadius:14,fontSize:'1rem',opacity:loading?.7:1,cursor:loading?'not-allowed':'pointer',justifyContent:'center'}}>
              {loading?(<><span style={{width:17,height:17,border:'2px solid rgba(255,255,255,.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 1s linear infinite',display:'inline-block'}} /> Submitting...</>):'Submit Application →'}
            </button>
            <p style={{fontSize:'.75rem',color:'var(--gray-mid)',textAlign:'center',marginTop:10,display:'flex',alignItems:'center',justifyContent:'center',gap:5}}><Lock size={12}/> Your info is secure and never shared.</p>
          </>
        ):(
          <div style={{textAlign:'center',padding:'16px 0'}}>
            <div style={{marginBottom:14,animation:'successPop .5s cubic-bezier(.23,1,.32,1)',display:'flex',justifyContent:'center',color:'var(--orange)'}}><PartyPopper size={60}/></div>
            <Image src="/assets/logo-main.png" alt="Branky" width={130} height={42} style={{objectFit:'contain',margin:'0 auto 18px',display:'block',height:'auto'}} />
            <h3 className="h-display" style={{fontSize:'1.7rem',fontWeight:400,color:'var(--black)',marginBottom:10}}>Application Submitted!</h3>
            <p style={{fontSize:'.93rem',color:'var(--gray)',lineHeight:1.7,marginBottom:24}}>Thanks for applying!<br />Our team will call you within <strong>24 hours</strong>.</p>
            <div style={{background:'var(--blue-pale)',borderRadius:14,padding:'16px 18px',marginBottom:24,textAlign:'left',border:'2px solid rgba(29,92,227,.1)'}}>
              <p style={{fontSize:'.78rem',fontWeight:800,color:'var(--blue)',marginBottom:8,letterSpacing:'.05em',textTransform:'uppercase'}}>What happens next?</p>
              {([{IC:Phone,t:'We call you within 24 hours'},{IC:ClipboardList,t:'Assessment & enrollment'},{IC:Rocket,t:'Bootcamp begins July 2026!'}] as const).map(({IC,t})=>(
                <div key={t} style={{fontSize:'.87rem',color:'var(--text)',marginBottom:7,display:'flex',alignItems:'center',gap:8}}><IC size={14} style={{flexShrink:0,color:'var(--blue)'}}/>{t}</div>
              ))}
            </div>
            <button className="btn btn-blue btn-lg" style={{width:'100%'}} onClick={onClose}>Back to Website</button>
          </div>
        )}
      </div>
    </div>
  )
}
