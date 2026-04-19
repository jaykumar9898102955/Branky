import { useState, useEffect } from 'react';
import styles from '../css/Home.module.css';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry'];

export default function Modal({ open, onClose, pre, programs }) {
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
                    {programs && programs.map(p=><option key={p.id} value={p.title}>{p.title} — {p.age}</option>)}
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
