'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Loader2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

type ContactForm = z.infer<typeof contactSchema>

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactForm) => {
    setLoading(true)
    try {
      // In a real app, this would send to a contact API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      reset()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="page-header">
        <div className="container-custom text-center">
          <h1 className="page-header-title">Contact Us</h1>
          <p className="page-header-subtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Whether you're looking to buy, sell, or rent a property, our team of experts is here to help you every step of the way.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Our Office</h3>
                    <p className="text-gray-600 leading-relaxed">
                      123 Real Estate Ave<br />
                      Los Angeles, CA 90001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Phone</h3>
                    <p className="text-gray-600">
                      <a href="tel:+1234567890" className="hover:text-primary-600 transition-colors">+1 (234) 567-890</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@realestatepro.com" className="hover:text-primary-600 transition-colors">info@realestatepro.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Business Hours</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Mon - Fri: 9:00 AM - 6:00 PM<br />
                      Sat: 10:00 AM - 4:00 PM<br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-5">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Full Name</label>
                      <input
                        type="text"
                        {...register('name')}
                        className={`input ${errors.name ? 'input-error' : ''}`}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <input
                        type="email"
                        {...register('email')}
                        className={`input ${errors.email ? 'input-error' : ''}`}
                        placeholder="Your email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Phone (Optional)</label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className="input"
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <label className="label">Subject</label>
                      <input
                        type="text"
                        {...register('subject')}
                        className={`input ${errors.subject ? 'input-error' : ''}`}
                        placeholder="Subject"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-2">{errors.subject.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="label">Message</label>
                    <textarea
                      {...register('message')}
                      rows={6}
                      className={`input resize-none ${errors.message ? 'input-error' : ''}`}
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-2">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary btn-lg w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[450px] bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27405770525!2d-118.69192047471653!3d34.02016130653294!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c75ddc27da13%3A0xe22fdf6f254608f4!2sLos%20Angeles%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1635789876543!5m2!1sen!2s"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </main>
  )
}
