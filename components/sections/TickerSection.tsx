export default function TickerSection() {
  const items = ['Robotics','Artificial Intelligence','Python Coding','Electronics','Drones','Mechatronics','IoT','Leadership','Tech Designing','Problem Solving']
  const doubled = [...items, ...items]
  return (
    <div style={{ background:'var(--blue)', padding:'15px 0', overflow:'hidden', position:'relative', zIndex:1, borderTop:'4px solid var(--orange)', borderBottom:'4px solid var(--orange)' }}>
      <div style={{ display:'flex', animation:'ticker 28s linear infinite', whiteSpace:'nowrap' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:20, flexShrink:0, padding:'0 32px', fontSize:'.85rem', fontWeight:800, color:'#fff', letterSpacing:'.1em', textTransform:'uppercase', fontFamily:"'Karla',sans-serif" }}>
            {item}
            <span style={{ color:'var(--orange)', fontSize:'1rem', lineHeight:1 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
