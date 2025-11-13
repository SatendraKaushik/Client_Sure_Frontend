"use client"

import { useState } from "react"
import PDFDocumentsContent from "./PDFDocumentsContent"
import CourseVideosContent from "./CourseVideosContent"

export default function ResourcesContent() {
  const [activeTab, setActiveTab] = useState('pdf')

  return (
    <div>
      <div className="p-8 pb-0">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Resources Management</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'pdf' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📄 PDF Documents
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'videos' 
                ? 'bg-purple-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🎥 Course Videos
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'pdf' && <PDFDocumentsContent />}
      {activeTab === 'videos' && <CourseVideosContent />}
    </div>
  )
}