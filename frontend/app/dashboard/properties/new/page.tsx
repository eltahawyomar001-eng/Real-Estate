'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Loader2,
  Image as ImageIcon 
} from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  propertyType: z.enum(['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial']),
  status: z.enum(['for-sale', 'for-rent']),
  price: z.number().min(1, 'Price is required'),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  area: z.number().min(1, 'Area is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(4, 'Zip code is required'),
  yearBuilt: z.number().optional(),
  parking: z.number().optional(),
  features: z.array(z.string()).optional()
})

type PropertyFormData = z.infer<typeof propertySchema>

const propertyTypes = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' }
]

const commonFeatures = [
  'Air Conditioning', 'Heating', 'Swimming Pool', 'Gym', 'Garden',
  'Garage', 'Balcony', 'Fireplace', 'Security System', 'Laundry',
  'Dishwasher', 'Pet Friendly', 'Furnished', 'Parking', 'Storage'
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      propertyType: 'house',
      status: 'for-sale',
      bedrooms: 0,
      bathrooms: 0
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    setImages([...images, ...files])
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImagePreview(imagePreview.filter((_, i) => i !== index))
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return []

    setUploadingImages(true)
    const uploadedUrls: string[] = []

    try {
      for (const image of images) {
        const formData = new FormData()
        formData.append('image', image)

        const { data } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        uploadedUrls.push(data.data.url)
      }
      return uploadedUrls
    } catch (error) {
      throw new Error('Failed to upload images')
    } finally {
      setUploadingImages(false)
    }
  }

  const onSubmit = async (data: PropertyFormData) => {
    if (images.length === 0) {
      toast.error('Please add at least one image')
      return
    }

    setLoading(true)
    try {
      // Upload images first
      const imageUrls = await uploadImages()

      // Create property
      await api.post('/properties', {
        ...data,
        images: imageUrls,
        features: selectedFeatures
      })

      toast.success('Property created successfully!')
      router.push('/dashboard/properties')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/dashboard/properties" 
          className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-gray-600 mt-1">Fill in the details to list your property</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Title</label>
              <input
                type="text"
                {...register('title')}
                className={`input ${errors.title ? 'input-error' : ''}`}
                placeholder="e.g., Modern 3-Bedroom House with Pool"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                {...register('description')}
                rows={5}
                className={`input resize-none ${errors.description ? 'input-error' : ''}`}
                placeholder="Describe the property in detail..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="label">Property Type</label>
              <select {...register('propertyType')} className="input">
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Listing Status</label>
              <select {...register('status')} className="input">
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="label">Price ($)</label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className={`input ${errors.price ? 'input-error' : ''}`}
                placeholder="Enter price"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="label">Area (sq ft)</label>
              <input
                type="number"
                {...register('area', { valueAsNumber: true })}
                className={`input ${errors.area ? 'input-error' : ''}`}
                placeholder="Enter area"
              />
              {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>}
            </div>

            <div>
              <label className="label">Bedrooms</label>
              <input
                type="number"
                {...register('bedrooms', { valueAsNumber: true })}
                className="input"
                min="0"
              />
            </div>

            <div>
              <label className="label">Bathrooms</label>
              <input
                type="number"
                {...register('bathrooms', { valueAsNumber: true })}
                className="input"
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <label className="label">Year Built (Optional)</label>
              <input
                type="number"
                {...register('yearBuilt', { valueAsNumber: true })}
                className="input"
                placeholder="e.g., 2020"
              />
            </div>

            <div>
              <label className="label">Parking Spaces (Optional)</label>
              <input
                type="number"
                {...register('parking', { valueAsNumber: true })}
                className="input"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Street Address</label>
              <input
                type="text"
                {...register('address')}
                className={`input ${errors.address ? 'input-error' : ''}`}
                placeholder="Enter street address"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="label">City</label>
              <input
                type="text"
                {...register('city')}
                className={`input ${errors.city ? 'input-error' : ''}`}
                placeholder="Enter city"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="label">State</label>
              <input
                type="text"
                {...register('state')}
                className={`input ${errors.state ? 'input-error' : ''}`}
                placeholder="Enter state"
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
            </div>

            <div>
              <label className="label">Zip Code</label>
              <input
                type="text"
                {...register('zipCode')}
                className={`input ${errors.zipCode ? 'input-error' : ''}`}
                placeholder="Enter zip code"
              />
              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {commonFeatures.map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  selectedFeatures.includes(feature)
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h2>
          <p className="text-gray-600 text-sm mb-4">Upload up to 10 images. The first image will be the main photo.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {imagePreview.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs rounded">
                    Main
                  </span>
                )}
              </div>
            ))}

            {images.length < 10 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Link href="/dashboard/properties" className="btn-secondary flex-1">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="btn-primary flex-1"
          >
            {loading || uploadingImages ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                {uploadingImages ? 'Uploading Images...' : 'Creating Property...'}
              </>
            ) : (
              'Create Property'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
