'use client'
import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold:.1 }
    )
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.tl-box').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}
