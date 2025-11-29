import Link from 'next/link'
import { 
  Building2, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/agents' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  properties: [
    { name: 'For Sale', href: '/properties?listingType=sale' },
    { name: 'For Rent', href: '/properties?listingType=rent' },
    { name: 'New Listings', href: '/properties?sort=newest' },
    { name: 'Featured', href: '/properties?featured=true' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'FAQ', href: '/faq' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                RealEstate<span className="text-primary-500">Pro</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-8 max-w-sm text-base leading-relaxed">
              Your trusted partner in finding the perfect property. We help you discover your dream home with ease and confidence.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span>123 Real Estate Blvd, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-primary-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-primary-500" />
                <span>info@realestatepro.com</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Properties</h4>
            <ul className="space-y-4">
              {footerLinks.properties.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-400">
            © {new Date().getFullYear()} RealEstate Pro. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="w-11 h-11 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label={link.name}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
