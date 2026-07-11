import type { Metadata } from 'next'
// @ts-ignore: Allow side-effect CSS import without type declarations
import './globals.css'
import ClientShell from '@/components/ui/ClientShell'
import { programs } from '@/lib/programs-data'

const siteUrl = 'https://brankystemlab.com'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Branky STEM Labs',
      publisher: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': ['EducationalOrganization', 'LocalBusiness'],
      '@id': `${siteUrl}/#organization`,
      name: 'Branky STEM Labs',
      url: siteUrl,
      logo: `${siteUrl}/assets/logo-15.png`,
      image: `${siteUrl}/assets/brand-banner.png`,
      description: "Vadodara's full-fledged AI, Robotics & Coding learning centre for children aged 4–14. Hands-on programs, smart labs, expert mentors.",
      telephone: '+919104401104',
      email: 'brankystemlab@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'A-5, Shivangi Society, Opp. Time Square, Ashwamegh Nagar, Tandalja',
        addressLocality: 'Vadodara',
        addressRegion: 'Gujarat',
        postalCode: '390020',
        addressCountry: 'IN',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '17:00',
        closes: '19:00',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'AI, Robotics & Coding Programs',
        itemListElement: programs.map(p => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Course',
            name: `${p.title} (${p.age})`,
            url: `${siteUrl}/programs/${p.slug}`,
            provider: { '@id': `${siteUrl}/#organization` },
          },
        })),
      },
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://brankystemlab.com'),
  title: 'Branky STEM Labs — AI, Robotics & Coding for Kids | Vadodara',
  description: "Vadodara's full-fledged AI, Robotics & Coding learning centre for children aged 4–14. Hands-on programs, smart labs, expert mentors.",
  icons: { icon: '/assets/app-icon.png', apple: '/assets/app-icon.png' },
  openGraph: {
    siteName: 'Branky STEM Labs',
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/assets/brand-banner.png', width: 1200, height: 630, alt: 'Branky STEM Labs — AI, Robotics & Coding for Kids in Vadodara' }],
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
        <link href="https://fonts.googleapis.com/css2?family=Karla:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.cdnfonts.com/css/neue-power" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/assets/app-icon.png" />
        <link rel="apple-touch-icon" href="/assets/app-icon.png" />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  )
}
