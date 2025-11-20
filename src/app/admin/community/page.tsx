"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import AdminSidebar from '../components/AdminSidebar'
import { AdminAPI } from '../../../utils/AdminAPI'

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
}

interface Comment {
  _id: string
  user_id: User
  text: string
  createdAt: string
}

interface Post {
  _id: string
  user_id: User
  post_title: string
  description: string
  likes: { user_id: string }[]
  comments: Comment[]
  createdAt: string
}

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await AdminAPI.get('/community/all')
      setPosts(response.data.posts)
    } catch (error) {
      toast.error('Error loading community posts')
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This will deduct 5 points from the user.')) {
      return
    }

    try {
      await AdminAPI.delete(`/community/post/${postId}`)
      toast.success('Post deleted successfully (5 points deducted from user)')
      fetchPosts()
    } catch (error) {
      toast.error('Error deleting post')
    }
  }

  const deleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment? This will deduct 2 points from the user.')) {
      return
    }

    try {
      await AdminAPI.delete(`/community/comment/${commentId}`)
      toast.success('Comment deleted successfully (2 points deducted from user)')
      fetchPosts()
    } catch (error) {
      toast.error('Error deleting comment')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading community posts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Community Moderation</h1>
            <p className="text-gray-600 mt-2">Manage community posts and comments</p>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">All Community Posts</h2>
              <p className="text-sm text-gray-500 mt-1">Total posts: {posts.length}</p>
            </div>

            <div className="divide-y divide-gray-200">
              {posts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No community posts found
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post._id} className="p-6">
                    {/* Post Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {post.user_id.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.user_id.name}</h3>
                          <p className="text-sm text-gray-500">{post.user_id.email}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deletePost(post._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
                      >
                        Delete Post (-5 pts)
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <h2 className="text-lg font-bold mb-2 text-gray-900">{post.post_title}</h2>
                      <p className="text-gray-700 mb-3">{post.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>❤️ {post.likes.length} likes</span>
                        <span>💬 {post.comments.length} comments</span>
                      </div>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Comments:</h4>
                        <div className="space-y-3">
                          {post.comments.map((comment) => (
                            <div key={comment._id} className="bg-white p-3 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm text-gray-900">
                                      {comment.user_id.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({comment.user_id.email})
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-700">{comment.text}</p>
                                </div>
                                <button
                                  onClick={() => deleteComment(comment._id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 ml-3"
                                >
                                  Delete (-2 pts)
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}