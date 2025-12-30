"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Percent } from "lucide-react";

const taxItems = [
  { id: 1, name: "State Tax", rate: 8.5, type: "percentage" },
  { id: 2, name: "Service Fee", rate: 5, type: "fixed" },
];

export default function TaxesSettingsPage() {
  const [taxes, setTaxes] = useState(taxItems);
  const [isLoading, setIsLoading] = useState(false);

  const removeTax = (id: number) => {
    setTaxes(taxes.filter((t) => t.id !== id));
  };

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/vendor/settings" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Taxes & Fees</h1>
          <p className="text-sm text-gray-500 mt-1">Configure taxes and additional fees</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Tax & Fee Items</h2>
            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {taxes.map((tax) => (
              <div key={tax.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Percent className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tax.name}</p>
                    <p className="text-xs text-gray-500">
                      {tax.type === "percentage" ? `${tax.rate}%` : `$${tax.rate} flat`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={tax.rate}
                    onChange={(e) => {
                      setTaxes(taxes.map((t) =>
                        t.id === tax.id ? { ...t, rate: parseFloat(e.target.value) } : t
                      ));
                    }}
                    className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400"
                  />
                  <select
                    value={tax.type}
                    onChange={(e) => {
                      setTaxes(taxes.map((t) =>
                        t.id === tax.id ? { ...t, type: e.target.value } : t
                      ));
                    }}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">$</option>
                  </select>
                  <button
                    onClick={() => removeTax(tax.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Taxes and fees will be automatically calculated and added to customer invoices.
          </p>
        </div>
      </div>
    </div>
  );
}
