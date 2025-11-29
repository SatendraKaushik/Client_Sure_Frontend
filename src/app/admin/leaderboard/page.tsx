"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import AdminSidebar from '../components/AdminSidebar'
import { AdminAPI } from '../../../utils/AdminAPI'
import { Award, Trophy, Medal, Crown, Users, MessageCircle, Heart, RefreshCw, TrendingUp, Calendar, Gift, Coins } from 'lucide-react'

interface LeaderboardUser {
  _id: string
  name: string
  email: string
  avatar?: string
  points: number
  communityActivity: {
    postsCreated: number
    commentsMade: number
    likesGiven: number
    likesReceived: number
  }
  createdAt: string
}

interface CommunityStats {
  totalPosts: number
  totalComments: number
  totalLikes: number
  activeMembers: number
}

export default function AdminLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [communityStats, setCommunityStats] = useState<CommunityStats>({
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
    activeMembers: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchLeaderboard()
    
    // Auto-refresh every 60 seconds
    const refreshInterval = setInterval(() => {
      fetchLeaderboard(true)
    }, 60000)
    
    return () => clearInterval(refreshInterval)
  }, [])

  const fetchLeaderboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      
      const [leaderboardResponse, statsResponse] = await Promise.all([
        AdminAPI.get('/community/leaderboard'),
        AdminAPI.get('/community/stats')
      ])
      
      // Handle leaderboard response
      if (leaderboardResponse?.success && leaderboardResponse.leaderboard) {
        setLeaderboard(leaderboardResponse.leaderboard)
      } else if (leaderboardResponse?.data?.leaderboard) {
        setLeaderboard(leaderboardResponse.data.leaderboard)
      } else if (leaderboardResponse?.leaderboard) {
        setLeaderboard(leaderboardResponse.leaderboard)
      }
      
      // Handle stats response
      if (statsResponse?.success) {
        setCommunityStats({
          totalPosts: statsResponse.totalPosts || 0,
          totalComments: statsResponse.totalComments || 0,
          totalLikes: statsResponse.totalLikes || 0,
          activeMembers: statsResponse.activeMembers || 0
        })
      } else if (statsResponse?.data) {
        setCommunityStats(statsResponse.data)
      }
      
      setLastUpdated(new Date())
      if (!silent) {
        toast.success('Leaderboard updated successfully')
      }
      
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      if (!silent) {
        toast.error('Error loading leaderboard data')
      }
    } finally {
      setLoading(false)
    }
  }

  const getPrizeInfo = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          badge: '🥇 1st Prize',
          bgGradient: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
          textColor: 'text-yellow-900',
          borderColor: 'border-yellow-300',
          icon: <Crown className="w-6 h-6 text-yellow-700" />
        }
      case 2:
        return {
          badge: '🥈 2nd Prize',
          bgGradient: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
          textColor: 'text-gray-900',
          borderColor: 'border-gray-300',
          icon: <Trophy className="w-6 h-6 text-gray-700" />
        }
      case 3:
        return {
          badge: '🥉 3rd Prize',
          bgGradient: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600',
          textColor: 'text-orange-900',
          borderColor: 'border-orange-300',
          icon: <Medal className="w-6 h-6 text-orange-700" />
        }
      default:
        return {
          badge: `#${rank}`,
          bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
          textColor: 'text-blue-900',
          borderColor: 'border-blue-200',
          icon: <Award className="w-5 h-5 text-blue-600" />
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
            <div className="text-xl text-gray-700">Loading leaderboard...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  Community Leaderboard
                </h1>
                <p className="text-gray-600 mt-2">Top performing community members with prize rankings</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
                <button
                  onClick={() => fetchLeaderboard(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{communityStats.activeMembers}</div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{communityStats.totalPosts}</div>
                  <div className="text-sm text-gray-600">Total Posts</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{communityStats.totalComments}</div>
                  <div className="text-sm text-gray-600">Total Comments</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{communityStats.totalLikes}</div>
                  <div className="text-sm text-gray-600">Total Likes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Winners */}
          {leaderboard.length >= 3 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                Prize Winners
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leaderboard.slice(0, 3).map((user, index) => {
                  const rank = index + 1
                  const prizeInfo = getPrizeInfo(rank)
                  
                  return (
                    <div key={user._id} className={`${prizeInfo.bgGradient} rounded-xl shadow-lg border-2 ${prizeInfo.borderColor} p-6 transform hover:scale-105 transition-all duration-200`}>
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          {prizeInfo.icon}
                        </div>
                        
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-700 mx-auto mb-4 shadow-md">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${prizeInfo.textColor} bg-white bg-opacity-80 mb-3`}>
                          {prizeInfo.badge}
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
                        <p className="text-white text-opacity-90 text-sm mb-3">{user.email}</p>
                        
                        <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
                          <div className="text-3xl font-bold text-white">{user.points}</div>
                          <div className="text-white text-opacity-90 text-sm">Points</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                          <div className="bg-white bg-opacity-20 rounded-lg p-2">
                            <div className="font-bold text-white">{user.communityActivity.postsCreated}</div>
                            <div className="text-white text-opacity-80">Posts</div>
                          </div>
                          <div className="bg-white bg-opacity-20 rounded-lg p-2">
                            <div className="font-bold text-white">{user.communityActivity.commentsMade}</div>
                            <div className="text-white text-opacity-80">Comments</div>
                          </div>
                        </div>
                        
                        <button
                          onClick={async () => {
                            let tokenAmount = 0
                            let prizeType = ''
                            let message = ''
                            
                            if (rank === 1) {
                              tokenAmount = 500
                              prizeType = '1st Prize'
                              message = `Do you want to give 1st Prize tokens of ${tokenAmount} to ${user.name}?`
                            } else if (rank === 2) {
                              tokenAmount = 300
                              prizeType = '2nd Prize'
                              message = `Do you want to give 2nd Prize tokens of ${tokenAmount} to ${user.name}?`
                            } else if (rank === 3) {
                              tokenAmount = 100
                              prizeType = '3rd Prize'
                              message = `Do you want to give 3rd Prize tokens of ${tokenAmount} to ${user.name}?`
                            }
                            
                            if (confirm(message)) {
                              try {
                                const response = await AdminAPI.awardPrizeTokens(user._id, tokenAmount, prizeType)
                                
                                if (response.success) {
                                  toast.success(`🎉 ${tokenAmount} ${prizeType} tokens awarded to ${user.name}!`)
                                  toast.info('Tokens will expire in 24 hours')
                                } else {
                                  toast.error(response.error || 'Failed to award tokens')
                                }
                              } catch (error: any) {
                                if (error.message?.includes('already has active') || error.message?.includes('User already has active prize tokens')) {
                                  toast.info(`${user.name} has been already rewarded`)
                                } else {
                                  toast.error(error.message || 'Error awarding tokens')
                                }
                              }
                            }
                          }}
                          className="w-full bg-white bg-opacity-90 hover:bg-white text-gray-800 font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
                        >
                          <Coins className="w-4 h-4" />
                          Award Prize Tokens
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Full Leaderboard */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Complete Rankings
              </h2>
              <p className="text-sm text-gray-500 mt-1">All community members ranked by points</p>
            </div>
            
            <div className="overflow-x-auto">
              {leaderboard.length === 0 ? (
                <div className="p-12 text-center">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rankings Available</h3>
                  <p className="text-gray-600">Community members will appear here once they start earning points</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes Given</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prize Tokens</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((user, index) => {
                      const rank = index + 1
                      const prizeInfo = getPrizeInfo(rank)
                      
                      return (
                        <tr key={user._id} className={`hover:bg-gray-50 ${rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                rank <= 3 ? prizeInfo.bgGradient + ' text-white' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {rank}
                              </div>
                              {rank <= 3 && (
                                <div className="text-lg">
                                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-lg font-bold text-gray-900">{user.points}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.communityActivity.postsCreated}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.communityActivity.commentsMade}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.communityActivity.likesGiven}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {rank <= 3 ? (
                              <button
                                onClick={async () => {
                                  let tokenAmount = 0
                                  let prizeType = ''
                                  let message = ''
                                  
                                  if (rank === 1) {
                                    tokenAmount = 500
                                    prizeType = '1st Prize'
                                    message = `Do you want to give 1st Prize tokens of ${tokenAmount} to ${user.name}?`
                                  } else if (rank === 2) {
                                    tokenAmount = 300
                                    prizeType = '2nd Prize'
                                    message = `Do you want to give 2nd Prize tokens of ${tokenAmount} to ${user.name}?`
                                  } else if (rank === 3) {
                                    tokenAmount = 100
                                    prizeType = '3rd Prize'
                                    message = `Do you want to give 3rd Prize tokens of ${tokenAmount} to ${user.name}?`
                                  }
                                  
                                  if (confirm(message)) {
                                    try {
                                      const response = await AdminAPI.awardPrizeTokens(user._id, tokenAmount, prizeType)
                                      
                                      if (response.success) {
                                        toast.success(`🎉 ${tokenAmount} ${prizeType} tokens awarded to ${user.name}!`)
                                        toast.info('Tokens will expire in 24 hours')
                                      } else {
                                        toast.error(response.error || 'Failed to award tokens')
                                      }
                                    } catch (error: any) {
                                      if (error.message?.includes('already has active') || error.message?.includes('User already has active prize tokens')) {
                                        toast.info(`${user.name} has been already rewarded`)
                                      } else {
                                        toast.error(error.message || 'Error awarding tokens')
                                      }
                                    }
                                  }
                                }}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 transform hover:scale-105"
                              >
                                <Gift className="w-4 h-4" />
                                Award Tokens
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm italic">No prize tokens</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}