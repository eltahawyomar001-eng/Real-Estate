import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

export default function CallToAction() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-r from-primary-600 to-primary-800">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Let us help you discover the perfect property. Our expert agents are ready to guide you through every step of the journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/properties"
              className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg px-8 py-4 text-lg"
            >
              Browse Properties
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/contact"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 btn-lg px-8 py-4 text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
