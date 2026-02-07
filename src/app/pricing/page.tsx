"use client";

import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out ChartGen",
    features: [
      "5 charts per day",
      "4 chart types",
      "PNG download",
      "5 color themes",
      "ChartGen watermark",
    ],
    cta: "Get Started",
    href: "/",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For professionals who need more",
    features: [
      "Unlimited charts",
      "All chart types",
      "PNG + SVG download",
      "Custom color themes",
      "No watermark",
      "Priority support",
      "API access",
    ],
    cta: "Upgrade to Pro",
    href: "#",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "5 team members",
      "Shared chart library",
      "Brand kit",
      "Analytics dashboard",
      "SSO integration",
    ],
    cta: "Contact Sales",
    href: "#",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{ animationDuration: "4s" }}></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{ animationDuration: "7s" }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <Link href="/" className="inline-block mb-8 text-slate-400 hover:text-slate-200 transition-colors">
            ← Back to ChartGen
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
            Simple Pricing
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the plan that works best for you. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500"
                  : "bg-slate-900/50 border border-slate-800"
              } backdrop-blur-xl`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-200 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                <p className="text-slate-400 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-slate-300">
                    <span className="text-green-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full py-3 px-6 rounded-lg font-semibold text-center transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-slate-200 mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-slate-200 mb-2">Can I cancel anytime?</h3>
              <p className="text-slate-400">Yes! You can cancel your subscription at any time. No questions asked.</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-slate-200 mb-2">What payment methods do you accept?</h3>
              <p className="text-slate-400">We accept all major credit cards and PayPal.</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-slate-200 mb-2">Is there a free trial?</h3>
              <p className="text-slate-400">Yes! The Free plan lets you try all basic features forever.</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <h3 className="font-semibold text-slate-200 mb-2">Do you offer refunds?</h3>
              <p className="text-slate-400">Yes, we offer a 14-day money-back guarantee on all paid plans.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
