"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Crown,
  CreditCard,
  Download,
  Calendar,
  AlertCircle,
  Zap,
  Users,
  Star,
  TrendingUp,
  Shield,
  Clock,
  X,
} from "lucide-react";

const currentPlan = {
  name: "Professional",
  price: "AED 299",
  billingCycle: "monthly",
  nextBillingDate: "January 15, 2025",
  status: "active",
  features: [
    "Up to 10 team members",
    "Unlimited orders",
    "Priority support",
    "Advanced analytics",
    "Custom branding",
  ],
};

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "AED 99",
    billingCycle: "monthly",
    description: "Perfect for small businesses just getting started",
    features: [
      "Up to 3 team members",
      "100 orders per month",
      "Email support",
      "Basic analytics",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "AED 299",
    billingCycle: "monthly",
    description: "Best for growing businesses with active teams",
    features: [
      "Up to 10 team members",
      "Unlimited orders",
      "Priority support",
      "Advanced analytics",
      "Custom branding",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "AED 599",
    billingCycle: "monthly",
    description: "For large organizations with advanced needs",
    features: [
      "Unlimited team members",
      "Unlimited orders",
      "Dedicated account manager",
      "Custom integrations",
      "White-label solution",
      "SLA guarantee",
    ],
    popular: false,
  },
];

const invoices = [
  { id: "INV-001", date: "December 15, 2024", amount: "AED 299", status: "paid" },
  { id: "INV-002", date: "November 15, 2024", amount: "AED 299", status: "paid" },
  { id: "INV-003", date: "October 15, 2024", amount: "AED 299", status: "paid" },
  { id: "INV-004", date: "September 15, 2024", amount: "AED 299", status: "paid" },
];

const paymentMethods = [
  { id: 1, type: "visa", last4: "4242", expiry: "12/26", isDefault: true },
  { id: 2, type: "mastercard", last4: "8888", expiry: "03/25", isDefault: false },
];

export default function SubscriptionPage() {
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getCardIcon = (type: string) => {
    return <CreditCard className="h-5 w-5 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/settings" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Subscription & Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your subscription plan and billing information</p>
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{currentPlan.name} Plan</h2>
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {currentPlan.price}/month
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowChangePlanModal(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Change Plan
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Billing Cycle</p>
                <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{currentPlan.billingCycle}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Next Billing Date</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{currentPlan.nextBillingDate}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                <p className="text-sm font-medium text-green-600 mt-1 capitalize">{currentPlan.status}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900 mb-3">Plan Features</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
            </div>
            <button
              onClick={() => setShowAddCardModal(true)}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              + Add Card
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {paymentMethods.map((method) => (
              <div key={method.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getCardIcon(method.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {method.type} ending in {method.last4}
                    </p>
                    <p className="text-xs text-gray-500">Expires {method.expiry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.isDefault && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                      Default
                    </span>
                  )}
                  <button className="text-sm text-gray-500 hover:text-gray-700">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Billing History</h2>
            </div>
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{invoice.id}</p>
                  <p className="text-xs text-gray-500">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{invoice.amount}</span>
                  <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded capitalize">
                    {invoice.status}
                  </span>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Download className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">Usage This Month</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Team Members</span>
                <span className="text-sm font-medium text-gray-900">4 / 10</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "40%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Orders</span>
                <span className="text-sm font-medium text-gray-900">156 / Unlimited</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "15%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="text-sm font-medium text-gray-900">2.4 GB / 10 GB</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "24%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">Cancel Subscription</h3>
            <p className="text-sm text-gray-500 mt-1">
              If you cancel your subscription, you will lose access to all premium features at the end of your billing period.
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50">
            Cancel Plan
          </button>
        </div>
      </div>

      {/* Change Plan Modal */}
      {showChangePlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Choose a Plan</h2>
              <button
                onClick={() => setShowChangePlanModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? "border-gray-900 bg-gray-50"
                        : plan.popular
                        ? "border-blue-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-sm text-gray-500">/{plan.billingCycle}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {currentPlan.name.toLowerCase() === plan.id && (
                      <div className="mt-4 text-center">
                        <span className="text-sm font-medium text-gray-500">Current Plan</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowChangePlanModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={!selectedPlan || selectedPlan === "professional"}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Add Payment Method</h2>
              <button
                onClick={() => setShowAddCardModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="defaultCard" className="rounded border-gray-300" />
                <label htmlFor="defaultCard" className="text-sm text-gray-600">
                  Set as default payment method
                </label>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddCardModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800">
                Add Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
