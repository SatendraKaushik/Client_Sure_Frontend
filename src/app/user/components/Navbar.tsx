"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Axios from "@/utils/Axios"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [tokens, setTokens] = useState({ daily: 0, dailyLimit: 100 })
  const [userName, setUserName] = useState('')
  const profileRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const response = await Axios.get('/auth/profile')
        setTokens({
          daily: response.data.tokens.daily,
          dailyLimit: response.data.tokens.dailyLimit
        })
        setUserName(response.data.name || '')
      } catch (error) {
        console.error('Error loading tokens:', error)
      }
    }
    loadTokens()
  }, [])

  const handleProfileClick = () => {
    setIsProfileOpen(false)
    router.push('/user/profile')
  }

  const handleLogout = () => {
    setIsProfileOpen(false)
    toast.success('Logged out successfully!')
    router.push('/auth/login')
  }

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Client_Sure
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="/user/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
              Dashboard
            </a>
            <a href="/user/resources" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
              Resources
            </a>
            <a href="/user/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">
              Profile
            </a>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {tokens.daily}/{tokens.dailyLimit} Tokens
              </div>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {userName?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 'U'}
                  </div>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <a href="/user/dashboard" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </a>
            <a href="/user/resources" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Resources
            </a>
            <a href="/user/profile" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Profile
            </a>
            <div className="px-3 py-2">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-2">
                {tokens.daily}/{tokens.dailyLimit} Tokens
              </div>
              <button
                onClick={handleProfileClick}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium mb-2 flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}