"use client"

import { useState, useEffect } from "react"
import { Lock } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import LeadResourcesCard from "../components/LeadResourcesCard"
import CoursesCard from "../components/CoursesCard"
import Axios from "@/utils/Axios"

interface UserStats {
  tokens: number
  tokensUsedTotal: number
  tokensUsedToday: number
  dailyTokens: number
  monthlyTokens: {
    total: number
    used: number
    remaining: number
  }
  subscription: {
    isActive: boolean
    planName?: string
    endDate?: string
    monthlyAllocation: number
  }
}

interface Resource {
  id: string
  title: string
  type: string
  description: string
  tokenCost: number
  thumbnailUrl?: string
  url?: string
  isAccessedByUser: boolean
}

export default function Dashboard() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for new subscription
    const newSubscription = searchParams.get('newSubscription')
    if (newSubscription === 'true') {
      setShowWelcome(true)
      toast.success('🎉 Welcome! Your subscription is now active. Enjoy your premium resources!')
      
      // Clear localStorage after successful login
      localStorage.removeItem('pendingUserEmail')
      localStorage.removeItem('pendingUserName')
    }
  }, [searchParams])

  const loadUserStats = async () => {
    try {
      const response = await Axios.get('/auth/profile')
      setUserStats({
        tokens: response.data.tokens.daily,
        tokensUsedTotal: response.data.tokens.totalUsed,
        tokensUsedToday: response.data.tokens.dailyUsed,
        dailyTokens: response.data.tokens.dailyLimit,
        monthlyTokens: {
          total: response.data.tokens.monthlyTotal,
          used: response.data.tokens.monthlyUsed,
          remaining: response.data.tokens.monthlyRemaining
        },
        subscription: {
          isActive: response.data.subscription.isActive,
          planName: response.data.subscription.plan?.name,
          endDate: response.data.subscription.endDate,
          monthlyAllocation: response.data.tokens.monthlyTotal
        }
      })
    } catch (error) {
      console.error('Error loading user stats:', error)
    }
  }

  const loadResources = async () => {
    try {
      const response = await Axios.get('/resources')
      const resourcesData = response.data.resources || []
      setResources(resourcesData)
      setFilteredResources(resourcesData)
    } catch (error) {
      console.error('Error loading resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterResources = (filter: string) => {
    setActiveFilter(filter)
    let filtered = resources
    
    switch (filter) {
      case 'pdf':
        filtered = resources.filter(r => r.type === 'pdf')
        break
      case 'video':
        filtered = resources.filter(r => r.type === 'video')
        break
      case 'accessed':
        filtered = resources.filter(r => r.isAccessedByUser)
        break
      case 'locked':
        filtered = resources.filter(r => !r.isAccessedByUser)
        break
      default:
        filtered = resources
    }
    
    setFilteredResources(filtered)
  }

  const handleAccessResource = async (resourceId: string, tokenCost: number) => {
    if (!userStats || userStats.monthlyTokens.remaining < tokenCost) {
      alert('Insufficient tokens to access this resource')
      return
    }

    try {
      const response = await Axios.post(`/auth/access/${resourceId}`)
      
      // Update user stats after successful access
      setUserStats(prev => prev ? {
        ...prev,
        monthlyTokens: {
          ...prev.monthlyTokens,
          remaining: response.data.remainingTokens,
          used: prev.monthlyTokens.used + tokenCost
        },
        tokensUsedTotal: prev.tokensUsedTotal + tokenCost
      } : null)

      // Refresh user stats to get updated token data
      await loadUserStats()

      // Open resource in new tab
      if (response.data.resource.url) {
        window.open(response.data.resource.url, '_blank')
      }

      alert(`Resource accessed! ${response.data.tokensUsed} tokens used. ${response.data.remainingTokens} tokens remaining.`)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to access resource'
      if (errorMessage === 'Insufficient tokens') {
        alert('You do not have enough monthly tokens to access this resource.')
      } else if (errorMessage === 'Subscription expired or inactive') {
        alert('Your subscription has expired or is inactive. Please renew to access resources.')
      } else if (errorMessage === 'Resource not found') {
        alert('This resource is no longer available.')
      } else {
        alert(errorMessage)
      }
    }
  }

  useEffect(() => {
    loadUserStats()
    loadResources()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Your 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access premium lead generation resources and master courses to accelerate your business growth
          </p>
        </div>

        {/* Welcome Message for New Subscribers */}
        {showWelcome && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <div className="text-green-600 text-3xl mr-4">🎉</div>
              <div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Welcome to ClientSure Premium!</h3>
                <p className="text-green-700 mb-3">
                  Your subscription is now active! You can now access all premium resources and start growing your business.
                </p>
                <div className="flex gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Premium Resources Unlocked
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Monthly Tokens Allocated
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{userStats?.tokens || 0}</div>
            <div className="text-gray-600">Daily Tokens</div>
            <div className="text-xs text-gray-500 mt-1">of {userStats?.dailyTokens || 0} limit</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{userStats?.monthlyTokens.remaining || 0}</div>
            <div className="text-gray-600">Monthly Tokens</div>
            <div className="text-xs text-gray-500 mt-1">of {userStats?.monthlyTokens.total || 0}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{userStats?.tokensUsedTotal || 0}</div>
            <div className="text-gray-600">Total Used</div>
            <div className="text-xs text-gray-500 mt-1">{userStats?.tokensUsedToday || 0} today</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className={`text-3xl font-bold mb-2 ${
              userStats?.subscription.isActive ? 'text-green-600' : 'text-red-600'
            }`}>
              {userStats?.subscription.isActive ? '✓' : '✗'}
            </div>
            <div className="text-gray-600">Subscription</div>
            <div className="text-xs text-gray-500 mt-1">
              {userStats?.subscription.planName || 'No Plan'}
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Resources</h2>
            <span className="text-sm text-gray-500">{filteredResources.length} resources</span>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'all', label: 'All', count: resources.length },
              { key: 'pdf', label: 'PDFs', count: resources.filter(r => r.type === 'pdf').length },
              { key: 'video', label: 'Videos', count: resources.filter(r => r.type === 'video').length },
              { key: 'accessed', label: 'Accessed', count: resources.filter(r => r.isAccessedByUser).length },
              { key: 'locked', label: 'Locked', count: resources.filter(r => !r.isAccessedByUser).length }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => filterResources(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading resources...</div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {activeFilter === 'all' ? 'No resources available' : `No ${activeFilter} resources found`}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Preview Section */}
                  <div className="relative h-48 bg-gray-100">
                    {resource.type === 'video' && resource.url ? (
                      <div className="relative w-full h-full">
                        <video 
                          className="w-full h-full object-cover"
                          preload="metadata"
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                          style={{ pointerEvents: resource.isAccessedByUser ? 'auto' : 'none' }}
                        >
                          <source src={resource.url} type="video/mp4" />
                        </video>
                        {!resource.isAccessedByUser && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-center text-white">
                              <Lock className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm font-medium">Locked Content</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : resource.type === 'pdf' ? (
                      <div className="relative w-full h-full bg-red-50 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-16 h-16 text-red-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-sm text-red-600 font-medium">PDF Document</p>
                        </div>
                        {!resource.isAccessedByUser && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-center text-white">
                              <Lock className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm font-medium">Locked Content</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-xs">No Preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm">{resource.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        resource.type === 'pdf' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {resource.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mb-4 line-clamp-2">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {resource.tokenCost} tokens
                      </span>
                      {resource.isAccessedByUser ? (
                        <button 
                          onClick={() => window.location.href = '/user/resources'}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                        >
                          Accessed
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleAccessResource(resource.id, resource.tokenCost)}
                          className={`px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
                            !userStats || userStats.monthlyTokens.remaining < resource.tokenCost
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          disabled={!userStats || userStats.monthlyTokens.remaining < resource.tokenCost}
                        >
                          {!userStats || userStats.monthlyTokens.remaining < resource.tokenCost ? 'No Tokens' : 'Unlock'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subscription Status */}
        {userStats && !userStats.subscription.isActive && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <div className="flex items-center">
              <div className="text-yellow-600 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Subscription Required</h3>
                <p className="text-yellow-700">Subscribe to a plan to access premium resources and get monthly token allocations.</p>
              </div>
            </div>
          </div>
        )}

        {/* Token Usage Overview */}
        {userStats && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Token Usage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Daily Tokens</h3>
                <div className="bg-gray-200 rounded-full h-4 mb-2">
                  <div 
                    className="bg-blue-600 h-4 rounded-full" 
                    style={{width: `${(userStats.tokens / userStats.dailyTokens) * 100}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {userStats.tokens} of {userStats.dailyTokens} remaining
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Tokens</h3>
                <div className="bg-gray-200 rounded-full h-4 mb-2">
                  <div 
                    className="bg-green-600 h-4 rounded-full" 
                    style={{width: `${(userStats.monthlyTokens.remaining / userStats.monthlyTokens.total) * 100}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {userStats.monthlyTokens.remaining} of {userStats.monthlyTokens.total} remaining
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}