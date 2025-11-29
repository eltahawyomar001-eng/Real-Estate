import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: {
    default: 'RealEstate Pro | Find Your Dream Property',
    template: '%s | RealEstate Pro'
  },
  description: 'Discover your perfect home with RealEstate Pro. Browse thousands of properties for sale and rent. Find houses, apartments, condos, and more.',
  keywords: ['real estate', 'property', 'homes for sale', 'apartments for rent', 'houses', 'condos', 'real estate listings'],
  authors: [{ name: 'RealEstate Pro' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'RealEstate Pro',
    title: 'RealEstate Pro | Find Your Dream Property',
    description: 'Discover your perfect home with RealEstate Pro. Browse thousands of properties for sale and rent.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RealEstate Pro'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealEstate Pro | Find Your Dream Property',
    description: 'Discover your perfect home with RealEstate Pro.',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
