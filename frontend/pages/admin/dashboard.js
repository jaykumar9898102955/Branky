import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../../styles/Dashboard.module.css';

const API = 'http://localhost:5000/api';

function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('branky_token');
    const u = localStorage.getItem('branky_user');
    if (!t || !u) { router.push('/admin/login'); return; }
    setToken(t);
    setUser(JSON.parse(u));
  }, [router]);

  const logout = () => {
    localStorage.removeItem('branky_token');
    localStorage.removeItem('branky_user');
    router.push('/admin/login');
  };

  return { user, token, logout };
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={styles.statCard} style={{ '--sc': color }}>
      <div className={styles.scIcon}>{icon}</div>
      <div className={styles.scBody}>
        <div className={styles.scValue}>{value}</div>
        <div className={styles.scLabel}>{label}</div>
        {sub && <div className={styles.scSub}>{sub}</div>}
      </div>
      <div className={styles.scBg} />
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className={styles.barChart}>
      {data.map((d, i) => (
        <div key={i} className={styles.barItem}>
          <div className={styles.barOuter}>
            <div className={styles.barFill} style={{ height: `${(d.count / max) * 100}%` }}>
              {d.count > 0 && <span className={styles.barVal}>{d.count}</span>}
            </div>
          </div>
          <div className={styles.barDay}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#10b981', cancelled: '#ef4444' };
const STATUS_LABELS = { pending: '⏳ Pending', confirmed: '✅ Confirmed', cancelled: '❌ Cancelled' };

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [regs, setRegs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterProg, setFilterProg] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [selected, setSelected] = useState(null);

  const authFetch = useCallback(async (url, opts = {}) => {
    if (!token) return null;
    const res = await fetch(url, { ...opts, headers: { ...opts.headers, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
    if (res.status === 401) { logout(); return null; }
    return res.json();
  }, [token]);

  const loadStats = useCallback(async () => {
    const d = await authFetch(`${API}/admin/stats`);
    if (d?.success) setStats(d.stats);
  }, [authFetch]);

  const loadRegs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 10, search, program: filterProg, status: filterStatus, state: filterState });
    const d = await authFetch(`${API}/admin/registrations?${params}`);
    if (d?.success) { setRegs(d.data); setTotal(d.total); setPages(d.pages); }
    setLoading(false);
  }, [authFetch, page, search, filterProg, filterStatus, filterState]);

  useEffect(() => { if (token) { loadStats(); loadRegs(); } }, [token, loadStats, loadRegs]);

  const updateStatus = async (id, status) => {
    await authFetch(`${API}/admin/registrations/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    loadRegs(); loadStats();
  };

  const deleteReg = async (id) => {
    if (!confirm('Delete this registration?')) return;
    await authFetch(`${API}/admin/registrations/${id}`, { method: 'DELETE' });
    loadRegs(); loadStats(); setSelected(null);
  };

  const seedData = async () => {
    setSeeding(true);
    const d = await authFetch(`${API}/admin/seed`, { method: 'POST' });
    if (d?.success) { alert(d.message); loadStats(); loadRegs(); }
    setSeeding(false);
  };

  const programOptions = ['all','Robotics & Coding','AI & Machine Learning','Electronics & IoT','3D Design & Printing','7-9 Years STEM Camp (6 Days)'];

  if (!user) return <div className={styles.loading}>Loading…</div>;

  return (
    <>
      <Head><title>Admin Dashboard — Branky S.T.E.M. Labs</title></Head>
      <div className={styles.layout}>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sbLogo}><img src="/logo.png" alt="Branky" style={{filter:'brightness(0) invert(1)',height:32}}/></div>
          <nav className={styles.sbNav}>
            {[['overview','📊','Overview'],['registrations','📋','Registrations'],['analytics','📈','Analytics']].map(([t,ic,lb])=>(
              <button key={t} className={`${styles.sbBtn} ${tab===t?styles.sbActive:''}`} onClick={()=>setTab(t)}>
                <span>{ic}</span>{lb}
              </button>
            ))}
          </nav>
          <div className={styles.sbFooter}>
            <div className={styles.userChip}>
              <div className={styles.avatar}>{user.avatar}</div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user.name}</div>
                <div className={styles.userRole}>{user.role.replace('_',' ')}</div>
              </div>
            </div>
            <button className={styles.logoutBtn} onClick={logout}>Sign Out →</button>
            {user.role==='super_admin' && (
              <button className={styles.seedBtn} onClick={seedData} disabled={seeding}>
                {seeding ? '⟳ Seeding…' : '🌱 Seed Demo Data'}
              </button>
            )}
          </div>
        </aside>

        {/* MAIN */}
        <main className={styles.main}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.pageTitle}>
                {tab==='overview' && '📊 Overview'}
                {tab==='registrations' && '📋 Registrations'}
                {tab==='analytics' && '📈 Analytics'}
              </h1>
              <p className={styles.pageDate}>{new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
            </div>
            <button className={styles.newRegBtn} onClick={() => router.push('/')}>+ Public Page</button>
          </header>

          {/* OVERVIEW TAB */}
          {tab === 'overview' && stats && (
            <div className={styles.overviewContent}>
              <div className={styles.statsRow}>
                <StatCard icon="🧑‍🎓" label="Total Registrations" value={stats.total} sub="All time" color="#1D5CE3"/>
                <StatCard icon="✅" label="Confirmed" value={stats.confirmed} sub={`${stats.total ? Math.round(stats.confirmed/stats.total*100) : 0}% of total`} color="#10b981"/>
                <StatCard icon="⏳" label="Pending" value={stats.pending} sub="Awaiting confirmation" color="#f59e0b"/>
                <StatCard icon="❌" label="Cancelled" value={stats.cancelled} sub="Not proceeding" color="#ef4444"/>
              </div>

              <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                  <h3>Registrations (Last 7 Days)</h3>
                  <BarChart data={stats.last7} />
                </div>
                <div className={styles.chartCard}>
                  <h3>By Program</h3>
                  <div className={styles.progList}>
                    {Object.entries(stats.byProgram).length === 0 && <p className={styles.empty}>No data yet</p>}
                    {Object.entries(stats.byProgram).map(([prog, cnt]) => (
                      <div key={prog} className={styles.progItem}>
                        <div className={styles.progInfo}>
                          <span className={styles.progName}>{prog}</span>
                          <span className={styles.progCnt}>{cnt}</span>
                        </div>
                        <div className={styles.progBar}><div className={styles.progFill} style={{width:`${(cnt/stats.total)*100}%`}}/></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                  <h3>By State</h3>
                  <div className={styles.stateGrid}>
                    {Object.entries(stats.byState).length === 0 && <p className={styles.empty}>No data yet</p>}
                    {Object.entries(stats.byState).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([s,c])=>(
                      <div key={s} className={styles.stateItem}>
                        <span>{s}</span><span className={styles.stateCount}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.chartCard}>
                  <h3>Quick Actions</h3>
                  <div className={styles.quickActions}>
                    <button className={styles.qaBtn} onClick={()=>setTab('registrations')}>📋 View All Registrations</button>
                    <button className={styles.qaBtn} onClick={()=>{setFilterStatus('pending');setTab('registrations')}}>⏳ Review Pending ({stats.pending})</button>
                    <button className={styles.qaBtn} onClick={()=>{setFilterStatus('confirmed');setTab('registrations')}}>✅ Confirmed Students ({stats.confirmed})</button>
                    <button className={styles.qaBtn} onClick={()=>router.push('/')}>🌐 View Public Page</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REGISTRATIONS TAB */}
          {tab === 'registrations' && (
            <div className={styles.regContent}>
              {/* FILTERS */}
              <div className={styles.filters}>
                <div className={styles.searchWrap}>
                  <span className={styles.searchIcon}>🔍</span>
                  <input className={styles.searchInput} placeholder="Search name, phone, school, ID…" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} />
                </div>
                <select className={styles.filterSel} value={filterProg} onChange={e=>{setFilterProg(e.target.value);setPage(1);}}>
                  {programOptions.map(p=><option key={p} value={p}>{p==='all'?'All Programs':p}</option>)}
                </select>
                <select className={styles.filterSel} value={filterStatus} onChange={e=>{setFilterStatus(e.target.value);setPage(1);}}>
                  <option value="all">All Statuses</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
                <button className={styles.clearBtn} onClick={()=>{setSearch('');setFilterProg('all');setFilterStatus('all');setFilterState('all');setPage(1);}}>Clear</button>
              </div>

              <div className={styles.tableWrap}>
                {loading ? (
                  <div className={styles.tableLoading}>Loading…</div>
                ) : regs.length === 0 ? (
                  <div className={styles.tableEmpty}>
                    <div style={{fontSize:48,marginBottom:12}}>📭</div>
                    <p>No registrations found.</p>
                    {user.role==='super_admin' && <button className={styles.seedBtn2} onClick={seedData}>🌱 Seed Demo Data</button>}
                  </div>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Age</th>
                        <th>Parent</th>
                        <th>Phone</th>
                        <th>School</th>
                        <th>Location</th>
                        <th>Program</th>
                        <th>Registered</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regs.map(r => (
                        <tr key={r.id} className={styles.tRow} onClick={()=>setSelected(r)}>
                          <td><code className={styles.regId}>{r.id}</code></td>
                          <td><strong>{r.studentName}</strong></td>
                          <td className={styles.tc}>{r.studentAge} yrs</td>
                          <td>{r.parentName}</td>
                          <td>{r.phone}</td>
                          <td className={styles.cellTrunc}>{r.schoolName}</td>
                          <td>{r.city}, {r.state}</td>
                          <td className={styles.cellTrunc}><span className={styles.progTag}>{r.program}</span></td>
                          <td className={styles.tc}>{new Date(r.registeredAt).toLocaleDateString('en-IN')}</td>
                          <td onClick={e=>e.stopPropagation()}>
                            <select className={`${styles.statusSel} ${styles['s_'+r.status]}`} value={r.status} onChange={e=>updateStatus(r.id,e.target.value)}>
                              <option value="pending">⏳ Pending</option>
                              <option value="confirmed">✅ Confirmed</option>
                              <option value="cancelled">❌ Cancelled</option>
                            </select>
                          </td>
                          <td onClick={e=>e.stopPropagation()}>
                            <button className={styles.delBtn} onClick={()=>deleteReg(r.id)}>🗑</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* PAGINATION */}
              {pages > 1 && (
                <div className={styles.pagination}>
                  <span className={styles.pgInfo}>Showing {((page-1)*10)+1}–{Math.min(page*10,total)} of {total}</span>
                  <div className={styles.pgBtns}>
                    <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
                    {Array.from({length:Math.min(pages,5)},(_,i)=>i+1).map(p=>(
                      <button key={p} className={page===p?styles.pgActive:''} onClick={()=>setPage(p)}>{p}</button>
                    ))}
                    <button disabled={page===pages} onClick={()=>setPage(p=>p+1)}>Next →</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS TAB */}
          {tab === 'analytics' && stats && (
            <div className={styles.analyticsContent}>
              <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                  <h3>Registration Trend (7 Days)</h3>
                  <BarChart data={stats.last7}/>
                </div>
                <div className={styles.chartCard}>
                  <h3>Status Breakdown</h3>
                  <div className={styles.statusBreakdown}>
                    {['pending','confirmed','cancelled'].map(s=>(
                      <div key={s} className={styles.sbItem} style={{'--sb':STATUS_COLORS[s]}}>
                        <div className={styles.sbBar} style={{height:`${stats.total?(stats[s]/stats.total)*180:0}px`,background:STATUS_COLORS[s]}}/>
                        <div className={styles.sbCount} style={{color:STATUS_COLORS[s]}}>{stats[s]}</div>
                        <div className={styles.sbLabel}>{STATUS_LABELS[s]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                  <h3>Programs Popularity</h3>
                  <div className={styles.progList}>
                    {Object.entries(stats.byProgram).length === 0 && <p className={styles.empty}>No registrations yet. Seed demo data to see analytics.</p>}
                    {Object.entries(stats.byProgram).sort((a,b)=>b[1]-a[1]).map(([prog,cnt])=>(
                      <div key={prog} className={styles.progItem}>
                        <div className={styles.progInfo}><span className={styles.progName}>{prog}</span><span className={styles.progCnt}>{cnt} students</span></div>
                        <div className={styles.progBar}><div className={styles.progFill} style={{width:stats.total?`${(cnt/stats.total)*100}%`:'0%'}}/></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.chartCard}>
                  <h3>Top States</h3>
                  <div className={styles.stateGrid}>
                    {Object.entries(stats.byState).length === 0 && <p className={styles.empty}>No data yet.</p>}
                    {Object.entries(stats.byState).sort((a,b)=>b[1]-a[1]).map(([s,c])=>(
                      <div key={s} className={styles.stateItem}><span>{s}</span><span className={styles.stateCount}>{c}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* REGISTRATION DETAIL DRAWER */}
      {selected && (
        <div className={styles.drawer}>
          <div className={styles.drawerOverlay} onClick={()=>setSelected(null)}/>
          <div className={styles.drawerPanel}>
            <div className={styles.drawerHeader}>
              <h3>Registration Details</h3>
              <button onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.dregId}>{selected.id}</div>
              <div className={styles.dStatus} style={{background:STATUS_COLORS[selected.status]+'22',color:STATUS_COLORS[selected.status]}}>
                {STATUS_LABELS[selected.status]}
              </div>

              <div className={styles.dSection}>👦 Student</div>
              <div className={styles.dRow}><span>Name</span><strong>{selected.studentName}</strong></div>
              <div className={styles.dRow}><span>Age</span><strong>{selected.studentAge} years</strong></div>
              <div className={styles.dRow}><span>School</span><strong>{selected.schoolName}</strong></div>

              <div className={styles.dSection}>👨‍👩‍👧 Parent / Guardian</div>
              <div className={styles.dRow}><span>Name</span><strong>{selected.parentName}</strong></div>
              <div className={styles.dRow}><span>Phone</span><a href={`tel:${selected.phone}`} className={styles.dLink}>{selected.phone}</a></div>
              <div className={styles.dRow}><span>Location</span><strong>{selected.city}, {selected.state}</strong></div>

              <div className={styles.dSection}>🎓 Program</div>
              <div className={styles.dRow}><span>Program</span><strong>{selected.program}</strong></div>
              <div className={styles.dRow}><span>Registered</span><strong>{new Date(selected.registeredAt).toLocaleString('en-IN')}</strong></div>

              <div className={styles.dActions}>
                <div style={{marginBottom:8,fontSize:13,fontWeight:700,color:'#64748b'}}>Update Status:</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {['pending','confirmed','cancelled'].map(s=>(
                    <button key={s} className={`${styles.dStatusBtn} ${selected.status===s?styles.dStatusActive:''}`}
                      style={{'--ds':STATUS_COLORS[s]}}
                      onClick={()=>{updateStatus(selected.id,s);setSelected({...selected,status:s});}}>
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
                <button className={styles.dDeleteBtn} onClick={()=>deleteReg(selected.id)}>🗑 Delete Registration</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
