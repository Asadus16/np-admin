"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2, Check, Star } from "lucide-react";

// Static payment methods data
const initialPaymentMethods = [
  {
    id: "1",
    type: "visa",
    last4: "4242",
    expiry: "12/26",
    isDefault: true,
    cardHolder: "AHMED AL MAKTOUM",
  },
  {
    id: "2",
    type: "mastercard",
    last4: "8888",
    expiry: "08/25",
    isDefault: false,
    cardHolder: "AHMED AL MAKTOUM",
  },
];

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardHolder: "",
  });

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
  };

  const handleRemove = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
  };

  const handleAddCard = () => {
    // Static - just add a mock card
    const newPaymentMethod = {
      id: Date.now().toString(),
      type: "visa",
      last4: newCard.cardNumber.slice(-4) || "0000",
      expiry: newCard.expiry || "01/28",
      isDefault: paymentMethods.length === 0,
      cardHolder: newCard.cardHolder.toUpperCase() || "CARD HOLDER",
    };
    setPaymentMethods((prev) => [...prev, newPaymentMethod]);
    setShowAddCard(false);
    setNewCard({ cardNumber: "", expiry: "", cvv: "", cardHolder: "" });
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return (
          <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">VISA</span>
          </div>
        );
      case "mastercard":
        return (
          <div className="w-10 h-6 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">MC</span>
          </div>
        );
      default:
        return <CreditCard className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Payment Methods</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your saved payment methods</p>
        </div>
        <button
          onClick={() => setShowAddCard(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </button>
      </div>

      {/* Add Card Form */}
      {showAddCard && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Card</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard((prev) => ({ ...prev, cardNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={newCard.expiry}
                onChange={(e) => setNewCard((prev) => ({ ...prev, expiry: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={newCard.cvv}
                onChange={(e) => setNewCard((prev) => ({ ...prev, cvv: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                placeholder="JOHN DOE"
                value={newCard.cardHolder}
                onChange={(e) => setNewCard((prev) => ({ ...prev, cardHolder: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowAddCard(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCard}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              Add Card
            </button>
          </div>
        </div>
      )}

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No payment methods saved</p>
            <button
              onClick={() => setShowAddCard(true)}
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Card
            </button>
          </div>
        ) : (
          paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className={`bg-white border rounded-lg p-4 ${
                pm.isDefault ? "border-gray-900" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getCardIcon(pm.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        •••• •••• •••• {pm.last4}
                      </p>
                      {pm.isDefault && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-900 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {pm.cardHolder} &bull; Expires {pm.expiry}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!pm.isDefault && (
                    <button
                      onClick={() => handleSetDefault(pm.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Set as default"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(pm.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Remove card"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Security Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-200 rounded-lg">
            <CreditCard className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Secure Payment Processing</p>
            <p className="text-xs text-gray-500 mt-1">
              Your payment information is encrypted and securely stored. We never store your full card number or CVV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
