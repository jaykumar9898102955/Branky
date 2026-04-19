import { useState } from 'react';
import styles from '../css/Home.module.css';

export default function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.faq} ${open ? styles.faqOpen : ''}`} onClick={()=>setOpen(!open)}>
      <div className={styles.faqQ}><span>{q}</span><span className={styles.faqIcon}>{open?'−':'+'}</span></div>
      {open && <div className={styles.faqA}>{a}</div>}
    </div>
  );
}
