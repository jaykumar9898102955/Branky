import { useState } from 'react';
import styles from '../css/Home.module.css';

export default function ProgramCard({ p, onRegister }) {
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
