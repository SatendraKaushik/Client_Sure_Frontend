export default function CoursesCard() {
  const courses = [
    {
      title: "Lead Generation Mastery",
      description: "Complete guide to generating high-quality leads",
      duration: "4 hours",
      level: "Beginner",
      progress: 75,
      image: "🎯"
    },
    {
      title: "Sales Funnel Optimization",
      description: "Optimize your sales funnel for maximum conversion",
      duration: "3 hours",
      level: "Intermediate",
      progress: 45,
      image: "📈"
    },
    {
      title: "Email Marketing Automation",
      description: "Automate your email campaigns for better results",
      duration: "5 hours",
      level: "Advanced",
      progress: 20,
      image: "✉️"
    },
    {
      title: "Social Media Lead Gen",
      description: "Generate leads through social media platforms",
      duration: "2.5 hours",
      level: "Beginner",
      progress: 0,
      image: "📱"
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Courses</h2>
          <p className="text-gray-600">Master the art of lead generation and sales</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          4 Courses Available
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{course.image}</div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                {course.level}
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
              {course.title}
            </h3>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Duration: {course.duration}</span>
              <span className="text-sm text-gray-500">{course.progress}% Complete</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all duration-300">
              {course.progress > 0 ? 'Continue Course' : 'Start Course'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold">
          Browse All Courses
        </button>
      </div>
    </div>
  )
}