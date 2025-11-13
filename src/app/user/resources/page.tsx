"use client"

import { useState, useEffect } from "react"
import { Play, FileText, Download, ExternalLink, FolderOpen, Search, ArrowRight } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Axios from "@/utils/Axios"

interface Resource {
  id: string
  title: string
  type: string
  description: string
  tokenCost: number
  thumbnailUrl?: string
  isAccessedByUser: boolean
  url?: string
}

interface UserStats {
  tokens: number
  monthlyTokens: {
    remaining: number
  }
  subscription: {
    isActive: boolean
  }
}

export default function ResourcesPage() {
  const [accessedResources, setAccessedResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')



  const loadAccessedResources = async () => {
    try {
      const response = await Axios.get('/auth/accessed-resources')
      setAccessedResources(response.data || [])
    } catch (error) {
      console.error('Error loading accessed resources:', error)
    } finally {
      setLoading(false)
    }
  }



  const openResource = async (resource: Resource) => {
    try {
      if (resource.url) {
        window.open(resource.url, '_blank')
      } else {
        const response = await Axios.get(`/resources/${resource.id}`)
        if (response.data.url) {
          window.open(response.data.url, '_blank')
        }
      }
    } catch (error) {
      console.error('Failed to open resource:', error)
    }
  }

  useEffect(() => {
    loadAccessedResources()
  }, [])

  const filteredResources = accessedResources.filter(resource => 
    filter === 'all' || resource.type === filter
  )

  const setLoadingComplete = () => {
    setLoading(false)
  }

  useEffect(() => {
    if (accessedResources.length >= 0) {
      setLoadingComplete()
    }
  }, [accessedResources])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Resources</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your accessed premium resources - ready to view anytime
          </p>
        </div>



        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-2xl shadow-inner">
            <div className="flex space-x-1">
              {[
                { key: 'all', label: 'All', icon: null, count: accessedResources.length },
                { key: 'pdf', label: 'PDFs', icon: FileText, count: accessedResources.filter(r => r.type === 'pdf').length },
                { key: 'video', label: 'Videos', icon: Play, count: accessedResources.filter(r => r.type === 'video').length }
              ].map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.key}
                    onClick={() => setFilter(type.key)}
                    className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 min-w-[120px] justify-center ${
                      filter === type.key
                        ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{type.label}</span>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      filter === type.key
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {type.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-500">Loading your resources...</div>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8 shadow-inner">
              {filter === 'all' ? (
                <FolderOpen className="w-16 h-16 text-gray-400" />
              ) : filter === 'pdf' ? (
                <FileText className="w-16 h-16 text-red-400" />
              ) : (
                <Play className="w-16 h-16 text-blue-400" />
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {filter === 'all' ? 'No Resources Yet' : 
               filter === 'pdf' ? 'No PDF Documents' : 
               'No Videos Found'}
            </h3>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              {filter === 'all' 
                ? 'You haven\'t accessed any premium resources yet. Start exploring our collection to unlock valuable content.'
                : `You haven't accessed any ${filter === 'pdf' ? 'PDF documents' : 'video content'} yet. Browse our ${filter === 'pdf' ? 'document' : 'video'} library to get started.`
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => window.location.href = '/user/dashboard'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                Browse Resources
                <ArrowRight className="w-4 h-4" />
              </button>
              
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="text-gray-600 hover:text-blue-600 px-6 py-4 rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  View All Resources
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Preview Section */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {resource.type === 'video' && resource.url ? (
                    <div className="relative w-full h-full group">
                      <video 
                        className="w-full h-full object-cover"
                        preload="metadata"
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <source src={resource.url} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Play className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                    </div>
                  ) : resource.type === 'pdf' ? (
                    <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-red-600 font-medium">PDF Document</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-xs">Resource</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                      resource.type === 'pdf' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {resource.type.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      Cost: {resource.tokenCost} tokens
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Accessed
                    </span>
                  </div>
                  
                  <button
                    onClick={() => openResource(resource)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Resource
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}