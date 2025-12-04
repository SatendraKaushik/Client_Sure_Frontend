"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Target, Coins, Plus, Zap, TrendingUp, Clock } from "lucide-react"
import { toast } from "sonner"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProfileSidebar from "../components/ProfileSidebar"
import TokenPurchase from "../../../../components/TokenPurchase"
import Axios from "@/utils/Axios"


interface TokenData {
  monthlyTotal: number
  monthlyUsed: number
  monthlyRemaining: number
  totalUsed: number
  daily: number
  dailyLimit: number
  dailyUsed: number
}

interface TokenBalance {
  total: number
  regular: number
  extra: number
  used: number
  dailyLimit: number
  hasExtraTokens: boolean
}

interface QuickPackage {
  id: string
  name: string
  tokens: number
  price: number
}

export default function TokenUsagePage() {
  const [tokens, setTokens] = useState<TokenData | null>(null)
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null)
  const [quickPackages, setQuickPackages] = useState<QuickPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const router = useRouter()

  const loadTokenData = async () => {
    try {
      const [profileResponse, balanceResponse, packagesResponse] = await Promise.all([
        Axios.get('/auth/profile'),
        Axios.get('/tokens/balance'),
        Axios.get('/tokens/packages')
      ])
      
      setTokens(profileResponse.data.tokens)
      setTokenBalance(balanceResponse.data.balance)
      
      // Get first 2 packages for quick top-up
      const packages = packagesResponse.data.packages.slice(0, 2)
      setQuickPackages(packages)
    } catch (error) {
      console.error('Error loading token data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseComplete = () => {
    setShowPurchaseModal(false)
    loadTokenData() // Refresh data after purchase
  }

  useEffect(() => {
    loadTokenData()
    
    // Check for purchase status in URL params
    const urlParams = new URLSearchParams(window.location.search)
    const purchaseStatus = urlParams.get('purchase')
    const tokensAdded = urlParams.get('tokens')
    
    if (purchaseStatus === 'success') {
      toast.success(`🎉 Token purchase successful! ${tokensAdded || ''} tokens added to your account.`)
    } else if (purchaseStatus === 'cancelled') {
      toast.info('🚫 Payment cancelled. No charges were made.')
    } else if (purchaseStatus === 'failed') {
      toast.error('❌ Payment failed. Please try again or contact support.')
    } else if (purchaseStatus === 'error') {
      toast.error('⚠️ Payment processing error. Please try again.')
    }
    
    // Clean URL if any purchase status exists
    if (purchaseStatus) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${showPurchaseModal ? 'blur-sm' : ''} transition-all duration-300`}>
        <Navbar />
        
        <div className="flex max-w-7xl mx-auto">
          <ProfileSidebar />
          
          <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center space-x-2">
            <Target className="w-6 h-6 text-blue-600" />
            <span>Token Usage</span>
          </h1>

        {tokens && (
          <div className="space-y-8">
            {/* Token Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Coins className="w-5 h-5 mr-2" />
                  Current Balance
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">{tokens.daily}</div>
                <div className="text-sm text-blue-700">Total available tokens</div>
                {tokenBalance?.hasExtraTokens && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                    <Zap className="w-3 h-3" />
                    {tokenBalance.extra} extra tokens
                  </div>
                )}
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Daily Limit
                </h3>
                <div className="text-3xl font-bold text-green-600 mb-2">{tokens.dailyLimit}</div>
                <div className="text-sm text-green-700">Regular daily allowance</div>
                <div className="bg-green-200 rounded-full h-3 mt-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                    style={{width: `${Math.min((tokens.daily / tokens.dailyLimit) * 100, 100)}%`}}
                  ></div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Used Today
                </h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">{tokens.dailyUsed}</div>
                <div className="text-sm text-purple-700">Tokens consumed</div>
              </div>
            </div>
            
            {/* Low Balance Warning & Purchase Button */}
            {tokens.daily < 10 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-900">Low Token Balance</h3>
                      <p className="text-orange-700 text-sm">
                        You have {tokens.daily} tokens remaining. Buy more to continue accessing leads.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPurchaseModal(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Buy Tokens
                  </button>
                </div>
              </div>
            )}
            
            {/* Token Expiry Notice */}
            {tokenBalance?.hasExtraTokens && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-2 text-blue-800">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Extra Token Notice</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  You have {tokenBalance.extra} extra tokens that will expire at midnight (1:00 AM).
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Coins className="w-5 h-5 mr-2" />
                  Current Balance
                </h3>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {tokens.daily}
                    <span className="text-lg text-blue-500">/{tokens.dailyLimit}</span>
                  </div>
                  <div className="text-sm text-blue-700 mb-4">Available Tokens</div>
                  <div className="bg-blue-200 rounded-full h-4 mb-2">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all duration-300" 
                      style={{width: `${Math.min((tokens.daily / tokens.dailyLimit) * 100, 100)}%`}}
                    ></div>
                  </div>
                  <div className="text-xs text-blue-600">
                    {((tokens.daily / tokens.dailyLimit) * 100).toFixed(1)}% remaining
                  </div>
                </div>
                
                {/* Buy Now Button */}
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2 mb-4"
                >
                  <Plus className="w-5 h-5" />
                  Buy More Tokens
                </button>
                
                <div className="text-xs text-blue-600 text-center mb-4">
                  💡 Get instant tokens • Secure payment • 24/7 support
                </div>
                
                {tokenBalance && (
                  <div className="pt-4 border-t border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Token Breakdown:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-700">Regular tokens:</span>
                        <span className="font-semibold text-blue-900">{tokenBalance.regular}</span>
                      </div>
                      {tokenBalance.hasExtraTokens && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-orange-700">Extra tokens:</span>
                          <span className="font-semibold text-orange-900">{tokenBalance.extra}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm pt-2 border-t border-blue-200">
                        <span className="text-blue-800 font-medium">Used today:</span>
                        <span className="font-semibold text-blue-900">{tokens.dailyUsed}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quick Purchase Options */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Top-Up
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {quickPackages.map((pkg, index) => (
                    <div key={pkg.id} className="bg-white p-3 rounded-lg border border-purple-200 text-center">
                      <div className="text-lg font-bold text-purple-600">{pkg.tokens}</div>
                      <div className="text-xs text-purple-700">tokens</div>
                      <div className="text-sm font-semibold text-gray-900">₹{pkg.price}</div>
                    </div>
                  ))}
                  {quickPackages.length === 0 && (
                    <div className="col-span-2 text-center text-gray-500 text-sm py-4">
                      Loading packages...
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  View All Packages
                </button>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Monthly Tokens
                </h3>
                <div className="text-3xl font-bold text-green-600 mb-2">{tokens.monthlyRemaining}</div>
                <div className="text-sm text-green-700">of {tokens.monthlyTotal} remaining</div>
                <div className="bg-green-200 rounded-full h-3 mt-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                    style={{width: `${(tokens.monthlyRemaining / tokens.monthlyTotal) * 100}%`}}
                  ></div>
                </div>
                <div className="text-xs text-green-600 mt-2">
                  {((tokens.monthlyRemaining / tokens.monthlyTotal) * 100).toFixed(1)}% remaining
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Usage Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{tokens.totalUsed}</div>
                  <div className="text-sm text-purple-700 font-medium">Total Used</div>
                  <div className="text-xs text-purple-600 mt-1">All time usage</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{tokens.dailyUsed}</div>
                  <div className="text-sm text-orange-700 font-medium">Used Today</div>
                  <div className="text-xs text-orange-600 mt-1">Daily consumption</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-3xl font-bold text-red-600 mb-2">{tokens.monthlyUsed}</div>
                  <div className="text-sm text-red-700 font-medium">Used This Month</div>
                  <div className="text-xs text-red-600 mt-1">Monthly consumption</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-6">Usage Efficiency</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 font-medium">Monthly Usage</span>
                    <span className="font-semibold text-blue-600">
                      {((tokens.monthlyUsed / tokens.monthlyTotal) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{width: `${(tokens.monthlyUsed / tokens.monthlyTotal) * 100}%`}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {tokens.monthlyUsed} of {tokens.monthlyTotal} tokens used
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 font-medium">Daily Usage</span>
                    <span className="font-semibold text-green-600">
                      {((tokens.dailyUsed / tokens.dailyLimit) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                      style={{width: `${(tokens.dailyUsed / tokens.dailyLimit) * 100}%`}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {tokens.dailyUsed} of {tokens.dailyLimit} tokens used today
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
          </div>
        </div>
        
        <Footer />
      </div>
      
      {/* Token Purchase Modal */}
      <TokenPurchase
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchaseComplete={handlePurchaseComplete}
        currentBalance={tokens?.daily || 0}
      />
    </div>
  )
}