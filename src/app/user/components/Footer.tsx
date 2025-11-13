export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              SureF
            </h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering your business with AI-driven lead generation and comprehensive courses to accelerate your growth.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/user/dashboard" className="text-gray-300 hover:text-white">Dashboard</a></li>
              <li><a href="/user/profile" className="text-gray-300 hover:text-white">Profile</a></li>
              <li><a href="/support" className="text-gray-300 hover:text-white">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>support@suref.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2024 SureF. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}