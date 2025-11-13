"use client"

import { useState } from 'react'
import { Twitter, Linkedin, Github, Mail, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function Footer() {
  const [email, setEmail] = useState('')
  
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
    } else {
      toast.error('Please enter a valid email address')
    }
  }
  return (
    <footer className="bg-blue-900 text-white pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <h3 className="text-2xl font-bold mb-4">ClientSure</h3>
            <p className="text-blue-200 mb-6">Empowering businesses with intelligent client management solutions.</p>
            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-blue-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-3 text-blue-200">
              <li>
                <a href="#" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3 text-blue-200">
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3 text-blue-200">
              <li>
                <a href="#" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Status
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Newsletter</h4>
            <p className="text-blue-200 mb-4 text-sm">Stay updated with our latest features and news.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 rounded-l-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-300 focus:outline-none text-sm"
                required
              />
              <button type="submit" className="bg-white text-blue-900 font-semibold px-4 py-2 rounded-r-lg hover:bg-blue-50 transition text-sm whitespace-nowrap flex items-center gap-2">
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800 pt-8 mt-8"></div>

        {/* Bottom Footer */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <p className="text-blue-200 text-sm">© 2025 ClientSure. All rights reserved.</p>
          <div className="flex gap-6 text-blue-200 text-sm">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
