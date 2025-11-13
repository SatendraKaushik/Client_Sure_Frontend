"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Axios from "@/utils/Axios"

interface UserProfile {
  name: string
  email: string
  tokens: {
    monthlyTotal: number
    monthlyUsed: number
    monthlyRemaining: number
    totalUsed: number
    daily: number
    dailyLimit: number
    dailyUsed: number
  }
  subscription: {
    plan: {
      id: string
      name: string
      price: number
    } | null
    startDate: string
    endDate: string
    isActive: boolean
  }
}

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('Account Details')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadUserProfile = async () => {
    try {
      const response = await Axios.get('/auth/profile')
      setUserProfile(response.data)
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserProfile()
  }, [])

  const sidebarItems = [
    { name: 'Account Details', icon: '👤' },
    { name: 'Token Usage', icon: '🎯' },
    { name: 'Subscription Plan', icon: '📋' },
    { name: 'Usage Statistics', icon: '📊' },
    { name: 'Accessed Resources', icon: '📚' },
    { name: 'Settings', icon: '⚙️' }
  ]

  const handleLogout = () => {
    toast.success('Logged out successfully!')
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r shadow-lg min-h-screen p-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">
                {userProfile?.name?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 'U'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{userProfile?.name || 'Loading...'}</h1>
            <p className="text-gray-600 text-sm">{userProfile?.email || ''}</p>
          </div>
          
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.name)}
                className={`w-full text-left py-3 px-4 rounded-lg transition-colors flex items-center ${
                  activeSection === item.name 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
            
            <div className="border-t border-gray-200 my-6"></div>
            
            <button
              onClick={handleLogout}
              className="w-full text-left py-3 px-4 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center"
            >
              <span className="mr-3 text-lg">🚪</span>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-gray-50">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-gray-500">Loading profile...</div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">{activeSection}</h2>
            
              {activeSection === 'Account Details' && userProfile && (
                <div>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white mb-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-white text-black bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold">
                          {userProfile.name?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{userProfile.name}</h3>
                        <p className="text-blue-100">{userProfile.email}</p>
                        <div className="flex items-center mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            userProfile.subscription.isActive 
                              ? 'bg-green-500 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {userProfile.subscription.isActive ? 'Active Subscriber' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="bg-gray-50 p-3 rounded-lg text-gray-900">{userProfile.name}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="bg-gray-50 p-3 rounded-lg text-gray-900">{userProfile.email}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                        <div className={`p-3 rounded-lg font-medium ${
                          userProfile.subscription.isActive 
                            ? 'bg-green-50 text-green-800' 
                            : 'bg-red-50 text-red-800'
                        }`}>
                          {userProfile.subscription.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                        <div className="bg-gray-50 p-3 rounded-lg text-gray-900">
                          {new Date(userProfile.subscription.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            
              {activeSection === 'Token Usage' && userProfile && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Daily Tokens</h3>
                      <div className="text-3xl font-bold text-blue-600 mb-2">{userProfile.tokens.daily}</div>
                      <div className="text-sm text-blue-700">of {userProfile.tokens.dailyLimit} available</div>
                      <div className="bg-blue-200 rounded-full h-2 mt-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${(userProfile.tokens.daily / userProfile.tokens.dailyLimit) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-900 mb-4">Monthly Tokens</h3>
                      <div className="text-3xl font-bold text-green-600 mb-2">{userProfile.tokens.monthlyRemaining}</div>
                      <div className="text-sm text-green-700">of {userProfile.tokens.monthlyTotal} remaining</div>
                      <div className="bg-green-200 rounded-full h-2 mt-3">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{width: `${(userProfile.tokens.monthlyRemaining / userProfile.tokens.monthlyTotal) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{userProfile.tokens.totalUsed}</div>
                        <div className="text-sm text-gray-600">Total Used</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{userProfile.tokens.dailyUsed}</div>
                        <div className="text-sm text-gray-600">Used Today</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{userProfile.tokens.monthlyUsed}</div>
                        <div className="text-sm text-gray-600">Used This Month</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            
              {activeSection === 'Subscription Plan' && userProfile && (
                <div>
                  {userProfile.subscription.plan ? (
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white mb-8">
                      <div className="text-center">
                        <h3 className="text-3xl font-bold mb-2">{userProfile.subscription.plan.name}</h3>
                        <p className="text-purple-100 mb-4">Your current subscription plan</p>
                        <div className="text-4xl font-bold">${userProfile.subscription.plan.price}/month</div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-8 text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">No Active Plan</h3>
                      <p className="text-gray-600">Subscribe to a plan to access premium features</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Subscription Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status</span>
                          <span className={`font-medium ${
                            userProfile.subscription.isActive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {userProfile.subscription.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Date</span>
                          <span className="font-medium">
                            {new Date(userProfile.subscription.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">End Date</span>
                          <span className="font-medium">
                            {new Date(userProfile.subscription.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Token Allocation</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Tokens</span>
                          <span className="font-medium">{userProfile.tokens.monthlyTotal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Daily Limit</span>
                          <span className="font-medium">{userProfile.tokens.dailyLimit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Remaining</span>
                          <span className="font-medium text-green-600">{userProfile.tokens.monthlyRemaining}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            
              {activeSection === 'Usage Statistics' && userProfile && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{userProfile.tokens.totalUsed}</div>
                      <div className="text-blue-700 font-medium">Total Tokens Used</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">{userProfile.tokens.monthlyUsed}</div>
                      <div className="text-green-700 font-medium">Used This Month</div>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">{userProfile.tokens.dailyUsed}</div>
                      <div className="text-purple-700 font-medium">Used Today</div>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-6">Usage Efficiency</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Monthly Usage</span>
                          <span className="font-medium">
                            {((userProfile.tokens.monthlyUsed / userProfile.tokens.monthlyTotal) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${(userProfile.tokens.monthlyUsed / userProfile.tokens.monthlyTotal) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Daily Usage</span>
                          <span className="font-medium">
                            {((userProfile.tokens.dailyUsed / userProfile.tokens.dailyLimit) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{width: `${(userProfile.tokens.dailyUsed / userProfile.tokens.dailyLimit) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            
              {activeSection === 'Accessed Resources' && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Accessed Resources</h3>
                  <p className="text-gray-600 mb-6">View all the resources you've accessed</p>
                  <a 
                    href="/user/accessed" 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Accessed Resources
                  </a>
                </div>
              )}
            
              {activeSection === 'Settings' && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚙️</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Account Settings</h3>
                  <p className="text-gray-600">Account settings and preferences will be available here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}