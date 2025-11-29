'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Bed, Bath, Square, Eye } from 'lucide-react'
import { Property } from '@/lib/types'
import { formatPrice, formatArea, getMainImage, cn, getStatusColor, getStatusLabel } from '@/lib/utils'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface PropertyCardProps {
  property: Property
  onFavoriteChange?: (propertyId: string, isFavorited: boolean) => void
  isFavorited?: boolean
}

export default function PropertyCard({ property, onFavoriteChange, isFavorited = false }: PropertyCardProps) {
  const [favorited, setFavorited] = useState(isFavorited)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Please login to save favorites')
      return
    }

    setLoading(true)
    try {
      if (favorited) {
        await api.delete(`/favorites/${property._id}`)
        toast.success('Removed from favorites')
      } else {
        await api.post(`/favorites/${property._id}`)
        toast.success('Added to favorites')
      }
      setFavorited(!favorited)
      onFavoriteChange?.(property._id, !favorited)
    } catch (error) {
      toast.error('Failed to update favorites')
    } finally {
      setLoading(false)
    }
  }

  const mainImage = getMainImage(property.images)

  return (
    <Link href={`/properties/${property.slug || property._id}`}>
      <div className="card-hover group">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={cn(
              "badge",
              property.listingType === 'sale' ? 'bg-primary-600 text-white' : 'bg-amber-500 text-white'
            )}>
              {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
            </span>
            {property.isFeatured && (
              <span className="badge bg-green-600 text-white">Featured</span>
            )}
          </div>

          {/* Status Badge - Show when property is sold or rented */}
          {(property.status === 'sold' || property.status === 'rented') && (
            <div className="absolute top-3 right-12">
              <span className={cn("badge", getStatusColor(property.status))}>
                {getStatusLabel(property.status)}
              </span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={loading}
            className={cn(
              "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              favorited 
                ? "bg-red-500 text-white" 
                : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
            )}
          >
            <Heart className={cn("w-4 h-4", favorited && "fill-current")} />
          </button>

          {/* Price */}
          <div className="absolute bottom-3 left-3">
            <p className="text-2xl font-bold text-white">
              {formatPrice(property.price, property.priceUnit)}
            </p>
          </div>

          {/* Views */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 text-white/80 text-sm">
            <Eye className="w-4 h-4" />
            <span>{property.views}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {property.city}, {property.state}
            </span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-gray-400" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4 text-gray-400" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4 text-gray-400" />
              <span>{formatArea(property.area)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
