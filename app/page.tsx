import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import TrustBarSection from '@/components/sections/TrustBarSection'
import TickerSection from '@/components/sections/TickerSection'
import TeachAndJoinSection from '@/components/sections/TeachAndJoinSection'
import ProgramsSection from '@/components/sections/ProgramsSection'
import FreeDemoStrip from '@/components/sections/FreeDemoStrip'
import FacilitySection from '@/components/sections/FacilitySection'

export const metadata: Metadata = {
  title: 'Branky STEM Labs — AI, Robotics & Coding for Kids | Vadodara',
  description: "Vadodara's full-fledged AI, Robotics & Coding learning centre for children aged 4–14. Hands-on programs, smart labs, expert mentors.",
  alternates: { canonical: 'https://brankystemlab.com' },
  openGraph: {
    title: 'Branky STEM Labs — AI, Robotics & Coding for Kids | Vadodara',
    description: "Vadodara's full-fledged AI, Robotics & Coding learning centre for children aged 4–14. Hands-on programs, smart labs, expert mentors.",
    url: '/',
    images: [{ url: '/assets/brand-banner.png', width: 1200, height: 630, alt: 'Branky STEM Labs — AI, Robotics & Coding for Kids in Vadodara' }],
  },
  twitter: {
    title: 'Branky STEM Labs — AI, Robotics & Coding for Kids | Vadodara',
    description: "Vadodara's full-fledged AI, Robotics & Coding learning centre for children aged 4–14. Hands-on programs, smart labs, expert mentors.",
    images: ['/assets/brand-banner.png'],
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['EducationalOrganization', 'LocalBusiness'],
  name: 'Branky STEM Labs',
  url: 'https://brankystemlab.com',
  logo: 'https://brankystemlab.com/assets/logo-main.png',
  image: 'https://brankystemlab.com/assets/brand-banner.png',
  description: "Vadodara's AI, Robotics & Coding learning centre for children aged 4–14. Hands-on programs, smart labs, expert mentors.",
  telephone: ['+919104401104', '+917567878715'],
  email: 'brankystemlab@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'A-5, Shivangi Society, Opp. Time Square, Ashwamegh Nagar, Tandalja',
    addressLocality: 'Vadodara',
    addressRegion: 'Gujarat',
    postalCode: '390020',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 22.3043,
    longitude: 73.1585,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, UPI, Bank Transfer',
  areaServed: { '@type': 'City', name: 'Vadodara' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'STEM Programs for Kids',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'STEM Foundations Program', url: 'https://brankystemlab.com/programs/stem-foundations' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Foundation of Robotics – Level 1', url: 'https://brankystemlab.com/programs/foundation-of-robotics' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Advanced Robotics – Level 2', url: 'https://brankystemlab.com/programs/advanced-robotics-level-2' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Core Robotics & Coding Program', url: 'https://brankystemlab.com/programs/core-robotics-coding' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Advanced Robotics, IoT & Smart Machines', url: 'https://brankystemlab.com/programs/advanced-robotics-iot' } },
    ],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://brankystemlab.com' },
  ],
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />
      <main>
        <HeroSection />
        <TrustBarSection />
        <TickerSection />
        <TeachAndJoinSection />
        <ProgramsSection />
        <FreeDemoStrip />
        <FacilitySection />
      </main>
      <Footer />
    </>
  )
}
