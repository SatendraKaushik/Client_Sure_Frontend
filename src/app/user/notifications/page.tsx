"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Bell, Trash2, Check, CheckCheck, ArrowLeft, Coins } from "lucide-react"
import Axios from "@/utils/Axios"

interface Notification {
  _id: string
  type: string
  message: string
  postId: string
  fromUser: {
    _id: string
    name: string
    avatar?: string
  }
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const response = await Axios.get('/notifications?limit=50')
      setNotifications(response.data.notifications || [])
      setUnreadCount(response.data.unreadCount || 0)
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast.error('Error loading notifications')
    } finally {
      setLoading(false)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await Axios.delete(`/notifications/${notificationId}`)
      setNotifications(prev => prev.filter(n => n._id !== notificationId))
      setUnreadCount(prev => Math.max(0, prev - 1))
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Error deleting notification')
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await Axios.put('/notifications/mark-read', { notificationIds: [notificationId] })
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
      toast.success('Marked as read')
    } catch (error) {
      console.error('Error marking as read:', error)
      toast.error('Error marking as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await Axios.put('/notifications/mark-all-read')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Error marking all as read')
    }
  }

  const deleteAllNotifications = async () => {
    if (!confirm('Are you sure you want to delete all notifications?')) return
    
    try {
      await Axios.delete('/notifications/all')
      setNotifications([])
      setUnreadCount(0)
      toast.success('All notifications deleted')
    } catch (error) {
      console.error('Error deleting all notifications:', error)
      toast.error('Error deleting all notifications')
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Bell className="w-6 h-6 text-blue-600" />
                  <span>Notifications</span>
                </h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            
            {notifications.length > 0 && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark all read</span>
                </button>
                <button
                  onClick={deleteAllNotifications}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete all</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 hover:bg-gray-50 transition-colors group ${
                    !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${
                      notification.type === 'token_purchase' 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      {notification.type === 'token_purchase' ? (
                        <Coins className="w-6 h-6" />
                      ) : (
                        notification.fromUser?.name?.charAt(0).toUpperCase() || 'N'
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 mb-2">{notification.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{getTimeAgo(notification.createdAt)}</span>
                        <span className="capitalize">{notification.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-2 rounded-lg hover:bg-green-100 text-green-600 hover:text-green-700 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-2 rounded-lg hover:bg-red-100 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}