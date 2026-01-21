"use client";

import { CreditCard } from "lucide-react";

export function PaymentSettingsTab() {
  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
        </div>
        <div className="p-4 space-y-4">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-700">Credit/Debit Cards</span>
                <p className="text-xs text-gray-500">Visa, Mastercard, American Express</p>
              </div>
            </div>
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-700">Apple Pay</span>
                <p className="text-xs text-gray-500">Mobile payments with Apple devices</p>
              </div>
            </div>
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                <p className="text-xs text-gray-500">Pay when service is completed</p>
              </div>
            </div>
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <div>
                <span className="text-sm font-medium text-gray-700">Points Redemption</span>
                <p className="text-xs text-gray-500">Allow customers to pay with earned points</p>
              </div>
            </div>
            <input type="checkbox" className="rounded border-gray-300" defaultChecked />
          </label>
        </div>
      </div>

      {/* Payment Gateway */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payment Gateway</h2>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gateway Provider</label>
            <select className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20">
              <option>Stripe</option>
              <option>PayTabs</option>
              <option>Telr</option>
              <option>Network International</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="password"
                defaultValue="sk_live_xxxxxxxxxxxxx"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
              <input
                type="password"
                defaultValue="pk_live_xxxxxxxxxxxxx"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20"
              />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-sm text-gray-700">Enable test mode</span>
          </label>
        </div>
      </div>
    </div>
  );
}
