'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import PropertyCard from '@/components/property/PropertyCard'
import { Property } from '@/lib/types'
import api from '@/lib/api'

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProperties()
  }, [])

  const fetchFeaturedProperties = async () => {
    try {
      const response = await api.get('/properties/featured?limit=6')
      setProperties(response.data.data)
    } catch (error) {
      console.error('Failed to fetch featured properties:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3 block">Featured Listings</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Discover Our Best Properties
            </h2>
            <p className="text-gray-600 mt-4 max-w-xl text-lg">
              Handpicked properties that offer the best value and features for you.
            </p>
          </div>
          <Link 
            href="/properties" 
            className="btn-outline self-start md:self-auto"
          >
            View All Properties
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-500 text-lg">
            No featured properties available at the moment.
          </div>
        )}
      </div>
    </section>
  )
}
