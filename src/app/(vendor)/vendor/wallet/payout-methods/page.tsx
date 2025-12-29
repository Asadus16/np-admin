"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Building2, Plus, Check, MoreVertical } from "lucide-react";

const payoutMethods = [
  { id: 1, type: "bank", name: "Chase Bank", last4: "4567", isDefault: true },
  { id: 2, type: "card", name: "Visa Debit", last4: "8901", isDefault: false },
];

export default function PayoutMethodsPage() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/wallet" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Payout Methods</h1>
          <p className="text-sm text-gray-500 mt-1">Manage how you receive your earnings</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Your Payout Methods</h2>
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Plus className="h-4 w-4 mr-1" />
              Add Method
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {payoutMethods.map((method) => (
              <div key={method.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {method.type === "bank" ? (
                      <Building2 className="h-5 w-5 text-gray-600" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{method.name}</p>
                      {method.isDefault && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-50 text-green-700 rounded-full">
                          <Check className="h-3 w-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Ending in {method.last4}</p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === method.id ? null : method.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                  {openMenu === method.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-0 z-50 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                        {!method.isDefault && (
                          <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                            Set as Default
                          </button>
                        )}
                        <button className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                          Edit
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100">
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Payout Schedule</h3>
          <p className="text-sm text-gray-600">
            Payouts are processed every Friday. Funds typically arrive within 2-3 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
