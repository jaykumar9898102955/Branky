import { useState } from 'react';
import styles from '../css/Home.module.css';

export default function DayCard({ day }) {
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
