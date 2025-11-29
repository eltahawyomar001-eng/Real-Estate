import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, unit?: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

  const formattedPrice = formatter.format(price)

  if (unit === 'monthly') {
    return `${formattedPrice}/mo`
  } else if (unit === 'yearly') {
    return `${formattedPrice}/yr`
  } else if (unit === 'sqft') {
    return `${formattedPrice}/sqft`
  }

  return formattedPrice
}

export function formatArea(area: number): string {
  return `${area.toLocaleString()} sqft`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatRelativeDate(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  
  return formatDate(date)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getPropertyTypeLabel(type: string): string {
  const types: Record<string, string> = {
    house: 'House',
    apartment: 'Apartment',
    condo: 'Condo',
    townhouse: 'Townhouse',
    villa: 'Villa',
    land: 'Land',
    commercial: 'Commercial',
    office: 'Office'
  }
  return types[type] || type
}

export function getListingTypeLabel(type: string): string {
  return type === 'sale' ? 'For Sale' : 'For Rent'
}

export function getStatusLabel(status: string): string {
  const statuses: Record<string, string> = {
    available: 'Available',
    pending: 'Pending',
    sold: 'Sold',
    rented: 'Rented'
  }
  return statuses[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    available: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    sold: 'bg-blue-100 text-blue-800',
    rented: 'bg-purple-100 text-purple-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getAmenityLabel(amenity: string): string {
  return amenity
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        searchParams.set(key, value.join(','))
      } else {
        searchParams.set(key, String(value))
      }
    }
  })

  return searchParams.toString()
}

export function parseQueryString(queryString: string): Record<string, string> {
  const params: Record<string, string> = {}
  const searchParams = new URLSearchParams(queryString)
  
  searchParams.forEach((value, key) => {
    params[key] = value
  })

  return params
}

export function getMainImage(images: string[] | { url: string; isMain?: boolean }[]): string {
  if (!images || images.length === 0) {
    return '/placeholder-property.jpg'
  }
  
  // Handle simple string array
  if (typeof images[0] === 'string') {
    return images[0] as string
  }
  
  // Handle object array with url and isMain properties
  const typedImages = images as { url: string; isMain?: boolean }[]
  const mainImage = typedImages.find(img => img.isMain)
  return mainImage?.url || typedImages[0].url
}

export function generatePropertyUrl(property: { slug: string; _id: string }): string {
  return `/properties/${property.slug || property._id}`
}
