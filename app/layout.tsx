import type { Metadata } from 'next'
import './globals.css'
import ClientShell from '@/components/ui/ClientShell'

export const metadata: Metadata = {
  metadataBase: new URL('https://brankystemlab.com'),
  title: 'Branky STEM Labs — AI, Robotics & Coding for Kids | Vadodara',
  description: "Vadodara's full-fledged AI, Robotics & Coding learning centre for children aged 4–14. Hands-on programs, smart labs, expert mentors.",
  keywords: 'STEM, robotics, coding, AI, kids, Vadodara, Branky, learning centre, ages 4-14, IoT, electronics',
  icons: { icon: '/assets/app-icon.png', apple: '/assets/app-icon.png' },
  openGraph: {
    siteName: 'Branky STEM Labs',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/assets/brand-banner.png', alt: 'Branky STEM Labs' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/brand-banner.png'],
  },
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
      <body>
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  )
}
