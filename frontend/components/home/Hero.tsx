'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, MapPin, Home, Building2, ChevronDown } from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/types'

export default function Hero() {
  const router = useRouter()
  const [searchType, setSearchType] = useState<'sale' | 'rent'>('sale')
  const [location, setLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    params.set('listingType', searchType)
    if (location) params.set('city', location)
    if (propertyType) params.set('propertyType', propertyType)
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt="Luxury home"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white/90 text-sm">
              Over 10,000+ properties available
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <span className="block text-primary-400">Dream Home</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-white/80 mb-8 max-w-xl">
            Discover the best properties in prime locations. Whether you're looking to buy or rent, 
            we have the perfect home waiting for you.
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-2xl p-2 shadow-2xl">
            {/* Tabs */}
            <div className="flex gap-2 mb-4 p-1">
              <button
                onClick={() => setSearchType('sale')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  searchType === 'sale'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                Buy
              </button>
              <button
                onClick={() => setSearchType('rent')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  searchType === 'rent'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Rent
              </button>
            </div>

            {/* Search Fields */}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 p-2">
              {/* Location */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter location, city, or ZIP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Property Type */}
              <div className="relative md:w-48">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full appearance-none pl-12 pr-10 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="btn-primary py-4 px-8 text-base"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </form>
          </div>

          {/* Popular Searches */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-white/60 text-sm">Popular:</span>
            {['New York', 'Los Angeles', 'Miami', 'Chicago'].map((city) => (
              <button
                key={city}
                onClick={() => router.push(`/properties?city=${city}`)}
                className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm hover:bg-white/20 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
