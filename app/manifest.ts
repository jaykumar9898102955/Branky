import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Branky STEM Labs',
    short_name: 'Branky STEM',
    description: "Vadodara's full-fledged AI, Robotics & Coding learning centre for children aged 4–14.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1D5CE3',
    icons: [
      {
        src: '/assets/app-icon.png',
        sizes: '1500x1500',
        type: 'image/png',
      },
    ],
  }
}
