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
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Agents</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Meet our team of experienced real estate professionals ready to help you find your perfect property.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-12"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No agents found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search' : 'No agents available at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredAgents.map((agent) => (
                <div key={agent._id} className="bg-white rounded-xl shadow-sm border overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative h-64 bg-gray-200">
                    {agent.avatar ? (
                      <Image
                        src={agent.avatar}
                        alt={agent.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-100">
                        <span className="text-6xl font-bold text-primary-600">
                          {agent.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{agent.name}</h3>
                    <p className="text-primary-600 font-medium mb-4">Real Estate Agent</p>
                    
                    <div className="space-y-2 mb-4">
                      {agent.phone && (
                        <a 
                          href={`tel:${agent.phone}`}
                          className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{agent.phone}</span>
                        </a>
                      )}
                      <a 
                        href={`mailto:${agent.email}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="text-sm truncate">{agent.email}</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Building className="w-4 h-4" />
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
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want to Join Our Team?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented real estate professionals to join our growing team.
          </p>
          <Link href="/contact" className="btn-primary inline-flex">
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  )
}
