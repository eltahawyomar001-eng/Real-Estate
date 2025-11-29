import { Metadata } from 'next'
import Image from 'next/image'
import { 
  Building, 
  Users, 
  Award, 
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | RealEstate Pro',
  description: 'Learn more about RealEstate Pro - Your trusted partner in finding the perfect property.'
}

const stats = [
  { icon: Building, value: '10,000+', label: 'Properties Sold' },
  { icon: Users, value: '5,000+', label: 'Happy Clients' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: TrendingUp, value: '99%', label: 'Client Satisfaction' }
]

const values = [
  {
    title: 'Trust & Transparency',
    description: 'We believe in honest and open communication with our clients at every step of the process.'
  },
  {
    title: 'Client-First Approach',
    description: 'Your goals and dreams are our priority. We work tirelessly to exceed your expectations.'
  },
  {
    title: 'Market Expertise',
    description: 'Our deep knowledge of local markets helps you make informed decisions.'
  },
  {
    title: 'Innovation',
    description: 'We leverage the latest technology to provide you with the best property search experience.'
  }
]

const team = [
  {
    name: 'John Smith',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop'
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Sales',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop'
  },
  {
    name: 'Michael Chen',
    role: 'Lead Agent',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop'
  },
  {
    name: 'Emily Davis',
    role: 'Property Manager',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop'
  }
]

export default function AboutPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-gray-900">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=800&fit=crop"
          alt="About RealEstate Pro"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">About Us</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl">
              Your trusted partner in finding the perfect property since 2008
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <stat.icon className="w-12 h-12 mx-auto mb-4 opacity-80" />
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2008, RealEstate Pro started with a simple mission: to help people find their perfect home with ease and confidence. What began as a small team of passionate real estate professionals has grown into one of the most trusted names in the industry.
                </p>
                <p>
                  Over the years, we've helped thousands of families and individuals find their dream properties, from cozy apartments to luxurious estates. Our success is built on a foundation of trust, expertise, and an unwavering commitment to our clients' satisfaction.
                </p>
                <p>
                  Today, we continue to innovate and adapt to the ever-changing real estate landscape, leveraging cutting-edge technology while maintaining the personal touch that has always defined our service.
                </p>
              </div>
              <Link href="/contact" className="btn-primary inline-flex mt-8">
                Get in Touch
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=1000&fit=crop"
                alt="Our office"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600">
              These core principles guide everything we do and define who we are as a company.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <CheckCircle className="w-10 h-10 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600">
              Our dedicated team of professionals is here to help you achieve your real estate goals.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who found their perfect home with RealEstate Pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Browse Properties
            </Link>
            <Link href="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
