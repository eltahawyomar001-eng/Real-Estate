'use client'

import { useEffect, useState, useRef } from 'react'
import { Home, Users, MapPin, Award } from 'lucide-react'

const stats = [
  { icon: Home, value: 10000, suffix: '+', label: 'Properties Listed' },
  { icon: Users, value: 5000, suffix: '+', label: 'Happy Clients' },
  { icon: MapPin, value: 200, suffix: '+', label: 'Cities Covered' },
  { icon: Award, value: 15, suffix: '+', label: 'Years Experience' }
]

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration, start])

  return count
}

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-16 bg-primary-600" ref={ref}>
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem key={index} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatItem({ stat, isVisible }: { stat: typeof stats[0], isVisible: boolean }) {
  const count = useCountUp(stat.value, 2000, isVisible)

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-full mb-4">
        <stat.icon className="w-7 h-7 text-white" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-white/80">{stat.label}</div>
    </div>
  )
}
