import React, { Component } from 'react'
import  Header  from '../components/Header'
import { Leaf, Droplets, Sun, Sparkles, Check } from 'lucide-react'
export function SubscriptionPlans() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      icon: Leaf,
      color: 'from-gray-400 to-gray-500',
      features: [
        'Track 1 plant',
        'Basic dashboard',
        'Limited AI recommendations',
        'Light + moisture only',
      ],
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-400 text-white cursor-not-allowed',
      popular: false,
    },
    {
      name: 'Basic',
      price: '$4.99',
      period: 'per month',
      icon: Droplets,
      color: 'from-sage to-olive',
      features: [
        'Track up to 3 plants',
        'Full dashboard',
        'AI recommendations',
        '7-day history',
        'Email support',
      ],
      buttonText: 'Upgrade to Basic',
      buttonStyle:
        'bg-gradient-to-r from-sage to-olive text-white hover:shadow-lg hover:scale-105',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      icon: Sparkles,
      color: 'from-olive to-darkForest',
      features: [
        'Unlimited plants',
        'Advanced AI (Gemini) care',
        'Predictive watering model',
        'Real-time alerts',
        'Unlimited history',
        'Priority support',
      ],
      buttonText: 'Upgrade to Pro',
      buttonStyle:
        'bg-gradient-to-r from-olive to-darkForest text-white hover:shadow-xl hover:scale-105',
      popular: true,
    },
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-offWhite to-sand">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-darkForest mb-4">
            Subscription Plans
          </h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan for your plant care needs
          </p>
        </div>
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative bg-white rounded-3xl shadow-xl p-8 border-2 ${plan.popular ? 'border-sage scale-105' : 'border-gray-200'} transition-all hover:shadow-2xl`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-sage to-olive text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>
                {/* Plan Name */}
                <h2 className="text-2xl font-bold text-darkForest text-center mb-2">
                  {plan.name}
                </h2>
                {/* Price */}
                <div className="text-center mb-6">
                  <span className="text-5xl font-bold text-darkForest">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">/ {plan.period}</span>
                </div>
                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-sage/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-sage" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                {/* Upgrade Button */}
                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.buttonStyle}`}
                  disabled={plan.name === 'Free'}
                >
                  {plan.buttonText}
                </button>
              </div>
            )
          })}
        </div>
        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            All plans include a 14-day free trial. Cancel anytime.
          </p>
        </div>
      </main>
    </div>
  )
}

export default SubscriptionPlans; 
