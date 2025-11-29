'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Trash2, Building, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { Property } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/favorites')
      setFavorites(data.data)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast.error('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (propertyId: string) => {
    try {
      await api.delete(`/favorites/${propertyId}`)
      setFavorites(favorites.filter(f => f.property._id !== propertyId))
      toast.success('Removed from favorites')
    } catch (error) {
      toast.error('Failed to remove from favorites')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
        <p className="text-gray-600 mt-1">Properties you've saved for later</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties</h3>
          <p className="text-gray-600 mb-4">Start saving properties you're interested in</p>
          <Link href="/properties" className="btn-primary inline-flex">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const property = fav.property as Property
            return (
              <div key={fav._id} className="bg-white rounded-xl border overflow-hidden group">
                <div className="relative h-48">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Building className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => handleRemove(property._id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                      property.status === 'for-sale' ? 'bg-green-600' : 'bg-blue-600'
                    }`}>
                      {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/properties/${property.slug}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1">
                      {property.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{property.city}, {property.state}</p>
                  <p className="text-lg font-bold text-primary-600 mt-2">
                    {formatPrice(property.price)}
                    {property.status === 'for-rent' && <span className="text-sm font-normal">/mo</span>}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.area.toLocaleString()} sqft</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
