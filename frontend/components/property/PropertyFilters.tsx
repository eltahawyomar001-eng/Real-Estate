'use client'

import { PROPERTY_TYPES, LISTING_TYPES, AMENITIES, PropertyFilters as FilterType } from '@/lib/types'
import { X } from 'lucide-react'

interface PropertyFiltersProps {
  filters: FilterType
  onChange: (filters: FilterType) => void
  onClear: () => void
}

export default function PropertyFilters({ filters, onChange, onClear }: PropertyFiltersProps) {
  const handleChange = (key: keyof FilterType, value: any) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button onClick={onClear} className="text-sm text-primary-600 hover:underline">
          Clear All
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="label">Search</label>
        <input
          type="text"
          placeholder="Search properties..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="input"
        />
      </div>

      {/* Listing Type */}
      <div>
        <label className="label">Listing Type</label>
        <div className="flex gap-2">
          {LISTING_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => handleChange('listingType', filters.listingType === type.value ? '' : type.value)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filters.listingType === type.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="label">Property Type</label>
        <select
          value={filters.propertyType || ''}
          onChange={(e) => handleChange('propertyType', e.target.value)}
          className="input"
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="label">City</label>
        <input
          type="text"
          placeholder="Enter city..."
          value={filters.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
          className="input"
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="label">Price Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="input"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="input"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="label">Bedrooms</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => handleChange('bedrooms', filters.bedrooms === num ? undefined : num)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                filters.bedrooms === num
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="label">Bathrooms</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => handleChange('bathrooms', filters.bathrooms === num ? undefined : num)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                filters.bathrooms === num
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num}+
            </button>
          ))}
        </div>
      </div>

      {/* Featured Only */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          checked={filters.featured || false}
          onChange={(e) => handleChange('featured', e.target.checked)}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
          Featured properties only
        </label>
      </div>
    </div>
  )
}
