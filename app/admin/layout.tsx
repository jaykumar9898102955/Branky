'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { AlertTriangle, LayoutDashboard, ClipboardList, Users, BookOpen, Globe, LogOut, Eye, EyeOff } from 'lucide-react'

const NAV = [
  { href: '/admin',                  Icon: LayoutDashboard, label: 'Dashboard'     },
  { href: '/admin/registrations',    Icon: ClipboardList,   label: 'Registrations' },
  { href: '/admin/students',         Icon: Users,           label: 'Students'      },
  { href: '/admin/programs',         Icon: BookOpen,        label: 'Programs'      },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [checking, setChecking]     = useState(true)
  const [authed, setAuthed]         = useState(false)
  const [sideOpen, setSideOpen]     = useState(false)
  const [loginForm, setLoginForm]   = useState({ email: '', password: '' })
  const [showPw, setShowPw]         = useState(false)
  const [loginErr, setLoginErr]     = useState('')
  const [loggingIn, setLoggingIn]   = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  // ── verify existing session on every page load ──────────────────────────
  const verify = useCallback(async () => {
    // If we have a session hint in sessionStorage, skip the full-page spinner
    // and show content immediately; still verify in background
    const cached = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('admin_auth') === '1'
    if (cached) {
      setAuthed(true)
      setChecking(false)
      try {
        const r = await fetch('/api/admin/verify')
        if (!r.ok) {
          sessionStorage.removeItem('admin_auth')
          setAuthed(false)
        }
      } catch {
        sessionStorage.removeItem('admin_auth')
        setAuthed(false)
      }
    } else {
      setChecking(true)
      try {
        const r = await fetch('/api/admin/verify')
        if (r.ok) {
          sessionStorage.setItem('admin_auth', '1')
          setAuthed(true)
        } else {
          setAuthed(false)
        }
      } catch {
        setAuthed(false)
      } finally {
        setChecking(false)
      }
    }
  }, [])

  useEffect(() => { verify() }, [verify])

  // The public site hides the native cursor (globals.css body{cursor:none})
  // and draws a custom one — but the Cursor component skips /admin routes,
  // so restore the real mouse pointer for the whole admin area.
  useEffect(() => {
    document.body.style.cursor = 'auto'
    return () => { document.body.style.cursor = '' }
  }, [])

  // ── login ────────────────────────────────────────────────────────────────
  const login = async () => {
    setLoggingIn(true); setLoginErr('')
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })
      if (!r.ok) { setLoginErr('Invalid email or password'); return }
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('admin_auth', '1')
      setAuthed(true)
    } catch { setLoginErr('Network error. Please try again.') }
    finally { setLoggingIn(false) }
  }

  // ── logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('admin_auth')
    setAuthed(false)
    router.push('/admin')
  }

  // ── loading spinner ──────────────────────────────────────────────────────
  if (checking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontFamily: 'Karla, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, border: '4px solid #e2e8f0', borderTop: '4px solid #1D5CE3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <div style={{ color: '#64748b', fontWeight: 600 }}>Loading admin…</div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}body{cursor:auto!important}`}</style>
    </div>
  )

  // ── login form ───────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#1D5CE3,#1448b8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Karla, sans-serif' }}>
      {/* hide global WhatsApp button on admin + restore native cursor */}
      <style>{`a[href*="wa.me"]{display:none!important}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}body{cursor:auto!important}button:not(:disabled),a{cursor:pointer!important}input{cursor:text!important}`}</style>
      <div style={{ background: '#fff', borderRadius: 28, padding: 'clamp(32px,5vw,52px)', width: 'min(420px,96vw)', boxShadow: '0 40px 100px rgba(0,0,0,.3)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#1D5CE3,#FF931E)', borderRadius: '28px 28px 0 0' }} />
        <Image src="/assets/logo-main.png" alt="Branky" width={761} height={285} style={{ objectFit: 'contain', marginBottom: 8, display: 'block', width: 150, height: 'auto' }} />
        <p style={{ fontSize: '.88rem', color: '#64748b', marginBottom: 28, fontWeight: 600 }}>Admin Panel — Secure Login</p>
        {loginErr && (
          <div style={{ background: '#fef2f2', border: '2px solid #fecaca', borderRadius: 12, padding: '11px 16px', marginBottom: 16, fontSize: '.87rem', color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} /> {loginErr}
          </div>
        )}
        {[{ k: 'email', l: 'Email', t: 'email', p: 'admin@brankylabs.in' }, { k: 'password', l: 'Password', t: 'password', p: '••••••••' }].map(f => {
          const isPw = f.k === 'password'
          return (
          <div key={f.k} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '.73rem', fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6, color: '#1e293b' }}>{f.l}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={isPw && showPw ? 'text' : f.t} placeholder={f.p}
                value={(loginForm as any)[f.k]}
                onChange={e => setLoginForm(x => ({ ...x, [f.k]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && login()}
                style={{ width: '100%', padding: '12px 16px', paddingRight: isPw ? 46 : 16, background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 12, fontFamily: 'Karla,sans-serif', fontSize: '.95rem', outline: 'none', boxSizing: 'border-box' }}
              />
              {isPw && (
                <button type="button" onClick={() => setShowPw(s => !s)} tabIndex={-1}
                  title={showPw ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 6, display: 'flex', alignItems: 'center' }}>
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>
          )
        })}
        <button onClick={login} disabled={loggingIn}
          style={{ width: '100%', padding: 14, background: loggingIn ? '#94a3b8' : '#1D5CE3', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1rem', cursor: loggingIn ? 'not-allowed' : 'pointer', fontFamily: 'Karla,sans-serif', marginTop: 4 }}>
          {loggingIn ? 'Logging in…' : 'Login to Admin →'}
        </button>
        <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: '.84rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>← Back to Website</a>
      </div>
    </div>
  )

  // ── admin layout with sidebar ────────────────────────────────────────────
  return (
    <div className="admin-root" style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Karla, sans-serif' }}>
      {/* hide global WhatsApp & cursor on admin pages */}
      <style>{`
        a[href*="wa.me"]{display:none!important}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @media(max-width:768px){ .admin-sidebar{transform:translateX(-100%)!important} .admin-sidebar.open{transform:translateX(0)!important} .admin-overlay{display:block!important} }
        .admin-root,.admin-root *{cursor:default!important}
        .admin-root button:not(:disabled),.admin-root a,.admin-root select{cursor:pointer!important;}
        .admin-root input[type=text],.admin-root input[type=email],.admin-root input[type=password],.admin-root input[type=tel],.admin-root input[type=number],.admin-root input[type=search],.admin-root textarea{cursor:text!important;}
        .admin-nav-link{transition:background .15s,color .15s;}
        .admin-nav-link:not(.nav-active):hover{background:rgba(255,255,255,.1)!important;color:rgba(255,255,255,.9)!important;}
        .admin-site-link:hover{background:rgba(255,255,255,.07)!important;color:rgba(255,255,255,.65)!important;}
        .admin-logout:hover{background:rgba(220,38,38,.28)!important;border-color:rgba(220,38,38,.5)!important;}
        .admin-root button:not(:disabled){transition:all .14s ease;}
        .admin-root button:not(:disabled):hover{filter:brightness(.91);transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.13)!important;}
        .admin-root table tbody tr{transition:background .1s;}
        .admin-root table tbody tr:hover td{background:#eef3ff!important;}
      `}</style>

      {/* Sidebar overlay on mobile */}
      {sideOpen && (
        <div className="admin-overlay" onClick={() => setSideOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 40, display: 'none' }} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar${sideOpen ? ' open' : ''}`}
        style={{ width: 220, background: '#0f172a', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50, transition: 'transform .25s ease', overflowY: 'auto' }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <Image src="/assets/logo-15.png" alt="Branky" width={717} height={283} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', width: 110, height: 'auto', display: 'block' }} />
          <div style={{ marginTop: 8, fontSize: '.72rem', color: 'rgba(255,255,255,.4)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Admin Panel</div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <a key={item.href} href={item.href} onClick={() => setSideOpen(false)}
                className={`admin-nav-link${active ? ' nav-active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, marginBottom: 4, textDecoration: 'none', fontWeight: 700, fontSize: '.88rem', background: active ? '#1D5CE3' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,.55)' }}>
                <item.Icon size={17} />
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* Bottom: site link + logout */}
        <div style={{ padding: '12px 12px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <a href="/" target="_blank"
            className="admin-site-link"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, marginBottom: 6, textDecoration: 'none', fontSize: '.82rem', fontWeight: 600, color: 'rgba(255,255,255,.4)' }}>
            <Globe size={15} /> View Website
          </a>
          <button onClick={logout}
            className="admin-logout"
            style={{ width: '100%', padding: '9px 14px', background: 'rgba(220,38,38,.15)', border: '1.5px solid rgba(220,38,38,.25)', borderRadius: 10, color: '#fca5a5', fontWeight: 700, fontSize: '.85rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Karla,sans-serif' }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main" style={{ marginLeft: 220, flex: 1, minHeight: '100vh', background: '#f1f5f9', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar (mobile hamburger) */}
        <div style={{ background: '#0f172a', height: 52, display: 'none', alignItems: 'center', paddingLeft: 16, gap: 12, position: 'sticky', top: 0, zIndex: 30 }}
          className="mobile-topbar">
          <button onClick={() => setSideOpen(s => !s)}
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>☰</button>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>Branky Admin</span>
        </div>

        <style>{`
          @media(max-width:768px){
            .admin-main{margin-left:0!important}
            .mobile-topbar{display:flex!important}
          }
        `}</style>

        {children}
      </div>
    </div>
  )
}
