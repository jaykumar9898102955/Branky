import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

// ── DATA ─────────────────────────────────────────────────────────────────────
const PROGRAMS = [
  { id:'robotics', icon:'🤖', title:'Robotics & Coding', age:'Ages 7–14', duration:'2 Weeks', seats:16, price:'₹8,999', desc:'Build and program robots from scratch using Lego Mindstorms & Arduino. Logic, mechanics, teamwork.', highlights:['Lego Mindstorms','Arduino Basics','Robot Battle Day','Take-Home Project'], color:'#1D5CE3' },
  { id:'ai', icon:'🧠', title:'AI & Machine Learning', age:'Ages 10–16', duration:'2 Weeks', seats:12, price:'₹9,999', desc:'Build your own image classifier, train a chatbot, and explore how AI shapes our world.', highlights:['Python Basics','Image Classification','ChatBot Builder','Ethics in AI'], color:'#FF931E' },
  { id:'electronics', icon:'⚡', title:'Electronics & IoT', age:'Ages 9–15', duration:'10 Days', seats:14, price:'₹7,499', desc:'Build smart devices using Raspberry Pi and IoT sensors that actually do cool things.', highlights:['Circuit Design','Raspberry Pi','Smart Home Device','IoT Dashboard'], color:'#1D5CE3' },
  { id:'3d', icon:'🖨️', title:'3D Design & Printing', age:'Ages 8–14', duration:'1 Week', seats:10, price:'₹5,999', desc:'Learn CAD design and bring your creations to life on professional 3D printers.', highlights:['TinkerCAD / Fusion 360','Print Your Design','Product Pitching','Portfolio Kit'], color:'#FF931E' },
];

const CURRICULUM = [
  { day:1, theme:'Smart Logic', sub:'Power Flow & Types of Switches', kit:'PlayTrons', color:'#1D5CE3', why:'Input → Output logic', projects:['Door Bell','LED Light through Switch'], activities:[{label:'Introduction of Students & Tutor',time:'10 mins'},{label:'Introduction of Program',time:'5 mins'},{label:'Agenda of the Day',time:'2 mins'},{label:'Brain Game',time:'5 mins'},{label:'Intro to PlayTrons Kit & Components',time:'10 mins'},{label:'Project 1 — Door Bell (Brief, Assembly & Testing)',time:'15 mins',video:'https://youtu.be/X13pT81yrKA'},{label:'Project 1 — Door Bell (Hardware Design & Final Assembly)',time:'20 mins',video:'https://youtu.be/X13pT81yrKA'},{label:'Project 2 — LED Light through Switch (Brief & Assembly)',time:'10 mins'},{label:'Project 2 — LED Light through Switch (Final)',time:'5 mins'},{label:'Worksheet & Conclusion',time:'8 mins'}] },
  { day:2, theme:'Sensor-Driven Control', sub:'Real Circuit Understanding', kit:'Playtronix', color:'#FF931E', why:'Real circuit understanding', projects:['Refrigerator Door Sensor','Theft Detector'], activities:[{label:'Greetings',time:'2 mins'},{label:'Agenda of the Day',time:'2 mins'},{label:'Brain Game',time:'5 mins'},{label:'Project 1 — Refrigerator Door (Brief, Assembly & Testing)',time:'40 mins'},{label:'Project 2 — Theft Detector on Main Door',time:'30 mins',video:'https://youtu.be/MpwP64wkDhk'},{label:'Worksheet & Conclusion',time:'10 mins'}] },
  { day:3, theme:'Mechanics Project', sub:'Gears, Motion & Forces', kit:'Mechanics Kit', color:'#1D5CE3', why:'Understanding forces and mechanical advantage', projects:['Mechanics Build Project'], activities:[{label:'Greetings',time:'2 mins'},{label:'Agenda of the Day',time:'2 mins'},{label:'Brain Game',time:'5 mins'},{label:'Mechanics Intro — Gears, Levers & Motion',time:'15 mins'},{label:'Project 1 — Mechanics Build (Brief & Assembly)',time:'45 mins'},{label:'Testing & Troubleshooting',time:'15 mins'},{label:'Worksheet & Conclusion',time:'10 mins'}] },
  { day:4, theme:'Button-Based Programming', sub:'Introduction to Coding Logic', kit:'Wizbot', color:'#FF931E', why:'Sequential thinking and basic programming logic', projects:['Wizbot Project 1','Wizbot Project 2'], activities:[{label:'Greetings',time:'2 mins'},{label:'Agenda of the Day',time:'5 mins'},{label:'Brain Game',time:'5 mins'},{label:'Logical Coding Worksheet (in sync with Wizbot)',time:'20 mins'},{label:'Introduction to Wizbot',time:'10 mins'},{label:'Project 1 — Wizbot Challenge',time:'15 mins'},{label:'Project 2 — Wizbot Challenge',time:'15 mins'},{label:'Worksheet & Conclusion',time:'10 mins'}] },
  { day:5, theme:'Computer-Driven Programming', sub:'Microcontrollers & Software', kit:'PEECEE + Plaude', color:'#1D5CE3', why:'Bridging hardware and software concepts', projects:['RGB Lights Controller'], activities:[{label:'Greetings',time:'2 mins'},{label:'Agenda of the Day',time:'5 mins'},{label:'Brain Game',time:'5 mins'},{label:'PEECEE — Intro to Microcontrollers',time:'10 mins'},{label:'PEECEE — Physical Components, Buttons & Architecture',time:'20 mins'},{label:'Plaude Software — Introduction',time:'20 mins'},{label:'Project 1 — RGB Lights',time:'20 mins'},{label:'Worksheet & Conclusion',time:'10 mins'}] },
  { day:6, theme:'Exhibition Day', sub:'RoboSoccer & Parent Orientation', kit:'All Kits', color:'#FF931E', why:'Confidence building, presentation and celebration', projects:['Student Exhibition','RoboSoccer','Parent Showcase'], activities:[{label:'Greetings & Setup',time:'10 mins'},{label:'Exhibition of Work Done by Students',time:'20 mins'},{label:'RoboSoccer Tournament',time:'30 mins'},{label:'Parent Orientation & Q&A',time:'30 mins'}] },
];

const FAQS = [
  {q:'What age groups do you cater to?',a:'Our camps are designed for children aged 7–16, with different programs tailored to different skill levels and age groups.'},
  {q:'Do kids need prior experience?',a:'Absolutely not! All programs start from scratch. Every child — beginner or experienced — learns and grows with our instructors.'},
  {q:'What is the batch size?',a:'We keep batches small (10–16 students) so every child gets personal attention from our instructors.'},
  {q:'Where are the camps held?',a:'Camps are held at our state-of-the-art lab in Vadodara, Gujarat. Exact details are shared upon registration.'},
  {q:'Do kids take anything home?',a:'Yes! Every camper takes home their project, a certificate of completion, and a portfolio of their work.'},
  {q:'Is there a sibling discount?',a:'Yes! Register two or more siblings and get ₹1,000 off per child. Contact us after registering.'},
];

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry'];

// ── COUNTDOWN ─────────────────────────────────────────────────────────────────
function Countdown() {
  const [t, setT] = useState({d:0,h:0,m:0,s:0});
  useEffect(() => {
    const tick = () => {
      const diff = new Date('2025-05-20T00:00:00') - new Date();
      if (diff > 0) setT({ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className={styles.countdown}>
      {[['d','Days'],['h','Hrs'],['m','Min'],['s','Sec']].map(([k,lb]) => (
        <div key={k} className={styles.cdUnit}>
          <span className={styles.cdNum}>{String(t[k]).padStart(2,'0')}</span>
          <span className={styles.cdLbl}>{lb}</span>
        </div>
      ))}
    </div>
  );
}

// ── PROGRAM CARD ──────────────────────────────────────────────────────────────
function ProgramCard({ p, onRegister }) {
  const [flip, setFlip] = useState(false);
  return (
    <div className={`${styles.pCard} ${flip ? styles.flipped : ''}`} onMouseEnter={()=>setFlip(true)} onMouseLeave={()=>setFlip(false)}>
      <div className={styles.cardInner}>
        <div className={styles.cardFront} style={{'--ca':p.color}}>
          <div className={styles.cardIcon}>{p.icon}</div>
          <div className={styles.cardBadge}>{p.age}</div>
          <h3 className={styles.cardTitle}>{p.title}</h3>
          <p className={styles.cardDesc}>{p.desc}</p>
          <div className={styles.cardMeta}><span>⏱ {p.duration}</span><span>👥 Max {p.seats}</span></div>
          <div className={styles.cardPrice}>{p.price} <small>/ child</small></div>
        </div>
        <div className={styles.cardBack} style={{'--ca':p.color}}>
          <h4>What You'll Learn</h4>
          <ul>{p.highlights.map(h=><li key={h}><span>✦</span> {h}</li>)}</ul>
          <button className={styles.btnReg} onClick={()=>onRegister(p.title)}>Reserve a Spot →</button>
        </div>
      </div>
    </div>
  );
}

// ── DAY CARD ──────────────────────────────────────────────────────────────────
function DayCard({ day }) {
  const [open, setOpen] = useState(false);
  const total = day.activities.reduce((s,a)=>s+(parseInt(a.time)||0),0);
  return (
    <div className={`${styles.dayCard} ${open ? styles.dayOpen : ''}`}>
      <div className={styles.dayHeader} onClick={()=>setOpen(!open)}>
        <span className={styles.dayNum} style={{background:day.color}}>Day {day.day}</span>
        <div className={styles.dayInfo}><h4>{day.theme}</h4><p>{day.sub}</p></div>
        <div className={styles.dayMeta}>
          <span>🧰 {day.kit}</span>
          <span>⏱ ~{total} mins</span>
          <span>🔨 {day.projects.length} project{day.projects.length>1?'s':''}</span>
        </div>
        <span className={styles.dayToggle}>{open?'−':'+'}</span>
      </div>
      {open && (
        <div className={styles.dayBody}>
          <div className={styles.dayWhy}><strong>💡 Why This Works: </strong>{day.why}</div>
          <div className={styles.pills}>{day.projects.map(pr=><span key={pr} className={styles.pill} style={{background:day.color}}>{pr}</span>)}</div>
          <table className={styles.actTable}>
            <thead><tr><th>#</th><th>Activity</th><th>Time</th><th>Video</th></tr></thead>
            <tbody>
              {day.activities.map((a,i)=>(
                <tr key={i}>
                  <td className={styles.actN}>{i+1}</td>
                  <td>{a.label}</td>
                  <td className={styles.actT}>{a.time}</td>
                  <td>{a.video ? <a href={a.video} target="_blank" rel="noreferrer" className={styles.vidLink}>▶ Watch</a> : <span className={styles.noVid}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── REGISTER MODAL ────────────────────────────────────────────────────────────
function Modal({ open, onClose, pre }) {
  const empty = {parentName:'',studentName:'',studentAge:'',phone:'',schoolName:'',state:'',city:'',program:''};
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { if (pre) setForm(f=>({...f,program:pre})); }, [pre]);
  useEffect(() => { if (!open) { setStatus(null); setMsg(''); setForm(empty); } }, [open]);

  const ch = e => setForm({...form,[e.target.name]:e.target.value});

  const submit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      const r = await fetch('http://localhost:5000/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const d = await r.json();
      if (d.success) { setStatus('success'); setMsg(d.message); }
      else { setStatus('error'); setMsg(d.message||'Error'); }
    } catch { setStatus('error'); setMsg('Cannot connect to server.'); }
  };

  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e=>e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        {status === 'success' ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>🎉</div>
            <h3>You&apos;re In!</h3>
            <p>{msg}</p>
            <button className={styles.btnReg} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2>Register Your Child</h2>
            <p className={styles.modalSub}>Fill in the details and we'll confirm your spot!</p>
            <form onSubmit={submit}>
              <div className={styles.fsTitle}>👦 Student Information</div>
              <div className={styles.fGrid}>
                <div className={styles.fg}><label>Student's Full Name *</label><input name="studentName" value={form.studentName} onChange={ch} placeholder="Child's full name" required /></div>
                <div className={styles.fg}><label>Student's Age *</label>
                  <select name="studentAge" value={form.studentAge} onChange={ch} required>
                    <option value="">Select age</option>
                    {Array.from({length:12},(_,i)=>i+5).map(a=><option key={a} value={a}>{a} years</option>)}
                  </select>
                </div>
                <div className={`${styles.fg} ${styles.span2}`}><label>School Name *</label><input name="schoolName" value={form.schoolName} onChange={ch} placeholder="Name of school" required /></div>
              </div>
              <div className={styles.fsTitle}>👨‍👩‍👧 Parent / Guardian Information</div>
              <div className={styles.fGrid}>
                <div className={styles.fg}><label>Parent&apos;s Full Name *</label><input name="parentName" value={form.parentName} onChange={ch} placeholder="Parent name" required /></div>
                <div className={styles.fg}><label>Phone Number *</label><input type="tel" name="phone" value={form.phone} onChange={ch} placeholder="+91 99999 99999" required /></div>
                <div className={styles.fg}>
                  <label>State *</label>
                  <select name="state" value={form.state} onChange={ch} required>
                    <option value="">Select state</option>
                    {STATES.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className={styles.fg}><label>City *</label><input name="city" value={form.city} onChange={ch} placeholder="Your city" required /></div>
              </div>
              <div className={styles.fsTitle}>🎓 Program Selection</div>
              <div className={styles.fGrid}>
                <div className={`${styles.fg} ${styles.span2}`}>
                  <label>Select Program *</label>
                  <select name="program" value={form.program} onChange={ch} required>
                    <option value="">Choose a program</option>
                    {PROGRAMS.map(p=><option key={p.id} value={p.title}>{p.title} — {p.age}</option>)}
                    <option value="7-9 Years STEM Camp (6 Days)">7–9 Years STEM Camp (6 Days)</option>
                  </select>
                </div>
              </div>
              {status === 'error' && <p className={styles.fErr}>{msg}</p>}
              <button type="submit" className={`${styles.btnReg} ${styles.full}`} disabled={status==='loading'}>
                {status==='loading' ? 'Submitting…' : 'Confirm Registration →'}
              </button>
              <p className={styles.fNote}>No payment required. We confirm availability first.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faq} ${open ? styles.faqOpen : ''}`} onClick={()=>setOpen(!open)}>
      <div className={styles.faqQ}><span>{q}</span><span className={styles.faqIcon}>{open?'−':'+'}</span></div>
      {open && <div className={styles.faqA}>{a}</div>}
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [modal, setModal] = useState(false);
  const [pre, setPre] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const open = (p='') => { setPre(p); setModal(true); };
  const go = id => document.getElementById(id)?.scrollIntoView({behavior:'smooth'});

  return (
    <>
      <Head>
        <title>Branky S.T.E.M. Labs — Summer Camp 2025</title>
        <meta name="description" content="Hands-on STEM summer camps for kids in Robotics, AI, Electronics & 3D Printing." />
      </Head>

      {/* NAV */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <img src="/logo.png" alt="Branky STEM Labs" className={styles.navLogo} />
          <div className={styles.navLinks}>
            <button onClick={()=>go('programs')}>Programs</button>
            <button onClick={()=>go('curriculum')}>Curriculum</button>
            <button onClick={()=>go('about')}>About</button>
            <button onClick={()=>go('faq')}>FAQ</button>
            <button className={styles.navCta} onClick={()=>open()}>Register Now</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.s1}/><div className={styles.s2}/><div className={styles.s3}/>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🚀 Summer 2025 Registration Open!</div>
          <h1 className={styles.heroH}>Where Kids Become<br/><span className={styles.heroHL}>Innovators</span></h1>
          <p className={styles.heroSub}>Hands-on STEM summer camps in Robotics, AI, Electronics & 3D Printing. Build real projects. Make real friends.</p>
          <div className={styles.heroCtas}>
            <button className="btn-primary" onClick={()=>open()}>Reserve a Spot</button>
            <button className="btn-outline" onClick={()=>go('programs')}>Explore Programs ↓</button>
          </div>
          <div className={styles.heroDates}><span>🗓 June 2, 2025</span><span className={styles.sep}>|</span><span>📍 Vadodara, Gujarat</span></div>
          <p className={styles.cdLabel}>Registration closes in:</p>
          <Countdown />
        </div>
        <div className={styles.heroVisual}>
          <div className={`${styles.hc} ${styles.hc1}`}>🤖<span>Robotics</span></div>
          <div className={`${styles.hc} ${styles.hc2}`}>🧠<span>AI & ML</span></div>
          <div className={`${styles.hc} ${styles.hc3}`}>⚡<span>Electronics</span></div>
          <div className={`${styles.hc} ${styles.hc4}`}>🖨️<span>3D Printing</span></div>
        </div>
      </section>

      {/* STATS */}
      <div className={styles.stats}>
        {[['500+','Young Innovators'],['12+','Camps Done'],['98%','Parent Satisfaction'],['4','STEM Programs']].map(([v,l])=>(
          <div key={l} className={styles.stat}><span className={styles.statV}>{v}</span><span className={styles.statL}>{l}</span></div>
        ))}
      </div>

      {/* PROGRAMS */}
      <section className={styles.section} id="programs">
        <div className={styles.slabel}>Our Programs</div>
        <h2 className={styles.sHead}>Choose Your Adventure</h2>
        <p className={styles.sSub}>Hover a card to see what your child will build. All programs end with a take-home project!</p>
        <div className={styles.pGrid}>{PROGRAMS.map(p=><ProgramCard key={p.id} p={p} onRegister={open}/>)}</div>
      </section>

      {/* CURRICULUM */}
      <section className={styles.section} id="curriculum">
        <div className={styles.slabel}>6-Day Curriculum</div>
        <h2 className={styles.sHead}>7–9 Years STEM Camp</h2>
        <p className={styles.sSub}>A structured journey from basic circuits to computer-driven programming — designed for young explorers aged 7–9.</p>
        <div className={styles.curOv}>
          {[['6','Days'],['10+','Projects'],['3','Kits Used'],['1','Exhibition Day']].map(([v,l])=>(
            <div key={l} className={styles.curStat}><span>{v}</span>{l}</div>
          ))}
        </div>
        <div className={styles.daysList}>{CURRICULUM.map(d=><DayCard key={d.day} day={d}/>)}</div>
        <div className={styles.curCta}>
          <p>Your child will go from zero to building real electronics in just 6 days.</p>
          <button className="btn-primary" onClick={()=>open('7-9 Years STEM Camp (6 Days)')}>Register for This Camp →</button>
        </div>
      </section>

      {/* WHY */}
      <section className={styles.section} id="about">
        <div className={styles.whyInner}>
          <div className={styles.whyText}>
            <div className={styles.slabel}>Why Branky?</div>
            <h2 className={styles.sHead}>Science is Better When it&apos;s Fun</h2>
            <p>At Branky S.T.E.M. Labs, every child has an inventor inside them. Our camps are not about memorizing formulas — they&apos;re about building, breaking, and discovering.</p>
            <ul className={styles.whyList}>
              <li>✦ <strong>Expert Instructors</strong> — Trained STEM educators who love kids</li>
              <li>✦ <strong>Small Batches</strong> — Max 16 kids so everyone gets attention</li>
              <li>✦ <strong>Real Equipment</strong> — Arduino, Raspberry Pi & 3D printers</li>
              <li>✦ <strong>Project-Based</strong> — Every camper builds something real to take home</li>
              <li>✦ <strong>Safe & Inclusive</strong> — Welcoming space for all backgrounds</li>
            </ul>
            <button className="btn-primary" onClick={()=>open()}>Register My Child →</button>
          </div>
          <div className={styles.whyVis}>
            <div className={styles.blob}><div className={styles.blobIn}><div className={styles.blobStat}>500+<span>kids</span></div><div className={styles.blobTxt}>have attended Branky camps</div></div></div>
            <div className={`${styles.badge} ${styles.b1}`}>🏆 Award-Winning</div>
            <div className={`${styles.badge} ${styles.b2}`}>🔬 Real Equipment</div>
            <div className={`${styles.badge} ${styles.b3}`}>🎓 Certified</div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className={styles.section}>
        <div className={styles.slabel}>Daily Schedule</div>
        <h2 className={styles.sHead}>A Typical Camp Day</h2>
        <div className={styles.timeline}>
          {[['09:00 AM','Morning Assembly','Ice-breakers, daily challenge reveal, team formation.'],['09:30 AM','Concept Session','Instructor-led lesson on the day\'s STEM topic with live demos.'],['10:30 AM','Hands-On Build','Kids get their hands dirty — building, coding, tinkering.'],['12:30 PM','Lunch Break','Recharge and explore at your own pace.'],['01:30 PM','Project Sprint','Team-based project work with instructor guidance.'],['03:30 PM','Demo & Debrief','Present the day\'s creation and celebrate wins.'],['04:00 PM','Wrap Up','Parent pickup with a daily progress update.']].map(([time,title,desc],i)=>(
            <div key={i} className={styles.tlItem}>
              <div className={styles.tlTime}>{time}</div>
              <div className={styles.tlDot}/>
              <div className={styles.tlContent}><h4>{title}</h4><p>{desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={`${styles.section} ${styles.faqSection}`} id="faq">
        <div className={styles.slabel}>FAQ</div>
        <h2 className={styles.sHead}>Got Questions?</h2>
        <div className={styles.faqList}>{FAQS.map(f=><FAQ key={f.q} q={f.q} a={f.a}/>)}</div>
      </section>

      {/* CTA */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaS1}/><div className={styles.ctaS2}/>
        <div className={styles.ctaContent}>
          <h2>Ready to Spark Your Child&apos;s Curiosity?</h2>
          <p>Seats are limited. Early registrations get a welcome kit worth ₹1,500 — free!</p>
          <button className={`${styles.btnLg} btn-primary`} onClick={()=>open()}>Register Now — It&apos;s Easy!</button>
          <p className={styles.ctaFine}>No payment required. We confirm availability first.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}><img src="/logo.png" alt="Branky" style={{filter:'brightness(0) invert(1)',height:40}}/><p>Building tomorrow&apos;s innovators today.</p></div>
          <div className={styles.footerLinks}><h4>Programs</h4>{PROGRAMS.map(p=><button key={p.id} onClick={()=>open(p.title)}>{p.title}</button>)}<button onClick={()=>open('7-9 Years STEM Camp (6 Days)')}>7–9 Years STEM Camp</button></div>
          <div className={styles.footerContact}><h4>Contact Us</h4><p>📞 +91 999-999-9999</p><p>✉️ hello@brankystemlabs.com</p><p>📍 Vadodara, Gujarat</p></div>
        </div>
        <div className={styles.footerBot}><p>© 2025 Branky S.T.E.M. Labs. All rights reserved.</p></div>
      </footer>

      <Modal open={modal} onClose={()=>setModal(false)} pre={pre}/>
    </>
  );
}
