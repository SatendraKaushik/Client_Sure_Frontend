"use client"

import { useState } from "react"
import PurchaseModal from "./purchase-modal"

interface PricingCardProps {
  id: string
  name: string
  duration: string
  price: string
  tokensPerDay: string
  bonusTokens: number
  features: string[]
  isPopular: boolean
}

export default function PricingCard({ id, name, duration, price, tokensPerDay, bonusTokens, features, isPopular }: PricingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div
      className={`relative rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 ${
        isPopular ? "border-2 border-blue-600 shadow-lg" : "border border-gray-200 bg-white"
      }`}
    >

      <div className="bg-white p-8">
        {/* Plan Name and Duration */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-500 mb-6">{duration}</p>

        {/* Price Section */}
        <div className="bg-green-50 rounded-xl p-6 mb-6">
          <div className="text-4xl font-bold text-gray-900 mb-2">₹{price}</div>
          <p className="text-gray-600 text-sm">{tokensPerDay}</p>
          {bonusTokens > 0 && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <p className="text-green-700 font-semibold text-sm">🎁 +{bonusTokens.toLocaleString()} Bonus Tokens</p>
            </div>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
            isPopular ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white"
          }`}
        >
          Get Started
        </button>

        {/* Purchase Modal */}
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={{ id, name, price, duration, tokensPerDay, bonusTokens }}
        />
      </div>
    </div>
  )
}
