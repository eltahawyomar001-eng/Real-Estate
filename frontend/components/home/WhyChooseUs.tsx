import { Shield, Clock, Users, HeadphonesIcon, Banknote, Search } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Easy Property Search',
    description: 'Find your dream property with our advanced search filters and intuitive interface.'
  },
  {
    icon: Shield,
    title: 'Trusted & Verified',
    description: 'All our listings are verified and our agents are thoroughly vetted for your peace of mind.'
  },
  {
    icon: Clock,
    title: 'Quick Process',
    description: 'Streamlined buying and renting process to get you into your new home faster.'
  },
  {
    icon: Banknote,
    title: 'Best Prices',
    description: 'Competitive pricing and no hidden fees. Get the best value for your investment.'
  },
  {
    icon: Users,
    title: 'Expert Agents',
    description: 'Our experienced agents provide personalized guidance throughout your journey.'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to assist you whenever you need help.'
  }
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3 block">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            The Best Real Estate Experience
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We provide comprehensive real estate services with a focus on your satisfaction and success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-5">
                <feature.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
