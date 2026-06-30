import Image from 'next/image'
import Link from 'next/link'
import { Target } from 'lucide-react'

export default function FreeDemoStrip() {
  return (
    <section className="demo-strip">
      {/* Wave decoration */}
      <div className="demo-deco demo-deco-r">
        <Image src="/assets/brand-wave.png" alt="" width={240} height={240} style={{ width:'100%', height:'auto', filter:'brightness(0) invert(1)' }} />
      </div>
      <div className="demo-deco demo-deco-l">
        <Image src="/assets/brand-shapes.png" alt="" width={180} height={180} style={{ width:'100%', height:'auto', filter:'brightness(0) invert(1)' }} />
      </div>

      <div className="demo-inner">
        <div className="demo-text">
          <div className="demo-badge">
            <Target size={13} /> Free Demo Session
          </div>
          <h2 className="h-display demo-h2">
            Not sure which program is right<br className="demo-br" /> for your child?
          </h2>
          <p className="demo-p">
            Book a Free Demo Session — experience the lab, meet the mentors and let your child try a hands-on session before you decide anything.
          </p>
        </div>

        <div className="demo-cta">
          <Link href="/contact" className="btn btn-blue btn-lg demo-btn">
            Book Free Demo — It&apos;s Completely Free
          </Link>
          <p className="demo-note">
            Seats fill fast · Vadodara only · No commitment required
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        .demo-strip {
          background:linear-gradient(135deg,var(--orange-dark),var(--orange));
          padding:64px 5%;
          position:relative;
          overflow:hidden;
        }
        .demo-deco {
          position:absolute;
          pointer-events:none;
        }
        .demo-deco-r { top:-20px; right:-40px; width:22%; max-width:240px; opacity:.1; animation:blobFloat 10s ease-in-out infinite; }
        .demo-deco-l { bottom:-20px; left:-30px; width:16%; max-width:180px; opacity:.08; }

        .demo-inner {
          max-width:1200px;
          margin:0 auto;
          position:relative;
          z-index:1;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:32px;
          flex-wrap:wrap;
        }
        .demo-badge {
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:4px 14px;
          background:rgba(255,255,255,.2);
          border-radius:50px;
          font-size:.72rem;
          font-weight:800;
          letter-spacing:.1em;
          text-transform:uppercase;
          color:rgba(255,255,255,.9);
          margin-bottom:16px;
        }
        .demo-h2 {
          font-size:clamp(1.6rem,3.5vw,2.6rem);
          color:#fff;
          margin-bottom:12px;
          line-height:1.15;
        }
        .demo-p {
          font-size:1rem;
          color:rgba(255,255,255,.8);
          margin:0;
          line-height:1.65;
          max-width:520px;
        }
        .demo-cta {
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:12px;
          flex-shrink:0;
        }
        .demo-btn {
          white-space:nowrap;
          padding-left:48px;
          padding-right:48px;
        }
        .demo-note {
          font-size:.78rem;
          color:rgba(255,255,255,.6);
          margin:0;
          text-align:center;
        }

        /* Tablet */
        @media(max-width:860px) {
          .demo-br { display:none; }
          .demo-inner { flex-direction:column; align-items:flex-start; }
        }

        /* Phone */
        @media(max-width:640px) {
          .demo-strip { padding:40px 5%; }
          .demo-inner { align-items:stretch; gap:24px; }
          .demo-text { text-align:center; }
          .demo-badge { margin:0 auto 14px; }
          .demo-p { font-size:.92rem; max-width:100%; }
          .demo-cta { align-items:stretch; }
          .demo-btn {
            white-space:normal;
            text-align:center;
            padding-left:24px;
            padding-right:24px;
            width:100%;
          }
          .demo-note { font-size:.74rem; }
        }
      `}} />
    </section>
  )
}
