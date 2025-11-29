"use client"

import PricingCard from "./pricing-card"

const plans = [
  {
    id: "basic_plan_001",
    name: "Basic Plan",
    duration: "30 Days",
    price: "299",
    tokensPerDay: "100 tokens/day",
    bonusTokens: 0,
    features: [
      "100 tokens per day",
      "30 days validity",
      "Access to basic resources",
      "Email support",
    ],
    isPopular: false,
  },
  {
    id: "standard_plan_001",
    name: "Standard Plan",
    duration: "95 Days",
    price: "799",
    tokensPerDay: "100 tokens/day",
    bonusTokens: 500,
    features: [
      "100 tokens per day",
      "95 days validity",
      "Access to standard resources",
      "Priority email support",
    ],
    isPopular: false,
  },
  {
    id: "premium_plan_001",
    name: "Premium Plan",
    duration: "190 Days",
    price: "1699",
    tokensPerDay: "100 tokens/day",
    bonusTokens: 1000,
    features: [
      "100 tokens per day",
      "190 days validity",
      "Access to premium resources",
      "Priority support",
      "Advanced analytics",
    ],
    isPopular: true,
  },
  {
    id: "pro_plan_001",
    name: "Pro Plan",
    duration: "485 Days",
    price: "3599",
    tokensPerDay: "100 tokens/day",
    bonusTokens: 12000,
    features: [
      "100 tokens per day",
      "485 days validity",
      "Access to all resources",
      "24/7 phone support",
      "Custom integrations",
    ],
    isPopular: false,
  },
]

export default function PricingSection() {
  return (
    <section className="bg-gray-50 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-blue-600 mb-4">Choose Your Perfect Plan</h2>
          <p className="text-lg text-gray-600">Flexible pricing options designed to grow with your business</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        {/* Footer Text */}
        <div className="text-center">
          <p className="text-gray-600">All plans include email support • Instant activation • Cancel anytime</p>
        </div>
      </div>
    </section>
  )
}
