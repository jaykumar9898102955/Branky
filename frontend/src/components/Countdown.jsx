import { useState, useEffect } from 'react';
import styles from '../css/Home.module.css';

export default function Countdown() {
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
