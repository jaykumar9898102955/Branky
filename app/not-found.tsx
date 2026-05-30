import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1448b8 0%, #1D5CE3 50%, #FF931E 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Karla', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;600;700;800&family=Fredoka+One&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .not-found-card { animation: float 4s ease-in-out infinite; }
        .go-home-btn:hover { background: #e07b0e !important; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,147,30,.5) !important; }
        .go-home-btn { transition: all .3s ease !important; }
        .back-link:hover { color: #fff !important; }
        .back-link { transition: color .2s !important; }
      `}} />

      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,.06)', pointerEvents: 'none' }} />

      <div className="not-found-card" style={{
        background: '#fff',
        borderRadius: 28,
        padding: 'clamp(36px,6vw,60px)',
        width: 'min(480px,96vw)',
        textAlign: 'center',
        boxShadow: '0 40px 100px rgba(0,0,0,.3)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Top accent bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#1D5CE3,#FF931E)', borderRadius: '28px 28px 0 0' }} />

        <Image
          src="/assets/logo-main.png"
          alt="Branky STEM Labs"
          width={140}
          height={44}
          style={{ objectFit: 'contain', marginBottom: 24, height: 'auto' }}
        />

        {/* 404 big number */}
        <div style={{
          fontSize: 'clamp(72px,16vw,108px)',
          fontWeight: 800,
          lineHeight: 1,
          background: 'linear-gradient(135deg,#1D5CE3,#FF931E)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 12,
          fontFamily: "'Fredoka One', cursive",
        }}>404</div>

        <h1 style={{ fontSize: 'clamp(1.2rem,3vw,1.6rem)', fontWeight: 800, color: '#0d0d0d', marginBottom: 10 }}>
          Oops! Page Not Found
        </h1>
        <p style={{ fontSize: '.95rem', color: '#64748b', lineHeight: 1.7, marginBottom: 30 }}>
          Looks like this page went on a field trip without us!<br />
          Let&apos;s get you back to the lab.
        </p>

        <Link
          href="/"
          className="go-home-btn"
          style={{
            display: 'inline-block',
            padding: '14px 36px',
            background: '#FF931E',
            color: '#fff',
            borderRadius: 14,
            fontWeight: 800,
            fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(255,147,30,.35)',
          }}
        >
          Back to Home →
        </Link>

        <div style={{ marginTop: 20 }}>
          <Link href="/admin" className="back-link" style={{ fontSize: '.82rem', color: '#94a3b8', textDecoration: 'none' }}>
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
