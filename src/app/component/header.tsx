import { Shield } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-blue-600">ClientSure</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Features
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Pricing
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            About
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">
            Contact
          </a>
        </div>
      </nav>
    </header>
  )
}
