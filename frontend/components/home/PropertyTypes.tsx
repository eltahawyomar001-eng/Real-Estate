import Link from 'next/link'
import Image from 'next/image'
import { Home, Building2, Building, Castle, Warehouse, LandPlot } from 'lucide-react'

const propertyTypes = [
  {
    name: 'Houses',
    icon: Home,
    count: 1250,
    href: '/properties?propertyType=house',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
  },
  {
    name: 'Apartments',
    icon: Building2,
    count: 890,
    href: '/properties?propertyType=apartment',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
  },
  {
    name: 'Condos',
    icon: Building,
    count: 650,
    href: '/properties?propertyType=condo',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
  },
  {
    name: 'Villas',
    icon: Castle,
    count: 320,
    href: '/properties?propertyType=villa',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'
  },
  {
    name: 'Commercial',
    icon: Warehouse,
    count: 450,
    href: '/properties?propertyType=commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
  },
  {
    name: 'Land',
    icon: LandPlot,
    count: 180,
    href: '/properties?propertyType=land',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'
  }
]

export default function PropertyTypes() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3 block">Property Types</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Explore By Property Type
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Find the perfect property type that suits your needs and preferences.
          </p>
        </div>

        {/* Property Types Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-6">
          {propertyTypes.map((type) => (
            <Link key={type.name} href={type.href}>
              <div className="group relative h-56 md:h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Image
                  src={type.image}
                  alt={type.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-5 text-white">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-600 transition-colors">
                    <type.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-lg">{type.name}</h3>
                  <p className="text-sm text-white/80">{type.count} Properties</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
