"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Camera } from "lucide-react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import ProfileSidebar from "../components/ProfileSidebar"
import Axios from "@/utils/Axios"

interface UserProfile {
  name: string
  email: string
  phone?: string
  avatar?: string
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

export default function AccountDetailsPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const loadUserProfile = async () => {
    try {
      const response = await Axios.get('/auth/profile')
      const profileData = {
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone,
        avatar: response.data.user.avatar,
        subscription: response.data.subscription
      }
      
      setUserProfile(profileData)
      setEditName(response.data.user.name || '')
      setEditPhone(response.data.user.phone || '')
      setAvatarPreview(response.data.user.avatar || '')
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      toast.error('Name is required')
      return
    }

    setUpdating(true)
    try {
      const formData = new FormData()
      formData.append('name', editName.trim())
      formData.append('phone', editPhone.trim())
      
      if (fileInputRef.current?.files?.[0]) {
        formData.append('avatar', fileInputRef.current.files[0])
      }

      await Axios.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      toast.success('Profile updated successfully!')
      await loadUserProfile()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    loadUserProfile()
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
      <Navbar />
      
      <div className="flex max-w-7xl mx-auto">
        <ProfileSidebar />
        
        <div className="flex-1 p-8 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Details</h1>

        {userProfile && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8 shadow-lg">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {avatarPreview ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white border-opacity-30">
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-500 border-4 border-white border-opacity-30 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {userProfile.name?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full hover:bg-gray-100 shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-1">{userProfile.name}</h3>
                  <p className="text-blue-100 text-lg mb-3">{userProfile.email}</p>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-md ${
                      userProfile.subscription.isActive 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {userProfile.subscription.isActive ? '✓ Active Subscriber' : '✗ Inactive'}
                    </span>
                    {userProfile.subscription.plan && (
                      <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white bg-opacity-20 shadow-md text-black">
                        {userProfile.subscription.plan.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">✏️</span> Edit Personal Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={editName || ''}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📊</span> Account Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Account Status</label>
                    <div className={`p-3 rounded-lg font-semibold ${
                      userProfile.subscription.isActive 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {userProfile.subscription.isActive ? '✓ Active' : '✗ Inactive'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Member Since</label>
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-900 font-medium">
                      {new Date(userProfile.subscription.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleUpdateProfile}
                disabled={updating}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </button>
              <button
                onClick={() => {
                  setEditName(userProfile.name)
                  setEditPhone(userProfile.phone || '')
                  setAvatarPreview(userProfile.avatar || '')
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 font-semibold shadow-md"
              >
                Reset
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}