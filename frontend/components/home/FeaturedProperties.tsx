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
    <section className="section bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="text-primary-600 font-medium mb-2 block">Featured Listings</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Discover Our Best Properties
            </h2>
            <p className="text-gray-600 mt-2 max-w-xl">
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No featured properties available at the moment.
          </div>
        )}
      </div>
    </section>
  )
}
