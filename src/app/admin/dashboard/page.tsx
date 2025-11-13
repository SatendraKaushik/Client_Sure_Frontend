"use client"

import { useState } from "react"
import AdminSidebar from "../components/AdminSidebar"
import DashboardContent from "../components/DashboardContent"
import UsersContent from "../components/UsersContent"
import ResourcesContent from "../components/ResourcesContent"
import PDFDocumentsContent from "../components/PDFDocumentsContent"
import CourseVideosContent from "../components/CourseVideosContent"

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />
      case 'users':
        return <UsersContent />
      case 'leads':
        return (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">Leads Management</h1>
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Leads Section</h3>
              <p className="text-gray-600">Leads management functionality will be implemented here</p>
            </div>
          </div>
        )
      case 'resources':
        return <ResourcesContent />
      case 'pdf-documents':
        return (
          <div>
            <div className="p-8 pb-0">
              <h1 className="text-4xl font-bold text-blue-600 mb-8">PDF Documents Management</h1>
            </div>
            <PDFDocumentsContent />
          </div>
        )
      case 'course-videos':
        return (
          <div>
            <div className="p-8 pb-0">
              <h1 className="text-4xl font-bold text-purple-600 mb-8">Course Videos Management</h1>
            </div>
            <CourseVideosContent />
          </div>
        )
      case 'leaderboard':
        return (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">Leaderboard</h1>
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Leaderboard Section</h3>
              <p className="text-gray-600">User rankings and achievements will be displayed here</p>
            </div>
          </div>
        )
      case 'profile':
        return (
          <div className="p-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">Admin Profile</h1>
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">👤</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Admin Profile</h3>
              <p className="text-gray-600">Admin profile settings and information</p>
            </div>
          </div>
        )
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  )
}