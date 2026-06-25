'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function Cursor() {
  const pathname = usePathname()
  const curRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const isAdmin = pathname?.startsWith('/admin') ?? false

  useEffect(() => {
    if (isAdmin) return
    let mx=0,my=0,rx=0,ry=0
    const move=(e:MouseEvent)=>{
      mx=e.clientX;my=e.clientY
      if(curRef.current){curRef.current.style.left=mx+'px';curRef.current.style.top=my+'px'}
    }
    const loop=()=>{
      rx+=(mx-rx)*.1;ry+=(my-ry)*.1
      if(ringRef.current){ringRef.current.style.left=rx+'px';ringRef.current.style.top=ry+'px'}
      requestAnimationFrame(loop)
    }
    document.addEventListener('mousemove',move);loop()
    const big=()=>{ if(curRef.current){curRef.current.style.width='22px';curRef.current.style.height='22px';curRef.current.style.background='var(--blue)'} if(ringRef.current){ringRef.current.style.width='60px';ringRef.current.style.height='60px'} }
    const small=()=>{ if(curRef.current){curRef.current.style.width='16px';curRef.current.style.height='16px';curRef.current.style.background='var(--orange)'} if(ringRef.current){ringRef.current.style.width='48px';ringRef.current.style.height='48px'} }
    const add=()=>document.querySelectorAll('button,a,.card-hover,input,select').forEach(el=>{el.addEventListener('mouseenter',big);el.addEventListener('mouseleave',small)})
    add()
    const obs=new MutationObserver(add);obs.observe(document.body,{childList:true,subtree:true})
    return()=>{document.removeEventListener('mousemove',move);obs.disconnect()}
  },[isAdmin])

  if (isAdmin) return null
  return(<><div ref={curRef} className="cursor"/><div ref={ringRef} className="cursor-ring"/></>)
}
