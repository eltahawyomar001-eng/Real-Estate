'use client'

import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Home Buyer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    content: 'RealEstate Pro made finding our dream home so easy. The team was professional, responsive, and truly understood what we were looking for. Highly recommended!',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Property Investor',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    content: 'As an investor, I appreciate the detailed property analytics and market insights. The platform is intuitive and the agents are knowledgeable.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'First-time Renter',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    content: 'I was nervous about renting my first apartment, but the team guided me through every step. Found the perfect place within my budget!',
    rating: 5
  },
  {
    name: 'David Thompson',
    role: 'Home Seller',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    content: 'Sold my property in just 3 weeks at a great price. The marketing strategy and exposure they provided was exceptional.',
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3 block">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Don't just take our word for it. Here's what our satisfied clients have to say.
          </p>
        </div>

        {/* Testimonials Slider */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={32}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-14"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full hover:shadow-lg transition-shadow">
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-primary-100 mb-5" />
                
                {/* Content */}
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">{testimonial.content}</p>
                
                {/* Rating */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
