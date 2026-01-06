"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Star,
  Plus,
  ShoppingCart,
  Loader2,
  AlertCircle,
  Banknote,
  Wallet,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getCustomerCategories, getCustomerVendors, getCustomerVendor, formatDistance, formatPrice } from "@/lib/customerVendor";
import { getAddresses, Address } from "@/lib/address";
import { getPaymentMethods, PaymentMethod } from "@/lib/paymentMethod";
import { createOrder, validateCoupon } from "@/lib/order";
import { CustomerCategory, CustomerVendor, CustomerVendorService, CustomerVendorSubService, CreateOrderData } from "@/types/order";

// Step definitions - 4 main steps, step 4 has sub-steps
const steps = [
  { id: 1, name: "Category" },
  { id: 2, name: "Vendor" },
  { id: 3, name: "Services" },
  { id: 4, name: "Checkout" },
];

// Checkout sub-steps
const checkoutSubSteps = [
  { id: 1, name: "Address & Schedule" },
  { id: 2, name: "Payment" },
  { id: 3, name: "Summary" },
];

interface SelectedItem {
  subService: CustomerVendorSubService;
  serviceName: string;
  quantity: number;
}

export default function NewOrderPage() {
  const router = useRouter();

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutSubStep, setCheckoutSubStep] = useState(1);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Data states
  const [categories, setCategories] = useState<CustomerCategory[]>([]);
  const [vendors, setVendors] = useState<CustomerVendor[]>([]);
  const [selectedVendorDetails, setSelectedVendorDetails] = useState<CustomerVendor | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Selection states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<"now" | "schedule" | "recurring">("schedule");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [recurringFrequency, setRecurringFrequency] = useState<"weekly" | "biweekly" | "monthly">("weekly");
  const [paymentType, setPaymentType] = useState<"card" | "cash" | "wallet">("card");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [notes, setNotes] = useState("");

  // Expanded services state for accordion
  const [expandedServices, setExpandedServices] = useState<string[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getSubtotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.subService.price * item.quantity, 0);
  };

  const getTax = () => {
    const subtotal = getSubtotal();
    const discount = appliedCoupon?.discount || 0;
    return Math.round((subtotal - discount) * 0.05 * 100) / 100;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const discount = appliedCoupon?.discount || 0;
    const tax = getTax();
    return subtotal - discount + tax;
  };

  const getTotalDuration = () => {
    return selectedItems.reduce((sum, item) => sum + item.subService.duration * item.quantity, 0);
  };

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load vendors when category is selected
  useEffect(() => {
    if (selectedCategory) {
      loadVendors();
    }
  }, [selectedCategory]);

  // Load vendor details when vendor is selected
  useEffect(() => {
    if (selectedVendor) {
      loadVendorDetails();
    }
  }, [selectedVendor]);

  // Load addresses and payment methods when reaching checkout
  useEffect(() => {
    if (currentStep === 4) {
      loadCheckoutData();
    }
  }, [currentStep]);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomerCategories();
      setCategories(response.data);
    } catch (err) {
      setError("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomerVendors({
        category: selectedCategory || undefined,
        sort: "distance",
      });
      setVendors(response.data);
    } catch (err) {
      setError("Failed to load vendors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadVendorDetails = async () => {
    if (!selectedVendor) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomerVendor(selectedVendor);
      setSelectedVendorDetails(response.data);
      // Expand first service by default
      if (response.data.services && response.data.services.length > 0) {
        setExpandedServices([response.data.services[0].id]);
      }
    } catch (err) {
      setError("Failed to load vendor details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCheckoutData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [addressResponse, paymentResponse] = await Promise.all([
        getAddresses(),
        getPaymentMethods(),
      ]);
      setAddresses(addressResponse.data);
      setPaymentMethods(paymentResponse.data);

      // Auto-select primary/default
      const primaryAddress = addressResponse.data.find((a) => a.is_primary);
      if (primaryAddress) setSelectedAddress(primaryAddress.id);

      const defaultPayment = paymentResponse.data.find((p) => p.is_default);
      if (defaultPayment) setSelectedPaymentMethod(defaultPayment.id);
    } catch (err) {
      setError("Failed to load checkout data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = (subService: CustomerVendorSubService, serviceName: string) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.subService.id === subService.id);
      if (existing) {
        return prev.filter((item) => item.subService.id !== subService.id);
      }
      return [...prev, { subService, serviceName, quantity: 1 }];
    });
  };

  const handleQuantityChange = (subServiceId: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        if (item.subService.id === subServiceId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);
    try {
      const response = await validateCoupon(couponCode, getSubtotal());
      setAppliedCoupon({
        code: response.data.code,
        discount: response.data.discount,
      });
      setCouponError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid coupon code";
      setCouponError(errorMessage);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedCategory !== null;
      case 2:
        return selectedVendor !== null;
      case 3:
        return selectedItems.length > 0;
      case 4:
        if (checkoutSubStep === 1) {
          if (selectedAddress === null) return false;
          if (orderType === "now") return true;
          return selectedDate !== "" && selectedTime !== "";
        }
        if (checkoutSubStep === 2) {
          return paymentType === "cash" || paymentType === "wallet" || (paymentType === "card" && selectedPaymentMethod !== null);
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 4) {
      if (checkoutSubStep < 3) {
        setCheckoutSubStep(checkoutSubStep + 1);
      } else {
        handlePlaceOrder();
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 4 && checkoutSubStep > 1) {
      setCheckoutSubStep(checkoutSubStep - 1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 4) {
        setCheckoutSubStep(1);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedVendor || !selectedAddress) return;

    setSubmitting(true);
    setError(null);

    try {
      // For "Order Now", use today's date and current time
      let scheduledDate = selectedDate;
      let scheduledTime = selectedTime;

      if (orderType === "now") {
        const now = new Date();
        scheduledDate = now.toISOString().split("T")[0];
        // Round up to next 30-minute slot
        const minutes = now.getMinutes();
        const roundedMinutes = minutes < 30 ? 30 : 0;
        const hours = minutes < 30 ? now.getHours() : now.getHours() + 1;
        scheduledTime = `${hours.toString().padStart(2, "0")}:${roundedMinutes.toString().padStart(2, "0")}`;
      }

      const orderData: CreateOrderData = {
        vendor_id: selectedVendor,
        address_id: selectedAddress,
        payment_type: paymentType,
        payment_method_id: paymentType === "card" ? selectedPaymentMethod || undefined : undefined,
        coupon_code: appliedCoupon?.code,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        notes: notes || undefined,
        items: selectedItems.map((item) => ({
          sub_service_id: item.subService.id,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(orderData);
      router.push(`/customer/orders/${response.data.id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to place order";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleServiceExpanded = (serviceId: string) => {
    setExpandedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Time slots (30-minute intervals)
  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  ];

  const renderStepContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Category</h2>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No categories available</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedVendor(null);
                      setSelectedItems([]);
                      setVendors([]);
                      setCurrentStep(2); // Auto-advance to vendor selection
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedCategory === cat.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 rounded-lg object-cover mx-auto mb-3"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <span className="text-lg font-medium text-gray-600">
                          {cat.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <p className="text-sm font-medium text-gray-900 text-center">{cat.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose a Vendor</h2>
            <p className="text-sm text-gray-500 mb-4">Sorted by distance (nearest first)</p>
            {vendors.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No vendors available for this category</p>
            ) : (
              <div className="space-y-3">
                {vendors.map((vendor) => (
                  <button
                    key={vendor.id}
                    onClick={() => {
                      if (vendor.available) {
                        setSelectedVendor(vendor.id);
                        setSelectedItems([]);
                        setCurrentStep(3); // Auto-advance to service selection
                      }
                    }}
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
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">{vendor.logo}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{vendor.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-amber-500 fill-current" />
                              <span>{vendor.rating}</span>
                            </div>
                            <span>({vendor.reviews_count} reviews)</span>
                            {vendor.starting_price && (
                              <>
                                <span className="hidden sm:inline">|</span>
                                <span className="hidden sm:inline">From {formatCurrency(vendor.starting_price)}</span>
                              </>
                            )}
                          </div>
                          {vendor.description && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{vendor.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        {vendor.available ? (
                          <>
                            <span className="text-xs text-green-600 font-medium">Available</span>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {formatDistance(vendor.distance_km)}
                            </p>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Services</h2>
            {!selectedVendorDetails?.services || selectedVendorDetails.services.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No services available from this vendor</p>
            ) : (
              <div className="space-y-4">
                {selectedVendorDetails.services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleServiceExpanded(service.id)}
                      className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-500">{service.name.charAt(0)}</span>
                          </div>
                        )}
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.sub_services.length} sub-services</p>
                        </div>
                      </div>
                      {expandedServices.includes(service.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {expandedServices.includes(service.id) && (
                      <div className="p-4 space-y-3 border-t border-gray-200">
                        {service.sub_services.map((subService) => {
                          const isSelected = selectedItems.some((item) => item.subService.id === subService.id);
                          const selectedItem = selectedItems.find((item) => item.subService.id === subService.id);

                          return (
                            <div
                              key={subService.id}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                isSelected ? "border-gray-900 bg-gray-50" : "border-gray-200"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900">{subService.name}</p>
                                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                    <span>{formatCurrency(subService.price)}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{subService.duration} min</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {isSelected && selectedItem && (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuantityChange(subService.id, -1);
                                        }}
                                        className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                                      >
                                        <span className="w-4 h-4 flex items-center justify-center text-gray-600">-</span>
                                      </button>
                                      <span className="w-8 text-center font-medium">{selectedItem.quantity}</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuantityChange(subService.id, 1);
                                        }}
                                        className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                                      >
                                        <span className="w-4 h-4 flex items-center justify-center text-gray-600">+</span>
                                      </button>
                                    </div>
                                  )}
                                  <button
                                    onClick={() => handleItemToggle(subService, service.name)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      isSelected
                                        ? "bg-gray-900 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                  >
                                    {isSelected ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {selectedItems.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {selectedItems.length} service(s), {selectedItems.reduce((sum, i) => sum + i.quantity, 0)} item(s)
                      </span>
                      <span className="font-medium text-gray-900">Subtotal: {formatCurrency(getSubtotal())}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Estimated duration: {getTotalDuration()} minutes
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return renderCheckoutContent();

      default:
        return null;
    }
  };

  const renderCheckoutContent = () => {
    switch (checkoutSubStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Address</h2>
              {addresses.length === 0 ? (
                <div className="text-center py-6 border border-gray-200 rounded-lg">
                  <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 mb-3">No addresses saved</p>
                  <Link
                    href="/customer/addresses"
                    className="text-sm font-medium text-gray-900 hover:underline"
                  >
                    Add an address
                  </Link>
                </div>
              ) : (
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
                        <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{addr.label}</p>
                            {addr.is_primary && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{addr.street_address}, {addr.city}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {orderType === "recurring" ? "First Appointment" : "Select Date & Time"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Select Time
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Choose a time</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {orderType === "recurring" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recurring Frequency</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "weekly", label: "Weekly", desc: "Every week" },
                    { id: "biweekly", label: "Bi-weekly", desc: "Every 2 weeks" },
                    { id: "monthly", label: "Monthly", desc: "Every month" },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      onClick={() => setRecurringFrequency(freq.id as typeof recurringFrequency)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        recurringFrequency === freq.id
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium text-gray-900 text-sm">{freq.label}</p>
                      <p className="text-xs text-gray-500">{freq.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setPaymentType("card")}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    paymentType === "card"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">Pay with Card</span>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentType("cash")}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    paymentType === "cash"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">Cash on Delivery</span>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentType("wallet")}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    paymentType === "wallet"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">Pay with Wallet</span>
                  </div>
                </button>
              </div>

              {paymentType === "card" && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Select a saved card</p>
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-6 border border-gray-200 rounded-lg">
                      <CreditCard className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 mb-3">No cards saved</p>
                      <Link
                        href="/customer/settings/payments"
                        className="text-sm font-medium text-gray-900 hover:underline"
                      >
                        Add a card
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {paymentMethods.map((pm) => (
                        <button
                          key={pm.id}
                          onClick={() => setSelectedPaymentMethod(pm.id)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            selectedPaymentMethod === pm.id
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1)} **** {pm.last4}
                              </p>
                              <p className="text-xs text-gray-500">
                                Expires {pm.expiry_month}/{pm.expiry_year}
                              </p>
                            </div>
                            {pm.is_default && (
                              <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  disabled={!!appliedCoupon}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-100"
                />
                {appliedCoupon ? (
                  <button
                    onClick={handleRemoveCoupon}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    {couponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                  </button>
                )}
              </div>
              {couponError && <p className="text-sm text-red-600 mt-1">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-sm text-green-600 mt-1">
                  Coupon applied! You save {formatCurrency(appliedCoupon.discount)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
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

      case 3:
        const selectedAddressData = addresses.find((a) => a.id === selectedAddress);
        const selectedPaymentData = paymentMethods.find((p) => p.id === selectedPaymentMethod);

        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Vendor</p>
                <p className="font-medium text-gray-900">{selectedVendorDetails?.name}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Services</p>
                {selectedItems.map((item) => (
                  <div key={item.subService.id} className="flex justify-between text-sm py-1">
                    <span>
                      {item.subService.name}
                      {item.quantity > 1 && <span className="text-gray-500"> x{item.quantity}</span>}
                    </span>
                    <span className="font-medium">{formatCurrency(item.subService.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm text-gray-900">
                  {selectedAddressData?.street_address}, {selectedAddressData?.city}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Schedule</p>
                <p className="text-sm text-gray-900">
                  {orderType === "now"
                    ? "As soon as possible"
                    : orderType === "recurring"
                    ? `${selectedDate} at ${selectedTime} (${recurringFrequency})`
                    : `${selectedDate} at ${selectedTime}`}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Payment</p>
                <p className="text-sm text-gray-900">
                  {paymentType === "card" && selectedPaymentData
                    ? `${selectedPaymentData.brand.charAt(0).toUpperCase() + selectedPaymentData.brand.slice(1)} **** ${selectedPaymentData.last4}`
                    : paymentType === "cash"
                    ? "Cash on Delivery"
                    : "Wallet"}
                </p>
              </div>

              {notes && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-900">{notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatCurrency(appliedCoupon.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT (5%)</span>
                  <span>{formatCurrency(getTax())}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatCurrency(getTotal())}</span>
                </div>
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
          <p className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
            {currentStep === 4 && ` - ${checkoutSubSteps[checkoutSubStep - 1].name}`}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-start pb-2 overflow-x-auto">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none min-w-0">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
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
              <div className={`flex-1 h-0.5 mx-2 mt-4 min-w-4 ${currentStep > step.id ? "bg-gray-900" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Checkout Sub-steps */}
      {currentStep === 4 && (
        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
          {checkoutSubSteps.map((subStep, idx) => (
            <div key={subStep.id} className="flex items-center">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  checkoutSubStep > subStep.id
                    ? "bg-gray-900 text-white"
                    : checkoutSubStep === subStep.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {subStep.name}
              </div>
              {idx < checkoutSubSteps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-300 mx-1" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1 && checkoutSubStep === 1}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
            currentStep === 1
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          }`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        {currentStep === 4 && checkoutSubStep === 3 ? (
          <button
            onClick={handlePlaceOrder}
            disabled={submitting}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4 mr-2" />
            )}
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        ) : (
          <button
            onClick={handleNext}
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
