'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AlertTriangle, CheckCircle, Clock, ClipboardList, Eye, Inbox, Sparkles, Trash2, X, User, Users, Phone, Mail, Target, MapPin, Link2, Calendar, Save, RefreshCw } from 'lucide-react'

type Status='new'|'reviewed'|'confirmed'|'waitlist'
interface Reg{_id:string;studentName:string;parentName:string;phone:string;email:string;age:string;program:string;city:string;source:string;message:string;status:Status;notes:string;createdAt:string}
interface Stats{total:number;new:number;confirmed:number;waitlist:number}
const SC:Record<Status,{bg:string;color:string;label:string}>={
  new:{bg:'#dbeafe',color:'#1e40af',label:'New'},
  reviewed:{bg:'#e0e7ff',color:'#3730a3',label:'Reviewed'},
  confirmed:{bg:'#d1fae5',color:'#065f46',label:'Confirmed'},
  waitlist:{bg:'#fef3c7',color:'#92400e',label:'Waitlist'},
}

export default function AdminPage() {
  const [authed,setAuthed]=useState(false)
  const [lf,setLf]=useState({email:'',password:''})
  const [lerr,setLerr]=useState('');const [ll,setLl]=useState(false);const [token,setToken]=useState('')
  const [regs,setRegs]=useState<Reg[]>([]);const [stats,setStats]=useState<Stats>({total:0,new:0,confirmed:0,waitlist:0})
  const [search,setSearch]=useState('');const [sf,setSf]=useState('all');const [loading,setLoading]=useState(false)
  const [sel,setSel]=useState<Reg|null>(null);const [notes,setNotes]=useState('');const [saving,setSaving]=useState(false)
  const [delId,setDelId]=useState<string|null>(null)

  const fetch_=useCallback(async(tok=token)=>{
    if(!tok)return; setLoading(true)
    try{
      const p=new URLSearchParams(); if(sf!=='all')p.set('status',sf); if(search)p.set('search',search)
      const r=await fetch(`/api/admin/registrations?${p}`,{headers:{Authorization:`Bearer ${tok}`}})
      if(r.status===401){setAuthed(false);return}
      const d=await r.json(); setRegs(d.registrations||[]); setStats(d.stats||{total:0,new:0,confirmed:0,waitlist:0})
    }finally{setLoading(false)}
  },[token,sf,search])

  useEffect(()=>{if(authed)fetch_()},[authed,fetch_])

  const login=async()=>{
    setLl(true);setLerr('')
    try{
      const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lf)})
      const d=await r.json()
      if(!r.ok){setLerr(d.error||'Invalid credentials');return}
      setToken(d.token);setAuthed(true)
    }catch{setLerr('Network error.')}finally{setLl(false)}
  }

  const updateStatus=async(id:string,status:Status)=>{
    setSaving(true)
    try{
      await fetch(`/api/admin/registrations/${id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({status})})
      setRegs(r=>r.map(x=>x._id===id?{...x,status}:x)); if(sel?._id===id)setSel(s=>s?{...s,status}:s); fetch_()
    }finally{setSaving(false)}
  }

  const saveNotes=async()=>{
    if(!sel)return; setSaving(true)
    try{
      await fetch(`/api/admin/registrations/${sel._id}`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({notes})})
      setRegs(r=>r.map(x=>x._id===sel._id?{...x,notes}:x)); setSel(s=>s?{...s,notes}:s)
    }finally{setSaving(false)}
  }

  const deleteReg=async(id:string)=>{
    await fetch(`/api/admin/registrations/${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${token}`}})
    setRegs(r=>r.filter(x=>x._id!==id)); setDelId(null); if(sel?._id===id)setSel(null); fetch_()
  }

  const logout=async()=>{ await fetch('/api/admin/logout',{method:'POST'}); setAuthed(false);setToken('');setRegs([]);setSel(null) }

  const S={fontFamily:"'Karla',sans-serif"}

  // LOGIN
  if(!authed) return(
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg,var(--blue-dark),var(--blue))',display:'flex',alignItems:'center',justifyContent:'center',padding:20,...S}}>
      <style dangerouslySetInnerHTML={{__html:`@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700;800&family=Fredoka+One&display=swap');:root{--blue:#1D5CE3;--blue-dark:#1448b8;--blue-pale:#e8f1fd;--orange:#FF931E;--orange-pale:#fff5e8;--orange-light:#ffb55e;--orange-dark:#e07b0e;--black:#0d0d0d;--gray:#64748b;--gray-light:#f1f5f9;--gray-xlight:#f8fafc;--text:#1e293b;}*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Karla',sans-serif;cursor:auto!important;}*{cursor:inherit;}`}} />
      {/* Brand grid bg */}
      <div style={{position:'fixed',inset:0,opacity:.06,backgroundImage:"url('/assets/brand-grid.png')",backgroundSize:'cover',pointerEvents:'none'}} />

      <div style={{background:'#fff',borderRadius:28,padding:'clamp(32px,5vw,52px)',width:'min(440px,96vw)',boxShadow:'0 40px 100px rgba(0,0,0,.3)',position:'relative',zIndex:1}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:5,background:'linear-gradient(90deg,var(--blue),var(--orange))',borderRadius:'28px 28px 0 0'}} />
        <Image src="/assets/logo-main.png" alt="Branky" width={150} height={48} style={{objectFit:'contain',marginBottom:8,display:'block',height:'auto'}} />
        <p style={{fontSize:'.88rem',color:'var(--gray)',marginBottom:28}}>Admin Dashboard — Secure Access</p>
        {lerr&&<div style={{background:'#fef2f2',border:'2px solid #fecaca',borderRadius:12,padding:'11px 16px',marginBottom:18,fontSize:'.87rem',color:'#dc2626',fontWeight:700,display:'flex',alignItems:'center',gap:8}}><AlertTriangle size={16}/> {lerr}</div>}
        {[{k:'email',l:'Email',t:'email',p:'admin@brankylabs.in'},{k:'password',l:'Password',t:'password',p:'••••••••'}].map(f=>(
          <div key={f.k} style={{marginBottom:16}}>
            <label style={{display:'block',fontSize:'.73rem',fontWeight:800,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:7}}>{f.l}</label>
            <input type={f.t} value={(lf as any)[f.k]} onChange={e=>setLf(x=>({...x,[f.k]:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&login()} placeholder={f.p} style={{width:'100%',padding:'13px 18px',background:'var(--gray-xlight)',border:'2px solid var(--blue-pale)',borderRadius:14,...S,fontSize:'.95rem',color:'var(--text)',outline:'none'}} />
          </div>
        ))}
        <button onClick={login} disabled={ll} style={{width:'100%',padding:15,background:ll?'var(--gray)':'var(--blue)',color:'#fff',border:'none',borderRadius:14,...S,fontWeight:800,fontSize:'1rem',cursor:ll?'not-allowed':'pointer',transition:'all .3s',display:'flex',alignItems:'center',justifyContent:'center',gap:10}}
          onMouseEnter={e=>{if(!ll)e.currentTarget.style.background='var(--blue-dark)'}}
          onMouseLeave={e=>{if(!ll)e.currentTarget.style.background='var(--blue)'}}>
          {ll?'Logging in...':'Login to Dashboard →'}
        </button>
        <div style={{marginTop:20,padding:14,background:'var(--blue-pale)',borderRadius:12}}>
          <p style={{fontSize:'.78rem',color:'var(--blue)',fontWeight:700,marginBottom:5}}>Demo Credentials:</p>
          <p style={{fontSize:'.78rem',color:'var(--gray)'}}>Email: admin@brankylabs.in<br />Password: Branky@2026</p>
        </div>
        <Link href="/" style={{display:'block',textAlign:'center',marginTop:16,fontSize:'.84rem',color:'var(--gray)',textDecoration:'none'}}>← Back to Website</Link>
      </div>
    </div>
  )

  // DASHBOARD
  return(
    <div style={{minHeight:'100vh',background:'var(--gray-light)',...S}}>
      <style dangerouslySetInnerHTML={{__html:`@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700;800&family=Fredoka+One&display=swap');:root{--blue:#1D5CE3;--blue-dark:#1448b8;--blue-light:#5b8af0;--blue-pale:#e8f1fd;--blue-xpale:#f0f5ff;--orange:#FF931E;--orange-dark:#e07b0e;--orange-light:#ffb55e;--orange-pale:#fff5e8;--black:#0d0d0d;--white:#fff;--gray:#64748b;--gray-mid:#94a3b8;--gray-light:#f1f5f9;--gray-xlight:#f8fafc;--text:#1e293b;}*{box-sizing:border-box;margin:0;padding:0;font-family:'Karla',sans-serif;}input,select,textarea{font-family:'Karla',sans-serif;}body{cursor:auto!important;}*{cursor:inherit;}button,a,[role=button]{cursor:pointer!important;}input,select,textarea{cursor:auto;}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}tr:hover td{background:var(--blue-xpale)}`}} />

      {/* Nav */}
      <nav style={{background:'var(--blue)',padding:'0 clamp(16px,4%,40px)',height:64,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100,boxShadow:'0 4px 20px rgba(29,92,227,.3)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <Image src="/assets/logo-15.png" alt="Branky" width={118} height={38} style={{objectFit:'contain',filter:'brightness(0) invert(1)',height:'auto'}} />
          <span style={{color:'rgba(255,255,255,.55)',fontWeight:600,fontSize:'.9rem'}}>/Admin</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <span style={{fontSize:'.82rem',color:'rgba(255,255,255,.65)',fontWeight:600,display:'none'}} className="hide-mobile">admin@brankylabs.in</span>
          <Link href="/" style={{padding:'7px 16px',background:'rgba(255,255,255,.12)',border:'1.5px solid rgba(255,255,255,.22)',borderRadius:8,color:'#fff',textDecoration:'none',fontWeight:700,fontSize:'.82rem',transition:'all .3s'}}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.22)'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.12)'}>← Site</Link>
          <button onClick={logout} style={{padding:'7px 16px',background:'rgba(220,38,38,.2)',border:'1.5px solid rgba(220,38,38,.3)',borderRadius:8,color:'#fca5a5',cursor:'pointer',fontWeight:700,fontSize:'.82rem',transition:'all .3s'}}
            onMouseEnter={e=>{const el=e.currentTarget;el.style.background='rgba(220,38,38,.5)';el.style.color='#fff'}}
            onMouseLeave={e=>{const el=e.currentTarget;el.style.background='rgba(220,38,38,.2)';el.style.color='#fca5a5'}}>Logout</button>
        </div>
      </nav>

      <div style={{maxWidth:1400,margin:'0 auto',padding:'28px clamp(16px,4%,40px)'}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontSize:'clamp(1.4rem,3vw,1.8rem)',fontWeight:800,color:'var(--black)',marginBottom:4}}>Registration Dashboard</h1>
          <p style={{color:'var(--gray)',fontSize:'.9rem'}}>Manage 2026 bootcamp applications in real-time.</p>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:28}}>
          {([{l:'Total Applications',v:stats.total,c:'var(--blue)',I:ClipboardList},{l:'New (Unreviewed)',v:stats.new,c:'var(--orange)',I:Sparkles},{l:'Confirmed',v:stats.confirmed,c:'#10b981',I:CheckCircle},{l:'Waitlisted',v:stats.waitlist,c:'#8b5cf6',I:Clock}] as const).map(s=>(
            <div key={s.l} style={{background:'#fff',borderRadius:16,padding:'20px 22px',borderLeft:`4px solid ${s.c}`,boxShadow:'0 2px 12px rgba(0,0,0,.05)',display:'flex',alignItems:'center',gap:14}}>
              <div style={{color:s.c}}><s.I size={28}/></div>
              <div><div style={{fontSize:'clamp(1.5rem,3vw,2rem)',fontWeight:800,color:'var(--black)',lineHeight:1}}>{s.v}</div><div style={{fontSize:'.72rem',color:'var(--gray)',fontWeight:700,letterSpacing:'.05em',textTransform:'uppercase',marginTop:3}}>{s.l}</div></div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:sel?'1fr 360px':'1fr',gap:20}}>
          {/* Table */}
          <div style={{background:'#fff',borderRadius:20,boxShadow:'0 2px 20px rgba(0,0,0,.06)',overflow:'hidden'}}>
            {/* Toolbar */}
            <div style={{padding:'18px 24px',borderBottom:'2px solid var(--gray-light)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
              <h3 style={{fontWeight:800,color:'var(--black)',fontSize:'1rem'}}>All Applications ({regs.length})</h3>
              <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&fetch_()} placeholder="Search..." style={{padding:'8px 14px',border:'2px solid var(--blue-pale)',borderRadius:10,fontSize:'.86rem',outline:'none',width:'clamp(140px,25vw,220px)',transition:'border-color .3s'}} onFocus={e=>e.currentTarget.style.borderColor='var(--blue)'} onBlur={e=>e.currentTarget.style.borderColor='var(--blue-pale)'} />
                <select value={sf} onChange={e=>setSf(e.target.value)} style={{padding:'8px 12px',border:'2px solid var(--blue-pale)',borderRadius:10,fontSize:'.86rem',outline:'none',background:'#fff',cursor:'pointer'}}>
                  <option value="all">All</option><option value="new">New</option><option value="reviewed">Reviewed</option><option value="confirmed">Confirmed</option><option value="waitlist">Waitlist</option>
                </select>
                <button onClick={()=>fetch_()} style={{padding:'8px 16px',background:'var(--blue)',color:'#fff',border:'none',borderRadius:10,fontWeight:700,fontSize:'.86rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--blue-dark)'}
                  onMouseLeave={e=>e.currentTarget.style.background='var(--blue)'}><RefreshCw size={15}/></button>
              </div>
            </div>

            {loading?(
              <div style={{padding:52,textAlign:'center',color:'var(--gray)'}}>
                <div style={{width:36,height:36,border:'3px solid var(--blue-pale)',borderTop:'3px solid var(--blue)',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 14px'}} />Loading...
              </div>
            ):regs.length===0?(
              <div style={{padding:52,textAlign:'center',color:'var(--gray)'}}>
                <div style={{marginBottom:12,display:'flex',justifyContent:'center'}}><Inbox size={48} strokeWidth={1.2}/></div>
                <p style={{fontWeight:700,marginBottom:6}}>No applications yet</p>
                <p style={{fontSize:'.87rem'}}>Applications from the website will appear here.</p>
              </div>
            ):(
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr>{['#','Student','Parent','Phone','Email','Program','City','Date','Status','Act'].map(h=>(
                      <th key={h} style={{padding:'11px 14px',textAlign:'left',background:'var(--gray-light)',fontSize:'.7rem',fontWeight:700,color:'var(--gray)',letterSpacing:'.07em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {regs.map((r,i)=>{
                      const st=SC[r.status]||SC.new
                      return(
                        <tr key={r._id} style={{borderBottom:'1px solid var(--gray-light)',cursor:'pointer',transition:'background .2s'}} onClick={()=>{setSel(r);setNotes(r.notes||'')}}>
                          <td style={{padding:'13px 14px',fontWeight:800,color:'var(--blue)',fontSize:'.82rem'}}>#{String(i+1).padStart(3,'0')}</td>
                          <td style={{padding:'13px 14px',fontWeight:700,color:'var(--black)',whiteSpace:'nowrap',fontSize:'.85rem'}}>{r.studentName}</td>
                          <td style={{padding:'13px 14px',color:'var(--gray)',fontSize:'.83rem',whiteSpace:'nowrap'}}>{r.parentName}</td>
                          <td style={{padding:'13px 14px',fontSize:'.83rem',whiteSpace:'nowrap'}}>{r.phone}</td>
                          <td style={{padding:'13px 14px',color:'var(--blue)',fontSize:'.83rem',whiteSpace:'nowrap'}}>{r.email}</td>
                          <td style={{padding:'13px 14px',fontSize:'.83rem',whiteSpace:'nowrap'}}>{r.program}</td>
                          <td style={{padding:'13px 14px',fontSize:'.83rem'}}>{r.city}</td>
                          <td style={{padding:'13px 14px',color:'var(--gray)',fontSize:'.8rem',whiteSpace:'nowrap'}}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                          <td style={{padding:'13px 14px'}}>
                            <select value={r.status} onClick={e=>e.stopPropagation()} onChange={e=>{e.stopPropagation();updateStatus(r._id,e.target.value as Status)}} style={{padding:'4px 8px',borderRadius:8,border:'1.5px solid var(--blue-pale)',fontSize:'.76rem',cursor:'pointer',background:st.bg,color:st.color,fontWeight:700,outline:'none'}}>
                              {Object.entries(SC).map(([v,s])=><option key={v} value={v}>{s.label}</option>)}
                            </select>
                          </td>
                          <td style={{padding:'13px 14px'}}>
                            <button onClick={e=>{e.stopPropagation();setDelId(r._id)}} style={{padding:'4px 10px',background:'#fef2f2',border:'1.5px solid #fecaca',borderRadius:8,color:'#dc2626',cursor:'pointer',fontSize:'.75rem',fontWeight:700,transition:'all .2s',display:'flex',alignItems:'center',justifyContent:'center'}}
                              onMouseEnter={e=>{const el=e.currentTarget;el.style.background='#dc2626';el.style.color='#fff'}}
                              onMouseLeave={e=>{const el=e.currentTarget;el.style.background='#fef2f2';el.style.color='#dc2626'}}><Trash2 size={13}/></button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {sel&&(
            <div style={{background:'#fff',borderRadius:20,boxShadow:'0 2px 20px rgba(0,0,0,.06)',overflow:'hidden',height:'fit-content',position:'sticky',top:84}}>
              <div style={{padding:'18px 22px',borderBottom:'2px solid var(--gray-light)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <h3 style={{fontWeight:800,color:'var(--black)',fontSize:'.98rem'}}>Application Detail</h3>
                <button onClick={()=>setSel(null)} style={{background:'var(--gray-light)',border:'none',width:30,height:30,borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gray)',transition:'all .2s'}}
                  onMouseEnter={e=>{const el=e.currentTarget;el.style.background='var(--orange)';el.style.color='#fff'}}
                  onMouseLeave={e=>{const el=e.currentTarget;el.style.background='var(--gray-light)';el.style.color='var(--gray)'}}><X size={15}/></button>
              </div>
              <div style={{padding:'20px 22px'}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
                  <div style={{width:48,height:48,borderRadius:'50%',background:'linear-gradient(135deg,var(--blue-pale),var(--orange-pale))',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid var(--blue-pale)',color:'var(--blue)'}}><User size={22}/></div>
                  <div><div style={{fontWeight:800,fontSize:'1rem',color:'var(--black)'}}>{sel.studentName}</div><div style={{fontSize:'.8rem',color:'var(--gray)'}}>{sel.age} · {sel.city}</div></div>
                </div>
                {([{IC:Users,k:'Parent',v:sel.parentName},{IC:Phone,k:'Phone',v:sel.phone},{IC:Mail,k:'Email',v:sel.email},{IC:Target,k:'Program',v:sel.program},{IC:MapPin,k:'City',v:sel.city},{IC:Link2,k:'Source',v:sel.source},{IC:Calendar,k:'Applied',v:new Date(sel.createdAt).toLocaleString('en-IN')}] as const).map(({IC,k,v})=>(
                  <div key={k} style={{display:'flex',gap:10,marginBottom:10,fontSize:'.86rem'}}>
                    <span style={{color:'var(--gray)',minWidth:100,fontWeight:600,flexShrink:0,display:'flex',alignItems:'center',gap:4}}><IC size={13}/>{k}</span>
                    <span style={{color:'var(--text)',fontWeight:500,wordBreak:'break-all'}}>{v}</span>
                  </div>
                ))}
                {sel.message&&<div style={{marginTop:14,padding:12,background:'var(--blue-pale)',borderRadius:12}}><div style={{fontSize:'.72rem',fontWeight:800,color:'var(--blue)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:5}}>Message</div><p style={{fontSize:'.86rem',color:'var(--text)',lineHeight:1.6}}>{sel.message}</p></div>}
                <div style={{marginTop:18}}>
                  <div style={{fontSize:'.72rem',fontWeight:800,color:'var(--text)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:8}}>Status</div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {(Object.entries(SC) as [Status,typeof SC.new][]).map(([s,st])=>(
                      <button key={s} onClick={()=>updateStatus(sel._id,s)} style={{padding:'5px 12px',borderRadius:20,border:`2px solid ${sel.status===s?st.color:'transparent'}`,background:sel.status===s?st.bg:'var(--gray-light)',color:sel.status===s?st.color:'var(--gray)',fontSize:'.76rem',fontWeight:700,cursor:'pointer',transition:'all .2s'}}
                        onMouseEnter={e=>{if(sel.status!==s){const el=e.currentTarget;el.style.background=st.bg;el.style.color=st.color;el.style.borderColor=st.color}}}
                        onMouseLeave={e=>{if(sel.status!==s){const el=e.currentTarget;el.style.background='var(--gray-light)';el.style.color='var(--gray)';el.style.borderColor='transparent'}}}>{st.label}</button>
                    ))}
                  </div>
                </div>
                <div style={{marginTop:18}}>
                  <div style={{fontSize:'.72rem',fontWeight:800,color:'var(--text)',letterSpacing:'.05em',textTransform:'uppercase',marginBottom:8}}>Admin Notes</div>
                  <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add internal notes..." style={{width:'100%',height:90,padding:11,border:'2px solid var(--blue-pale)',borderRadius:12,fontSize:'.86rem',resize:'vertical',outline:'none'}} onFocus={e=>e.currentTarget.style.borderColor='var(--blue)'} onBlur={e=>e.currentTarget.style.borderColor='var(--blue-pale)'} />
                  <button onClick={saveNotes} disabled={saving} style={{marginTop:8,width:'100%',padding:'9px',background:saving?'var(--gray)':'var(--blue)',color:'#fff',border:'none',borderRadius:10,fontWeight:700,fontSize:'.86rem',cursor:saving?'not-allowed':'pointer',transition:'all .3s',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>{saving?'Saving...':<><Save size={14}/>Save Notes</>}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {delId&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:600,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setDelId(null)}>
          <div style={{background:'#fff',borderRadius:20,padding:'32px 28px',width:'min(380px,92vw)',boxShadow:'0 20px 60px rgba(0,0,0,.3)'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'center',marginBottom:14,color:'#dc2626'}}><AlertTriangle size={42}/></div>
            <h3 style={{fontSize:'1.15rem',fontWeight:800,color:'var(--black)',marginBottom:8,textAlign:'center'}}>Delete Registration?</h3>
            <p style={{fontSize:'.88rem',color:'var(--gray)',marginBottom:24,textAlign:'center',lineHeight:1.6}}>This cannot be undone. The application will be permanently removed.</p>
            <div style={{display:'flex',gap:12}}>
              <button onClick={()=>setDelId(null)} style={{flex:1,padding:11,background:'var(--gray-light)',border:'none',borderRadius:12,fontWeight:700,cursor:'pointer',fontSize:'.9rem',transition:'all .2s'}}
                onMouseEnter={e=>e.currentTarget.style.background='#e2e8f0'}
                onMouseLeave={e=>e.currentTarget.style.background='var(--gray-light)'}>Cancel</button>
              <button onClick={()=>deleteReg(delId)} style={{flex:1,padding:11,background:'#dc2626',color:'#fff',border:'none',borderRadius:12,fontWeight:700,cursor:'pointer',fontSize:'.9rem',transition:'all .3s'}}
                onMouseEnter={e=>e.currentTarget.style.background='#b91c1c'}
                onMouseLeave={e=>e.currentTarget.style.background='#dc2626'}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html:`
        @media(max-width:700px){
          div[style*="gridTemplateColumns:'repeat(4,1fr)'"],div[style*='repeat(4,1fr)']{grid-template-columns:1fr 1fr!important;}
          div[style*="gridTemplateColumns:sel"]{grid-template-columns:1fr!important;}
          .hide-mobile{display:none!important;}
        }
      `}} />
    </div>
  )
}
