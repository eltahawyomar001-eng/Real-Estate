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
    <section className="section bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary-600 font-medium mb-2 block">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The Best Real Estate Experience
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive real estate services with a focus on your satisfaction and success.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
