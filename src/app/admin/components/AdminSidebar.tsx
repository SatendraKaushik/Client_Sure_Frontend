"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Home, 
  Users, 
  BarChart3, 
  FolderOpen, 
  FileText, 
  Play, 
  Trophy, 
  User, 
  LogOut, 
  Search 
} from "lucide-react"

interface AdminSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export default function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  const router = useRouter()

  const sidebarItems = [
    { name: 'Dashboard', icon: Home, path: 'dashboard' },
    { name: 'Users', icon: Users, path: 'users' },
    { name: 'Analytics', icon: BarChart3, path: 'leads' },
    { name: 'Resources', icon: FolderOpen, path: 'resources', subItems: [
      { name: 'PDF Documents', icon: FileText, path: 'pdf-documents' },
      { name: 'Course Videos', icon: Play, path: 'course-videos' }
    ]},
    { name: 'Leaderboard', icon: Trophy, path: 'leaderboard' },
    { name: 'Profile', icon: User, path: 'profile' }
  ]

  const handleLogout = () => {
    router.push('/auth/admin')
  }

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ClientSure</h1>
        <p className="text-slate-400 text-sm mt-1">Admin Dashboard</p>
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-800 text-white placeholder-slate-400 px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <div key={item.name}>
              <button
                onClick={() => setActiveSection(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.path || (item.subItems && item.subItems.some(sub => activeSection === sub.path))
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
              
              {/* Sub Items */}
              {item.subItems && (activeSection === item.path || item.subItems.some(sub => activeSection === sub.path)) && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.name}
                      onClick={() => setActiveSection(subItem.path)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                        activeSection === subItem.path
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' 
                          : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <subItem.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{subItem.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-8 pt-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 hover:text-white transition-all duration-200 hover:transform hover:scale-105 hover:shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}