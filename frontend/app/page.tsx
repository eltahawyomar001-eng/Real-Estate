import Hero from '@/components/home/Hero'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import PropertyTypes from '@/components/home/PropertyTypes'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import Stats from '@/components/home/Stats'
import Testimonials from '@/components/home/Testimonials'
import CallToAction from '@/components/home/CallToAction'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <PropertyTypes />
      <Stats />
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />
    </>
  )
}
