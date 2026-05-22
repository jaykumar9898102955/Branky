import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Branky S.T.E.M. Labs — 2026 Bootcamp',
  description: "India's most hands-on STEM bootcamp. Robotics, AI, Coding & Engineering for young innovators.",
  keywords: 'STEM, robotics, coding, AI, bootcamp, kids, India, Ahmedabad, Branky',
  icons: { icon: '/assets/app-icon.png', apple: '/assets/app-icon.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/assets/app-icon.png" />
        <link rel="apple-touch-icon" href="/assets/app-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
