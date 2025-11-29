'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Eye, Check, X, Loader2, Mail, Phone, Calendar } from 'lucide-react'
import api from '@/lib/api'
import { formatDate, cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Inquiry {
  _id: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'new' | 'contacted' | 'closed'
  property: {
    _id: string
    title: string
    slug: string
  }
  createdAt: string
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchInquiries()
  }, [statusFilter])

  const fetchInquiries = async () => {
    try {
      const params: any = {}
      if (statusFilter) params.status = statusFilter

      const { data } = await api.get('/inquiries', { params })
      setInquiries(data.data)
    } catch (error) {
      console.error('Error fetching inquiries:', error)
      toast.error('Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/inquiries/${id}`, { status })
      setInquiries(inquiries.map(i => 
        i._id === id ? { ...i, status: status as Inquiry['status'] } : i
      ))
      if (selectedInquiry?._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: status as Inquiry['status'] })
      }
      toast.success('Status updated')
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700'
      case 'contacted': return 'bg-yellow-100 text-yellow-700'
      case 'closed': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
          <p className="text-gray-600 mt-1">Manage property inquiries from potential clients</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-full sm:w-48"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
          <p className="text-gray-600">When clients send inquiries, they'll appear here</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Inquiries List */}
          <div className="lg:col-span-1 space-y-4">
            {inquiries.map((inquiry) => (
              <button
                key={inquiry._id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={cn(
                  'w-full text-left bg-white rounded-xl border p-4 hover:border-primary-500 transition-colors',
                  selectedInquiry?._id === inquiry._id && 'border-primary-500 ring-1 ring-primary-500'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{inquiry.name}</h4>
                    <p className="text-sm text-gray-500 truncate">{inquiry.property.title}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${getStatusColor(inquiry.status)}`}>
                    {inquiry.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{inquiry.message}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDate(inquiry.createdAt)}</p>
              </button>
            ))}
          </div>

          {/* Inquiry Detail */}
          <div className="lg:col-span-2">
            {selectedInquiry ? (
              <div className="bg-white rounded-xl border p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedInquiry.name}</h2>
                    <p className="text-gray-500">Inquiry for: {selectedInquiry.property.title}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInquiry.status)}`}>
                    {selectedInquiry.status}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a href={`mailto:${selectedInquiry.email}`} className="text-primary-600 hover:underline">
                      {selectedInquiry.email}
                    </a>
                  </div>
                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <a href={`tel:${selectedInquiry.phone}`} className="text-primary-600 hover:underline">
                        {selectedInquiry.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{formatDate(selectedInquiry.createdAt)}</span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Message</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">Update Status</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selectedInquiry._id, 'new')}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
                        selectedInquiry.status === 'new'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      New
                    </button>
                    <button
                      onClick={() => updateStatus(selectedInquiry._id, 'contacted')}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
                        selectedInquiry.status === 'contacted'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      Contacted
                    </button>
                    <button
                      onClick={() => updateStatus(selectedInquiry._id, 'closed')}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
                        selectedInquiry.status === 'closed'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      Closed
                    </button>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6 flex gap-3">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.property.title}`}
                    className="btn-primary flex-1"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reply via Email
                  </a>
                  {selectedInquiry.phone && (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="btn-secondary flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an inquiry</h3>
                <p className="text-gray-600">Click on an inquiry to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
