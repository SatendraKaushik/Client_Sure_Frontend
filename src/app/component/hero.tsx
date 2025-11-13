export default function Hero() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Rating Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2">
            <span className="text-xl">⭐</span>
            <span className="text-blue-600 font-medium">4.8/5 Average User Ratings</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Your Gateway to <span className="text-blue-900">Greater</span>
          <br />
          <span className="text-blue-900">Client Opportunities</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          Search from <span className="text-teal-600 font-semibold">thousands of curated client projects</span> and
          companies in one place with <span className="text-blue-600 font-semibold">ClientSure</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition">
            Get Started Free
          </button>
          <button className="bg-gray-100 text-gray-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 transition">
            Explore Projects
          </button>
        </div>
      </div>
    </section>
  )
}
