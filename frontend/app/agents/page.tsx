'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, Building, Loader2, Search } from 'lucide-react'
import api from '@/lib/api'
import { User } from '@/lib/types'

export default function AgentsPage() {
  const [agents, setAgents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const { data } = await api.get('/users/agents')
      setAgents(data.data)
    } catch (error) {
      console.error('Error fetching agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="page-header">
        <div className="container-custom text-center">
          <h1 className="page-header-title">Our Agents</h1>
          <p className="page-header-subtitle">
            Meet our team of experienced real estate professionals ready to help you find your perfect property.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-lg mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-14 py-4 text-base shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-20">
              <Building className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No agents found</h3>
              <p className="text-gray-600 text-lg">
                {searchQuery ? 'Try adjusting your search' : 'No agents available at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAgents.map((agent) => (
                <div key={agent._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-72 bg-gray-200">
                    {agent.avatar ? (
                      <Image
                        src={agent.avatar}
                        alt={agent.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                        <span className="text-7xl font-bold text-primary-600">
                          {agent.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h3>
                    <p className="text-primary-600 font-semibold mb-5">Real Estate Agent</p>
                    
                    <div className="space-y-3 mb-5">
                      {agent.phone && (
                        <a 
                          href={`tel:${agent.phone}`}
                          className="flex items-center gap-3 text-gray-600 hover:text-primary-600 transition-colors"
                        >
                          <Phone className="w-5 h-5" />
                          <span>{agent.phone}</span>
                        </a>
                      )}
                      <a 
                        href={`mailto:${agent.email}`}
                        className="flex items-center gap-3 text-gray-600 hover:text-primary-600 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        <span className="truncate">{agent.email}</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 mb-6 pb-6 border-b">
                      <Building className="w-5 h-5" />
                      <span>{(agent as any).propertyCount || 0} Properties</span>
                    </div>

                    <Link 
                      href={`/properties?agent=${agent._id}`}
                      className="btn-primary w-full text-center"
                    >
                      View Listings
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Want to Join Our Team?
          </h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            We're always looking for talented real estate professionals to join our growing team.
          </p>
          <Link href="/contact" className="btn-primary btn-lg inline-flex">
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  )
}
