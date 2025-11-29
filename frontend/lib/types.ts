export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'user' | 'agent' | 'admin'
  company?: string
  bio?: string
  address?: Address
  socialLinks?: SocialLinks
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Address {
  street?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

export interface SocialLinks {
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
}

export interface PropertyImage {
  url: string
  public_id?: string
  caption?: string
  isMain?: boolean
}

export interface PropertyFeatures {
  bedrooms: number
  bathrooms: number
  area: number
  yearBuilt?: number
  parking?: number
  floors?: number
}

export interface PropertyLocation {
  type: 'Point'
  coordinates: [number, number]
  formattedAddress?: string
}

export interface Property {
  _id: string
  title: string
  slug: string
  description: string
  propertyType: 'house' | 'apartment' | 'condo' | 'townhouse' | 'villa' | 'land' | 'commercial' | 'office'
  listingType: 'sale' | 'rent'
  status: 'available' | 'pending' | 'sold' | 'rented'
  price: number
  priceUnit: 'total' | 'monthly' | 'yearly' | 'sqft'
  address: Address & { street: string; city: string; state: string; zipCode: string }
  location?: PropertyLocation
  features: PropertyFeatures
  amenities: string[]
  images: PropertyImage[]
  virtualTour?: string
  video?: string
  agent: User
  isFeatured: boolean
  views: number
  publishedAt: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Inquiry {
  _id: string
  property: Property
  user?: User
  name: string
  email: string
  phone: string
  message: string
  inquiryType: 'general' | 'viewing' | 'offer' | 'question'
  preferredContactMethod: 'email' | 'phone' | 'both'
  preferredContactTime: 'morning' | 'afternoon' | 'evening' | 'anytime'
  status: 'new' | 'read' | 'responded' | 'closed'
  response?: {
    message: string
    respondedAt: string
    respondedBy: User
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Favorite {
  _id: string
  user: string
  property: Property
  createdAt: string
}

export interface PaginatedResponse<T> {
  success: boolean
  count: number
  total: number
  totalPages: number
  currentPage: number
  data: T[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PropertyFilters {
  propertyType?: string
  listingType?: string
  status?: string
  city?: string
  state?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  minArea?: number
  maxArea?: number
  amenities?: string[]
  featured?: boolean
  search?: string
  sort?: string
  page?: number
  limit?: number
}

export interface DashboardStats {
  counts: {
    totalProperties: number
    totalUsers: number
    totalAgents: number
    totalInquiries: number
    newInquiries: number
  }
  propertiesByStatus: { _id: string; count: number }[]
  propertiesByType: { _id: string; count: number }[]
  propertiesByListing: { _id: string; count: number }[]
  recentProperties: Property[]
  recentInquiries: Inquiry[]
  topCities: { _id: string; count: number }[]
  priceStats: {
    avgPrice: number
    minPrice: number
    maxPrice: number
  }
}

export interface AgentStats {
  counts: {
    totalProperties: number
    activeListings: number
    soldProperties: number
    rentedProperties: number
    totalInquiries: number
    newInquiries: number
    totalViews: number
  }
  propertiesByStatus: { _id: string; count: number }[]
  recentInquiries: Inquiry[]
  topProperties: Property[]
}

export const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'villa', label: 'Villa' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'office', label: 'Office' }
]

export const LISTING_TYPES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' }
]

export const PROPERTY_STATUSES = [
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' }
]

export const AMENITIES = [
  { value: 'air-conditioning', label: 'Air Conditioning' },
  { value: 'heating', label: 'Heating' },
  { value: 'washer-dryer', label: 'Washer/Dryer' },
  { value: 'dishwasher', label: 'Dishwasher' },
  { value: 'pool', label: 'Pool' },
  { value: 'gym', label: 'Gym' },
  { value: 'security', label: 'Security' },
  { value: 'elevator', label: 'Elevator' },
  { value: 'balcony', label: 'Balcony' },
  { value: 'garden', label: 'Garden' },
  { value: 'garage', label: 'Garage' },
  { value: 'fireplace', label: 'Fireplace' },
  { value: 'hardwood-floors', label: 'Hardwood Floors' },
  { value: 'pet-friendly', label: 'Pet Friendly' },
  { value: 'furnished', label: 'Furnished' },
  { value: 'waterfront', label: 'Waterfront' },
  { value: 'mountain-view', label: 'Mountain View' },
  { value: 'city-view', label: 'City View' },
  { value: 'smart-home', label: 'Smart Home' },
  { value: 'solar-panels', label: 'Solar Panels' },
  { value: 'storage', label: 'Storage' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'doorman', label: 'Doorman' },
  { value: 'rooftop', label: 'Rooftop' }
]
