'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  Mail,
  Building,
  Car,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Property, User } from '@/lib/types'
import api from '@/lib/api'
import { formatPrice, formatDate, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${params.slug}`)
        setProperty(data.data)
        
        // Check if favorited
        if (isAuthenticated) {
          const { data: favData } = await api.get('/favorites')
          const favIds = favData.data.map((f: any) => f.property._id)
          setIsFavorite(favIds.includes(data.data._id))
        }
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Property not found')
        router.push('/properties')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchProperty()
    }
  }, [params.slug, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setInquiryForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites')
      router.push('/login')
      return
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/${property?._id}`)
        setIsFavorite(false)
        toast.success('Removed from favorites')
      } else {
        await api.post('/favorites', { propertyId: property?._id })
        setIsFavorite(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error('Failed to update favorites')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/inquiries', {
        property: property?._id,
        ...inquiryForm
      })
      toast.success('Inquiry sent successfully!')
      setInquiryForm(prev => ({ ...prev, message: '' }))
    } catch (error) {
      toast.error('Failed to send inquiry')
    } finally {
      setSubmitting(false)
    }
  }

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!property) {
    return null
  }

  const agent = property.agent as User

  return (
    <main className="pt-20">
      {/* Image Gallery */}
      <section className="relative h-[60vh] bg-gray-900">
        <div className="relative h-full">
          {property.images && property.images.length > 0 ? (
            <Image
              src={property.images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover cursor-pointer"
              onClick={() => setShowImageModal(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <Building className="w-20 h-20 text-gray-400" />
            </div>
          )}

          {/* Navigation Arrows */}
          {property.images && property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={cn(
              'px-4 py-2 rounded-full text-sm font-semibold text-white',
              property.status === 'for-sale' ? 'bg-green-600' : 'bg-blue-600'
            )}>
              {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
            </span>
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleFavorite}
              className={cn(
                'p-3 rounded-full shadow-lg transition-colors',
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
              )}
            >
              <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg">
            {property.images.slice(0, 5).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={cn(
                  'w-16 h-12 rounded overflow-hidden border-2 transition-colors',
                  currentImageIndex === idx ? 'border-white' : 'border-transparent'
                )}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  width={64}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
            {property.images.length > 5 && (
              <button
                onClick={() => setShowImageModal(true)}
                className="w-16 h-12 rounded bg-black/50 text-white text-sm font-medium flex items-center justify-center"
              >
                +{property.images.length - 5}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <span>{property.address}, {property.city}, {property.state}</span>
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <span className="text-3xl font-bold text-primary-600">
                    {formatPrice(property.price)}
                    {property.status === 'for-rent' && <span className="text-lg font-normal">/mo</span>}
                  </span>
                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5" />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5" />
                      <span>{property.area.toLocaleString()} sqft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>

              {/* Details */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium capitalize">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium capitalize">{property.status.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Bedrooms</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Area</span>
                    <span className="font-medium">{property.area.toLocaleString()} sqft</span>
                  </div>
                  {property.yearBuilt && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Year Built</span>
                      <span className="font-medium">{property.yearBuilt}</span>
                    </div>
                  )}
                  {property.parking !== undefined && (
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">Parking</span>
                      <span className="font-medium">{property.parking} Spaces</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Listed</span>
                    <span className="font-medium">{formatDate(property.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Features & Amenities */}
              {property.features && property.features.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {property.location?.coordinates && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-200">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${property.location.coordinates[1]},${property.location.coordinates[0]}&zoom=15`}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent Card */}
              {agent && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Listed By</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      {agent.avatar ? (
                        <Image
                          src={agent.avatar}
                          alt={agent.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 text-xl font-bold">
                          {agent.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{agent.role}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-primary-600"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{agent.phone || 'Not available'}</span>
                    </a>
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-3 text-gray-600 hover:text-primary-600"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="truncate">{agent.email}</span>
                    </a>
                  </div>

                  {/* Inquiry Form */}
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Send Inquiry</h4>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, name: e.target.value }))}
                      className="input"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email *"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                      className="input"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Your Phone"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="input"
                    />
                    <textarea
                      placeholder="Your Message *"
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={4}
                      className="input resize-none"
                      required
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        'Send Inquiry'
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {showImageModal && property.images && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          
          <div className="max-w-5xl max-h-[80vh] relative">
            <Image
              src={property.images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              width={1200}
              height={800}
              className="max-h-[80vh] object-contain"
            />
          </div>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {currentImageIndex + 1} / {property.images.length}
          </div>
        </div>
      )}
    </main>
  )
}
