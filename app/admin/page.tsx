'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import { ClipboardList, Users, IndianRupee, TrendingUp, AlertTriangle, BookOpen, BarChart2, LineChart as LineIcon, Wallet, UserPlus, UserCheck } from 'lucide-react'

interface DashData {
  regStats:  { total: number; new: number; reviewed: number; confirmed: number; waitlist: number }
  stuStats:  { total: number; current: number; past: number }
  feeStats:  { collected: number; outstanding: number; overdueCount: number }
  monthlyFees:  { month: string; total: number }[]
  monthlyRegs:  { month: string; total: number }[]
  topCourses:   { course: string; students: number; collected: number }[]
  recentStudents: { id: number; name: string; program: string; status: string; joinDate: string }[]
  recentRegs:     { id: number; name: string; program: string; status: string; createdAt: string }[]
}

const fmt  = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
const BLUE = '#1D5CE3'
const ORG  = '#FF931E'
const GRN  = '#059669'
const RED  = '#dc2626'
const SLATE = '#64748b'

const PIE_REG = [
  { key: 'new',       label: 'New',       color: ORG  },
  { key: 'reviewed',  label: 'Reviewed',  color: BLUE },
  { key: 'confirmed', label: 'Confirmed', color: GRN  },
  { key: 'waitlist',  label: 'Waitlist',  color: '#f59e0b' },
]

const STATUS_COLOR: Record<string, string> = {
  new: '#FF931E', reviewed: '#1D5CE3', confirmed: '#059669', waitlist: '#f59e0b',
  current: '#059669', past: '#64748b',
}

const CustomTooltipFee = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1e293b', borderRadius: 10, padding: '8px 14px', fontSize: '.82rem', color: '#fff', fontFamily: 'Karla,sans-serif' }}>
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
      <div style={{ color: ORG }}>{fmt(payload[0].value)}</div>
    </div>
  )
}

const CustomTooltipReg = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1e293b', borderRadius: 10, padding: '8px 14px', fontSize: '.82rem', color: '#fff', fontFamily: 'Karla,sans-serif' }}>
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{label}</div>
      <div style={{ color: BLUE }}>{payload[0].value} registrations</div>
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)
  const F = { fontFamily: "'Karla',sans-serif" }

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{ background: '#fff', borderRadius: 18, padding: '20px 22px', boxShadow: '0 1px 6px rgba(0,0,0,.06)', ...style }}>{children}</div>
  )

  const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontWeight: 800, fontSize: '.88rem', color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>{children}</div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', ...F }}>
      <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700;800&display=swap');*{box-sizing:border-box;}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.kpi-card{transition:transform .18s,box-shadow .18s;}.kpi-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.1)!important;}.dash-link{transition:background .12s,border-radius .12s;display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid #f8fafc;text-decoration:none;}.dash-link:hover{background:#eff6ff!important;border-radius:8px;padding-left:8px;padding-right:8px;}@media(max-width:900px){.dash-r1{grid-template-columns:1fr!important;}.dash-r2{grid-template-columns:1fr!important;}.dash-r3{grid-template-columns:1fr!important;}.dash-r4{grid-template-columns:1fr!important;}.dash-kpi{grid-template-columns:repeat(2,1fr)!important;}}@media(max-width:480px){.dash-kpi{grid-template-columns:1fr!important;}}` }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0d0d0d', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: SLATE, fontSize: '.9rem' }}>Branky STEM Labs — overview &amp; analytics</p>
        </div>

        {/* ── Single loading state for the whole dashboard ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 360, gap: 16 }}>
            <div style={{ width: 40, height: 40, border: `4px solid #e2e8f0`, borderTop: `4px solid ${BLUE}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ color: SLATE, fontWeight: 600, fontSize: '.95rem' }}>Loading dashboard…</div>
          </div>
        ) : <>

        {/* ── Top KPI Cards ── */}
        <div className="dash-kpi" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 24 }}>
          {data ? [
            { label: 'Total Registrations', value: data.regStats.total,        color: BLUE,  Icon: ClipboardList },
            { label: 'Active Students',     value: data.stuStats.current,       color: GRN,   Icon: Users        },
            { label: 'Past Students',       value: data.stuStats.past,          color: SLATE, Icon: Users        },
            { label: 'Fees Collected',      value: fmt(data.feeStats.collected),   color: ORG,   Icon: IndianRupee  },
            { label: 'Outstanding',         value: fmt(data.feeStats.outstanding), color: RED,   Icon: TrendingUp   },
            { label: 'Overdue Fees',        value: data.feeStats.overdueCount,  color: RED,   Icon: AlertTriangle },
          ].map(s => (
            <div key={s.label} className="kpi-card" style={{ background:'#fff', borderRadius:16, padding:'16px 18px', borderLeft:`4px solid ${s.color}`, boxShadow:'0 1px 6px rgba(0,0,0,.05)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ color:s.color, flexShrink:0 }}><s.Icon size={22} /></div>
              <div>
                <div style={{ fontSize: typeof s.value === 'number' ? '1.65rem' : '1.1rem', fontWeight:800, color:'#0d0d0d', lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:'.68rem', color:SLATE, fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', marginTop:3 }}>{s.label}</div>
              </div>
            </div>
          )) : null}
        </div>

        {/* ── Row 1: Fee Bar Chart + Registration Pie ── */}
        <div className="dash-r1" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18, marginBottom: 18 }}>

          {/* Monthly Fee Collection bar chart */}
          <Card>
            <CardTitle><BarChart2 size={15} /> Monthly Fee Collection</CardTitle>
            {data?.monthlyFees.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.monthlyFees} margin={{ top:4, right:8, left:0, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize:11, fill:SLATE, fontFamily:'Karla,sans-serif' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize:11, fill:SLATE, fontFamily:'Karla,sans-serif' }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip content={<CustomTooltipFee />} />
                  <Bar dataKey="total" fill={ORG} radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:'#cbd5e1', fontSize:'.85rem' }}>No payment data yet</div>
            )}
          </Card>

          {/* Registration Status Pie */}
          <Card>
            <CardTitle><ClipboardList size={15} /> Registration Status</CardTitle>
            {data ? (() => {
              const pieData = PIE_REG.map(p => ({ name: p.label, value: (data.regStats as any)[p.key], color: p.color })).filter(x => x.value > 0)
              return pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: any) => [v, '']} contentStyle={{ fontFamily:'Karla,sans-serif', fontSize:12, borderRadius:8 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 14px', marginTop:8 }}>
                    {pieData.map(d => (
                      <div key={d.name} style={{ display:'flex', alignItems:'center', gap:5 }}>
                        <div style={{ width:10, height:10, borderRadius:3, background:d.color, flexShrink:0 }} />
                        <span style={{ fontSize:'.75rem', color:SLATE, fontWeight:700 }}>{d.name}: <strong style={{ color:'#0d0d0d' }}>{d.value}</strong></span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ height:160, display:'flex', alignItems:'center', justifyContent:'center', color:'#cbd5e1', fontSize:'.85rem' }}>No registrations yet</div>
              )
            })() : null}
          </Card>
        </div>

        {/* ── Row 2: Monthly Registrations Line + Student Status ── */}
        <div className="dash-r2" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18, marginBottom: 18 }}>

          {/* Monthly Registrations line */}
          <Card>
            <CardTitle><LineIcon size={15} /> Monthly Registrations</CardTitle>
            {data?.monthlyRegs.length ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.monthlyRegs} margin={{ top:4, right:8, left:0, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize:11, fill:SLATE, fontFamily:'Karla,sans-serif' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11, fill:SLATE, fontFamily:'Karla,sans-serif' }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                  <Tooltip content={<CustomTooltipReg />} />
                  <Line type="monotone" dataKey="total" stroke={BLUE} strokeWidth={2.5} dot={{ fill:BLUE, r:4 }} activeDot={{ r:6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'#cbd5e1', fontSize:'.85rem' }}>No registration data yet</div>
            )}
          </Card>

          {/* Student Status donut */}
          <Card>
            <CardTitle><Users size={15} /> Students</CardTitle>
            {data ? (() => {
              const total = data.stuStats.total
              const pct = total > 0 ? Math.round((data.stuStats.current / total) * 100) : 0
              const stuPie = [
                { name:'Current', value: data.stuStats.current, color: GRN },
                { name:'Past',    value: data.stuStats.past,    color: '#e2e8f0' },
              ].filter(x => x.value > 0)
              return (
                <>
                  <div style={{ position:'relative', height:150, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie data={stuPie} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={44} paddingAngle={2} startAngle={90} endAngle={-270}>
                          {stuPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position:'absolute', textAlign:'center', pointerEvents:'none' }}>
                      <div style={{ fontSize:'1.5rem', fontWeight:800, color:'#0d0d0d', lineHeight:1 }}>{pct}%</div>
                      <div style={{ fontSize:'.65rem', color:SLATE, fontWeight:700, marginTop:2 }}>ACTIVE</div>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8 }}>
                    {[{ label:'Current', value: data.stuStats.current, color: GRN }, { label:'Past', value: data.stuStats.past, color: SLATE }].map(s => (
                      <div key={s.label} style={{ textAlign:'center', padding:'8px', background:'#f8fafc', borderRadius:10 }}>
                        <div style={{ fontSize:'1.3rem', fontWeight:800, color:s.color }}>{s.value}</div>
                        <div style={{ fontSize:'.68rem', color:SLATE, fontWeight:700, textTransform:'uppercase' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </>
              )
            })() : null}
          </Card>
        </div>

        {/* ── Row 3: Top Courses + Fee Overview ── */}
        <div className="dash-r3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>

          {/* Top Courses */}
          <Card>
            <CardTitle><BookOpen size={15} /> Top Courses</CardTitle>
            {data?.topCourses.length ? (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {data.topCourses.map((c, i) => {
                  const maxStudents = Math.max(...data.topCourses.map(x => x.students))
                  const pct = maxStudents > 0 ? (c.students / maxStudents) * 100 : 0
                  return (
                    <div key={c.course}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                        <span style={{ fontSize:'.83rem', fontWeight:700, color:'#0d0d0d' }}>
                          <span style={{ fontSize:'.72rem', color:SLATE, marginRight:6 }}>#{i+1}</span>{c.course}
                        </span>
                        <div style={{ textAlign:'right' }}>
                          <span style={{ fontSize:'.78rem', fontWeight:700, color:BLUE }}>{c.students} students</span>
                          <span style={{ fontSize:'.72rem', color:SLATE, marginLeft:8 }}>{fmt(c.collected)}</span>
                        </div>
                      </div>
                      <div style={{ height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${BLUE},${ORG})`, borderRadius:99, transition:'width .4s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div style={{ height:120, display:'flex', alignItems:'center', justifyContent:'center', color:'#cbd5e1', fontSize:'.85rem' }}>No course data yet</div>
            )}
          </Card>

          {/* Fee Overview */}
          <Card>
            <CardTitle><Wallet size={15} /> Fee Overview</CardTitle>
            {data ? (() => {
              const total = data.feeStats.collected + data.feeStats.outstanding
              const collPct = total > 0 ? (data.feeStats.collected / total) * 100 : 0
              return (
                <div>
                  <div style={{ marginBottom:20 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                      <span style={{ fontSize:'.8rem', fontWeight:700, color:SLATE }}>Collection Rate</span>
                      <span style={{ fontSize:'.9rem', fontWeight:800, color:GRN }}>{collPct.toFixed(1)}%</span>
                    </div>
                    <div style={{ height:10, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${collPct}%`, background:`linear-gradient(90deg,${GRN},#34d399)`, borderRadius:99, transition:'width .5s' }} />
                    </div>
                  </div>
                  {[
                    { label:'Total Invoiced', value: total, color:'#0d0d0d' },
                    { label:'Collected',      value: data.feeStats.collected,   color: GRN },
                    { label:'Outstanding',    value: data.feeStats.outstanding, color: RED },
                    { label:'Overdue Instalments', value: data.feeStats.overdueCount, color: RED, isCount: true },
                  ].map(s => (
                    <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 0', borderBottom:'1px solid #f1f5f9' }}>
                      <span style={{ fontSize:'.83rem', color:SLATE, fontWeight:600 }}>{s.label}</span>
                      <span style={{ fontSize:'.9rem', fontWeight:800, color:s.color }}>{s.isCount ? s.value : fmt(s.value as number)}</span>
                    </div>
                  ))}
                </div>
              )
            })() : null}
          </Card>
        </div>

        {/* ── Row 4: Recent Registrations + Recent Students ── */}
        <div className="dash-r4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

          <Card>
            <CardTitle><UserPlus size={15} /> Recent Registrations</CardTitle>
            {data?.recentRegs.length ? (
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {data.recentRegs.map(r => (
                  <a key={r.id} href="/admin/registrations" className="dash-link">
                    <div>
                      <div style={{ fontWeight:700, fontSize:'.85rem', color:'#0d0d0d' }}>{r.name}</div>
                      <div style={{ fontSize:'.72rem', color:SLATE }}>{r.program} · {r.createdAt}</div>
                    </div>
                    <span style={{ padding:'2px 8px', borderRadius:20, fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', background: STATUS_COLOR[r.status] + '22', color: STATUS_COLOR[r.status] }}>{r.status}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ color:'#cbd5e1', fontSize:'.85rem', textAlign:'center', padding:'24px 0' }}>No registrations yet</div>
            )}
          </Card>

          <Card>
            <CardTitle><UserCheck size={15} /> Recent Students</CardTitle>
            {data?.recentStudents.length ? (
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {data.recentStudents.map(s => (
                  <a key={s.id} href="/admin/students" className="dash-link">
                    <div>
                      <div style={{ fontWeight:700, fontSize:'.85rem', color:'#0d0d0d' }}>{s.name}</div>
                      <div style={{ fontSize:'.72rem', color:SLATE }}>{s.program} · Joined {s.joinDate}</div>
                    </div>
                    <span style={{ padding:'2px 8px', borderRadius:20, fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', background: STATUS_COLOR[s.status] + '22', color: STATUS_COLOR[s.status] }}>{s.status}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ color:'#cbd5e1', fontSize:'.85rem', textAlign:'center', padding:'24px 0' }}>No students yet</div>
            )}
          </Card>
        </div>

        </>}
      </div>
    </div>
  )
}
