"use client"

import PricingCard from "./pricing-card"

const plans = [
  {
    id: "basic_plan_001",
    name: "Basic Plan",
    duration: "30 Days",
    price: "299",
    tokensPerDay: "100 tokens/day",
    features: [
      "100 tokens per day",
      "30 days validity",
      "Access to basic resources",
      "Email support",
      "Mobile app access",
    ],
    isPopular: false,
  },
  {
    id: "premium_plan_001",
    name: "Premium Plan",
    duration: "60 Days",
    price: "499",
    tokensPerDay: "100 tokens/day",
    features: [
      "100 tokens per day",
      "60 days validity",
      "Access to premium resources",
      "Priority support",
      "Advanced analytics",
    ],
    isPopular: true,
  },
  {
    id: "pro_plan_001",
    name: "Pro Plan",
    duration: "90 Days",
    price: "999",
    tokensPerDay: "100 tokens/day",
    features: [
      "100 tokens per day",
      "90 days validity",
      "Access to all resources",
      "24/7 phone support",
      "Custom integrations",
      "Advanced security",
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
        <div className="grid md:grid-cols-3 gap-8 mb-12">
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
