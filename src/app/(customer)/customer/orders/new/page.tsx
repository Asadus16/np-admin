"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Gift,
  Star,
  Minus,
  Plus,
  X,
  ShoppingCart,
  Sparkles,
  Droplets,
  Zap,
  Wind,
  Bug,
  Paintbrush,
  Home,
  Wrench,
} from "lucide-react";

// Static data
const categories = [
  { id: "cleaning", name: "Cleaning", icon: Sparkles, color: "bg-gray-100 text-gray-600" },
  { id: "plumbing", name: "Plumbing", icon: Droplets, color: "bg-gray-100 text-gray-600" },
  { id: "electrical", name: "Electrical", icon: Zap, color: "bg-gray-100 text-gray-600" },
  { id: "hvac", name: "AC & HVAC", icon: Wind, color: "bg-gray-100 text-gray-600" },
  { id: "pest", name: "Pest Control", icon: Bug, color: "bg-gray-100 text-gray-600" },
  { id: "painting", name: "Painting", icon: Paintbrush, color: "bg-gray-100 text-gray-600" },
  { id: "home", name: "Home Repair", icon: Home, color: "bg-gray-100 text-gray-600" },
  { id: "handyman", name: "Handyman", icon: Wrench, color: "bg-gray-100 text-gray-600" },
];

const vendors = [
  { id: "v1", name: "Quick Fix Plumbing", rating: 4.9, reviews: 128, price: "$$", available: true, eta: "Tomorrow" },
  { id: "v2", name: "Pro Plumbers UAE", rating: 4.7, reviews: 89, price: "$$$", available: true, eta: "Today" },
  { id: "v3", name: "24/7 Plumbing Services", rating: 4.5, reviews: 234, price: "$", available: true, eta: "2 days" },
  { id: "v4", name: "Elite Plumbing Co", rating: 4.8, reviews: 156, price: "$$$", available: false, eta: "-" },
];

const services = [
  { id: "s1", name: "Pipe Inspection", description: "Visual inspection of all visible pipes", price: 100, duration: "30 min" },
  { id: "s2", name: "Pipe Repair", description: "Repair of leaking or damaged pipes", price: 200, duration: "1-2 hr" },
  { id: "s3", name: "Drain Cleaning", description: "Professional drain unclogging", price: 150, duration: "1 hr" },
  { id: "s4", name: "Water Heater Service", description: "Maintenance and repair", price: 250, duration: "1-2 hr" },
  { id: "s5", name: "Faucet Installation", description: "New faucet installation", price: 120, duration: "1 hr" },
];

const addresses = [
  { id: "a1", label: "Home", address: "123 Sheikh Zayed Road, Dubai Marina", isDefault: true },
  { id: "a2", label: "Office", address: "456 Business Bay Boulevard", isDefault: false },
];

const paymentMethods = [
  { id: "card1", type: "visa", last4: "4242", isDefault: true },
  { id: "card2", type: "mastercard", last4: "8888", isDefault: false },
  { id: "cod", type: "cod", label: "Cash on Delivery", isDefault: false },
  { id: "points", type: "points", label: "Pay with Points (1,850 pts)", isDefault: false },
];

const timeSlots = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

const steps = [
  { id: 1, name: "Category" },
  { id: 2, name: "Vendor" },
  { id: 3, name: "Services" },
  { id: 4, name: "Schedule" },
  { id: 5, name: "Payment" },
  { id: 6, name: "Confirm" },
];

export default function NewOrderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("a1");
  const [orderType, setOrderType] = useState<"now" | "schedule" | "recurring">("schedule");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("card1");
  const [couponCode, setCouponCode] = useState("");
  const [notes, setNotes] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getCartTotal = () => {
    return services
      .filter((s) => selectedServices.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedCategory !== null;
      case 2: return selectedVendor !== null;
      case 3: return selectedServices.length > 0;
      case 4: return orderType === "now" || (selectedDate && selectedTime);
      case 5: return selectedPayment !== null;
      default: return true;
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === cat.id
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg ${cat.color} flex items-center justify-center mx-auto mb-3`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a Vendor</h2>
            <div className="space-y-3">
              {vendors.map((vendor) => (
                <button
                  key={vendor.id}
                  onClick={() => vendor.available && setSelectedVendor(vendor.id)}
                  disabled={!vendor.available}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedVendor === vendor.id
                      ? "border-gray-900 bg-gray-50"
                      : vendor.available
                      ? "border-gray-200 hover:border-gray-300"
                      : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {vendor.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{vendor.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          <span>{vendor.rating}</span>
                          <span>({vendor.reviews} reviews)</span>
                          <span>•</span>
                          <span>{vendor.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {vendor.available ? (
                        <>
                          <span className="text-xs text-green-600 font-medium">Available</span>
                          <p className="text-xs text-gray-500">ETA: {vendor.eta}</p>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">Unavailable</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Services</h2>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedServices.includes(service.id)
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{service.duration}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium text-gray-900">{formatCurrency(service.price)}</p>
                      <button
                        onClick={() => handleServiceToggle(service.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedServices.includes(service.id)
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {selectedServices.includes(service.id) ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Plus className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedServices.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{selectedServices.length} service(s) selected</span>
                  <span className="font-medium text-gray-900">Total: {formatCurrency(getCartTotal())}</span>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Address</h2>
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedAddress === addr.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{addr.label}</p>
                        <p className="text-sm text-gray-500">{addr.address}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule Type</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "now", label: "Order Now", desc: "As soon as possible" },
                  { id: "schedule", label: "Schedule Later", desc: "Pick date & time" },
                  { id: "recurring", label: "Recurring", desc: "Set frequency" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setOrderType(type.id as typeof orderType)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      orderType === type.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="font-medium text-gray-900 text-sm">{type.label}</p>
                    <p className="text-xs text-gray-500">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {orderType !== "now" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Select Time Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="">Choose a time slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-2">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setSelectedPayment(pm.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedPayment === pm.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {pm.type === "visa" || pm.type === "mastercard" ? (
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      ) : pm.type === "points" ? (
                        <Gift className="h-5 w-5 text-gray-500" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {pm.type === "visa" ? `Visa •••• ${pm.last4}` :
                           pm.type === "mastercard" ? `Mastercard •••• ${pm.last4}` :
                           pm.label}
                        </p>
                        {pm.isDefault && (
                          <span className="text-xs text-gray-500">Default</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Apply
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for the technician..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        );

      case 6:
        const selectedVendorData = vendors.find((v) => v.id === selectedVendor);
        const selectedServicesData = services.filter((s) => selectedServices.includes(s.id));
        const selectedAddressData = addresses.find((a) => a.id === selectedAddress);

        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Vendor</p>
                <p className="font-medium text-gray-900">{selectedVendorData?.name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Services</p>
                {selectedServicesData.map((s) => (
                  <div key={s.id} className="flex justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="font-medium">{formatCurrency(s.price)}</span>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm text-gray-900">{selectedAddressData?.address}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Schedule</p>
                <p className="text-sm text-gray-900">
                  {orderType === "now" ? "As soon as possible" : `${selectedDate} at ${selectedTime}`}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  +{Math.floor(getCartTotal() / 10)} points will be earned
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/customer/orders"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">New Order</h1>
          <p className="text-sm text-gray-500">Step {currentStep} of {steps.length}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-start pb-2">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > step.id
                    ? "bg-gray-900 text-white"
                    : currentStep === step.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className="text-xs text-gray-500 mt-1 hidden sm:block whitespace-nowrap">{step.name}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-4 ${currentStep > step.id ? "bg-gray-900" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
            currentStep === 1
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          }`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        {currentStep === steps.length ? (
          <Link
            href="/customer/orders"
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Place Order
          </Link>
        ) : (
          <button
            onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
            disabled={!canProceed()}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
              canProceed()
                ? "text-white bg-gray-900 hover:bg-gray-800"
                : "text-gray-400 bg-gray-100 cursor-not-allowed"
            }`}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}
