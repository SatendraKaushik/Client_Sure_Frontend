"use client"

import { useState, useEffect } from "react"
import Axios from "@/utils/Axios"

interface UserDetail {
  _id: string
  name: string
  email: string
  subscription?: {
    planId?: {
      name: string
      price: number
    }
    status: string
    expiresAt?: string
  }
  isActive: boolean
  createdAt: string
  tokens: number
  lastLogin?: string
  phone?: string
}

interface UserDetailViewProps {
  userId: string
  onBack: () => void
}

export default function UserDetailView({ userId, onBack }: UserDetailViewProps) {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = async () => {
    try {
      const response = await Axios.get(`/admin/users/${userId}`)
      setUser(response.data)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async () => {
    if (!user) return
    try {
      await Axios.put(`/admin/users/${userId}`, { isActive: !user.isActive })
      setUser({ ...user, isActive: !user.isActive })
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  useEffect(() => {
    loadUser()
  }, [userId])

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Loading user details...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="text-red-500">User not found</div>
          <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-800">
            Back to Users
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Users
          </button>
          <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
        </div>
        <button
          onClick={toggleUserStatus}
          className={`px-4 py-2 rounded-lg font-medium ${
            user.isActive 
              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          {user.isActive ? 'Deactivate User' : 'Activate User'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Profile */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name || 'Unknown User'}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{user.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                <p className="text-gray-900">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Subscription Info */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
            {user.subscription?.planId ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    {user.subscription.planId.name}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ${user.subscription.planId.price}/month
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Status: <span className="font-medium">{user.subscription.status}</span></p>
                  {user.subscription.expiresAt && (
                    <p>Expires: {new Date(user.subscription.expiresAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  No Active Plan
                </span>
              </div>
            )}
          </div>

          {/* Tokens */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tokens</h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{user.tokens || 0}</div>
              <p className="text-sm text-gray-600">Available Tokens</p>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  )
}