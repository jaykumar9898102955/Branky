import Image from 'next/image'

const LEFT_TAGS = [
  'Coding',
  'IoT & Smart Systems',
  'Artificial Intelligence',
  'Problem Solving',
]

const RIGHT_TAGS = [
  'Robotics',
  'Drones',
  'Mechatronics',
  'Electronics & Circuits',
]

export default function WhatWeTeachSection() {
  return (
    <section className="wt">
      {/* Subtle grid bg */}
      <div className="wt-bg-grid" />

      <div className="wt-inner">

        {/* Heading */}
        <div className="wt-head reveal">
          <h2 className="h-display wt-h2">What We Teach</h2>
          <div className="wt-rule">
            <div className="wt-rule-o" />
            <div className="wt-rule-b" />
          </div>
        </div>

        {/* 3-column layout: left tags | image | right tags */}
        <div className="wt-layout">

          {/* Left tags – right-aligned */}
          <div className="wt-col-tags wt-left reveal">
            {LEFT_TAGS.map(t => (
              <div key={t} className="wt-tag">{t}</div>
            ))}
          </div>

          {/* Center: photo with orange arc ring */}
          <div className="wt-center reveal d2">
            <div className="wt-arc" />
            <div className="wt-img-frame">
              <Image
                src="/assets/robot2.png"
                alt="Branky STEM student"
                width={300}
                height={420}
                className="wt-photo"
              />
            </div>
          </div>

          {/* Right tags – left-aligned */}
          <div className="wt-col-tags wt-right reveal d3">
            {RIGHT_TAGS.map(t => (
              <div key={t} className="wt-tag">{t}</div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .wt {
          padding: 80px 5% 72px;
          background: var(--blue-xpale);
          position: relative;
          overflow: hidden;
        }
        .wt-bg-grid {
          position: absolute; inset: 0;
          background-image: url('/assets/brand-grid.png');
          background-size: cover;
          opacity: .045;
          pointer-events: none;
          z-index: 0;
        }
        .wt-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Heading */
        .wt-head { text-align: center; margin-bottom: 56px; }
        .wt-h2 {
          font-size: clamp(2.4rem, 5.5vw, 4rem);
          color: var(--blue);
          text-transform: uppercase;
          margin-bottom: 14px;
          letter-spacing: -.01em;
        }
        .wt-rule { display: flex; align-items: center; gap: 8px; justify-content: center; }
        .wt-rule-o { height: 5px; width: 52px; background: var(--orange); border-radius: 10px; }
        .wt-rule-b { height: 5px; width: 110px; background: var(--blue); border-radius: 10px; }

        /* 3-column grid */
        .wt-layout {
          display: grid;
          grid-template-columns: 1fr 300px 1fr;
          gap: 36px;
          align-items: center;
        }

        /* Tag columns */
        .wt-col-tags { display: flex; flex-direction: column; gap: 14px; }
        .wt-left  { align-items: flex-end; }
        .wt-right { align-items: flex-start; }

        .wt-tag {
          background: var(--blue);
          color: #fff;
          padding: 12px 22px;
          border-radius: 10px;
          font-size: .78rem;
          font-weight: 800;
          letter-spacing: .07em;
          text-transform: uppercase;
          font-family: 'Karla', sans-serif;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(29,92,227,.28);
          transition: transform .25s, box-shadow .25s;
        }
        .wt-tag:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(29,92,227,.38);
        }

        /* Center image */
        .wt-center {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .wt-arc {
          position: absolute;
          width: 260px; height: 260px;
          border-radius: 50%;
          border: 18px solid var(--orange);
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          opacity: .9;
        }
        .wt-img-frame {
          position: relative;
          z-index: 1;
          width: 260px;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 28px 64px rgba(29,92,227,.22);
        }
        .wt-photo {
          width: 100%;
          height: 400px;
          object-fit: cover;
          object-position: top;
          display: block;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .wt-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .wt-col-tags {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .wt-left, .wt-right { align-items: center !important; }
          .wt-center { margin: 0 auto; }
        }
        @media (max-width: 480px) {
          .wt { padding: 60px 5% 52px; }
          .wt-h2 { font-size: clamp(2rem, 8vw, 2.6rem) !important; }
          .wt-tag { font-size: .72rem; padding: 10px 16px; }
        }
      `}} />
    </section>
  )
}
