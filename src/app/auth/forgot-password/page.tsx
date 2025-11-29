"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Axios from "@/utils/Axios"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await Axios.post('/auth/request-reset', { email })
      
      setSuccess(true)
      toast.success('Password reset link sent! Check your email.')
    } catch (error: any) {
      toast.success('If your email is registered, you will receive a password reset link shortly.')
      setSuccess(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="text-blue-600 text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
          <p className="text-gray-600 mb-6">
            If your email is registered, you will receive a password reset link shortly.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            The link will expire in 24 hours.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Forgot Password?</h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-black font-semibold mb-3 text-lg">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-black bg-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  )
}
