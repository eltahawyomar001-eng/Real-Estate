'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Building, 
  Users, 
  MessageSquare, 
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  DollarSign,
  Calendar
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'

interface DashboardStats {
  totalProperties: number
  totalUsers: number
  totalInquiries: number
  totalViews: number
  recentInquiries: any[]
  recentProperties: any[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'admin'
  const isAgent = user?.role === 'agent'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats/dashboard')
        setStats(data.data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin || isAgent) {
      fetchStats()
    } else {
      setLoading(false)
    }
  }, [isAdmin, isAgent])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your properties today.</p>
      </div>

      {/* Stats Cards */}
      {(isAdmin || isAgent) && stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={Building}
            trend="+12%"
            trendUp={true}
            href="/dashboard/properties"
          />
          {isAdmin && (
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              trend="+8%"
              trendUp={true}
              href="/dashboard/users"
            />
          )}
          <StatCard
            title="Inquiries"
            value={stats.totalInquiries}
            icon={MessageSquare}
            trend="+23%"
            trendUp={true}
            href="/dashboard/inquiries"
          />
          <StatCard
            title="Property Views"
            value={stats.totalViews}
            icon={Eye}
            trend="+15%"
            trendUp={true}
          />
        </div>
      )}

      {/* Quick Actions */}
      {(isAgent || isAdmin) && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/dashboard/properties/new"
              className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add New Property</p>
                <p className="text-sm text-gray-500">List a new property</p>
              </div>
            </Link>
            <Link
              href="/dashboard/inquiries"
              className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Inquiries</p>
                <p className="text-sm text-gray-500">Check new messages</p>
              </div>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Update Profile</p>
                <p className="text-sm text-gray-500">Manage your account</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* User Dashboard */}
      {!isAgent && !isAdmin && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Saved Properties</h2>
            <p className="text-gray-600 mb-4">View and manage your saved properties.</p>
            <Link 
              href="/dashboard/favorites"
              className="btn-primary inline-flex"
            >
              View Saved Properties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse Properties</h2>
            <p className="text-gray-600 mb-4">Find your dream home from our listings.</p>
            <Link 
              href="/properties"
              className="btn-secondary inline-flex"
            >
              Browse Properties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {(isAdmin || isAgent) && stats && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Properties */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Properties</h2>
              <Link href="/dashboard/properties" className="text-sm text-primary-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentProperties?.length > 0 ? (
                stats.recentProperties.slice(0, 5).map((property: any) => (
                  <div key={property._id} className="flex items-center gap-4">
                    <div className="w-16 h-12 rounded-lg bg-gray-200 overflow-hidden">
                      {property.images?.[0] && (
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{property.title}</p>
                      <p className="text-sm text-gray-500">{formatPrice(property.price)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      property.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {property.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No properties yet</p>
              )}
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
              <Link href="/dashboard/inquiries" className="text-sm text-primary-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {stats.recentInquiries?.length > 0 ? (
                stats.recentInquiries.slice(0, 5).map((inquiry: any) => (
                  <div key={inquiry._id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {inquiry.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{inquiry.name}</p>
                      <p className="text-sm text-gray-500 truncate">{inquiry.message}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      inquiry.status === 'new' 
                        ? 'bg-blue-100 text-blue-700' 
                        : inquiry.status === 'contacted'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No inquiries yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: any
  trend?: string
  trendUp?: boolean
  href?: string
}

function StatCard({ title, value, icon: Icon, trend, trendUp, href }: StatCardProps) {
  const content = (
    <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
