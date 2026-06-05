'use client'
import Cursor from '@/components/ui/Cursor'
import { FaWhatsapp } from 'react-icons/fa'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Cursor />
      {children}
      <a
        href="https://wa.me/919104401104"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#FF931E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(255,147,30,0.45)',
          zIndex: 9999,
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <FaWhatsapp size={30} color="white" />
      </a>
    </>
  )
}
