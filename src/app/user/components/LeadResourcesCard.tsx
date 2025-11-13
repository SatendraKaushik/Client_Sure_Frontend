export default function LeadResourcesCard() {
  const resources = [
    {
      title: "Email Templates",
      description: "Professional email templates for outreach",
      icon: "📧",
      count: "25+ Templates"
    },
    {
      title: "Lead Lists",
      description: "Curated lead databases by industry",
      icon: "📊",
      count: "10K+ Leads"
    },
    {
      title: "Scripts & Guides",
      description: "Proven sales scripts and call guides",
      icon: "📝",
      count: "15+ Scripts"
    },
    {
      title: "Tools & Software",
      description: "Recommended tools for lead generation",
      icon: "🛠️",
      count: "20+ Tools"
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Lead Resources</h2>
          <p className="text-gray-600">Everything you need to generate quality leads</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          Premium Access
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((resource, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{resource.icon}</div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                {resource.count}
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {resource.title}
            </h3>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center">
              Access Now
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold">
          View All Resources
        </button>
      </div>
    </div>
  )
}