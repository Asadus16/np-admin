"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, ShoppingCart } from "lucide-react";
import { getCustomerCategories, getCustomerVendors, getCustomerVendor } from "@/lib/customerVendor";
import { getAddresses, Address } from "@/lib/address";
import { getPaymentMethods, PaymentMethod } from "@/lib/paymentMethod";
import { createOrder } from "@/lib/order";
import { getCustomerPointsBalance } from "@/lib/points";
import { getCustomerTaxSettings } from "@/lib/feesCommissions";
import { CustomerCategory, CustomerVendor, CustomerVendorSubService, CreateOrderData } from "@/types/order";
import { PointsBalance } from "@/types/points";
import { TaxSettings } from "@/types/feesCommissions";

import {
  SelectedItem,
  OrderType,
  PaymentType,
  RecurringFrequency,
  ORDER_STEPS,
  OrderStepIndicator,
  CategoryStep,
  VendorStep,
  ServiceStep,
  AddressScheduleStep,
  PaymentStep,
  SummaryStep,
  useOrderPricing,
  useCoupon,
  formatCurrency,
} from "@/components/order";

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
  const [taxSettings, setTaxSettings] = useState<TaxSettings | null>(null);

  // Selection states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<OrderType>("schedule");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>("weekly");
  const [paymentType, setPaymentType] = useState<PaymentType>("card");
  const [pointsRemainingPayment, setPointsRemainingPayment] = useState<"card" | "cash">("card");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Points redemption states
  const [pointsBalance, setPointsBalance] = useState<PointsBalance | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [pointsDiscount, setPointsDiscount] = useState(0);

  // Expanded services state for accordion
  const [expandedServices, setExpandedServices] = useState<string[]>([]);

  // Coupon hook
  const {
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    couponLoading,
    handleApplyCoupon,
    handleRemoveCoupon,
  } = useCoupon();

  // Pricing hook
  const { subtotal, tax, total, totalDuration, vatSettings } = useOrderPricing({
    selectedItems,
    selectedVendorDetails,
    taxSettings,
    appliedCoupon,
    pointsDiscount,
  });

  // Load categories and tax settings on mount
  useEffect(() => {
    loadCategories();
    loadTaxSettings();
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

  const loadTaxSettings = async () => {
    try {
      const response = await getCustomerTaxSettings();
      setTaxSettings(response.data);
    } catch (err) {
      console.error("Failed to load tax settings:", err);
      setTaxSettings({ vat_enabled: false, vat_rate: 5, tax_registration_number: null });
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

      const primaryAddress = addressResponse.data.find((a) => a.is_primary);
      if (primaryAddress) setSelectedAddress(primaryAddress.id);

      const defaultPayment = paymentResponse.data.find((p) => p.is_default);
      if (defaultPayment) setSelectedPaymentMethod(defaultPayment.id);

      try {
        const pointsResponse = await getCustomerPointsBalance();
        setPointsBalance(pointsResponse.data);
      } catch (pointsErr) {
        console.error("Failed to load points balance:", pointsErr);
      }
    } catch (err) {
      setError("Failed to load checkout data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedVendor(null);
    setSelectedItems([]);
    setVendors([]);
    setCurrentStep(2);
  };

  const handleVendorSelect = (vendorId: string) => {
    setSelectedVendor(vendorId);
    setSelectedItems([]);
    setCurrentStep(3);
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
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const toggleServiceExpanded = (serviceId: string) => {
    setExpandedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handlePointsPaymentSelect = () => {
    if (!pointsBalance) return;
    setPaymentType("points");
    const discount = appliedCoupon?.discount || 0;
    const orderTotalBeforePoints = subtotal - discount + tax;
    const pointsToUse = Math.min(pointsBalance.available_points, Math.ceil(orderTotalBeforePoints));
    const pointsDiscountAmount = Math.min(pointsToUse, orderTotalBeforePoints);
    setPointsToRedeem(pointsToUse);
    setPointsDiscount(pointsDiscountAmount);
  };

  const handleClearPoints = () => {
    setPointsToRedeem(0);
    setPointsDiscount(0);
  };

  const isFullyPaidWithPoints = () => {
    if (!pointsBalance || paymentType !== "points") return false;
    const discount = appliedCoupon?.discount || 0;
    return pointsBalance.available_points >= subtotal - discount + tax;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedCategory !== null;
      case 2: return selectedVendor !== null;
      case 3: return selectedItems.length > 0;
      case 4:
        if (checkoutSubStep === 1) {
          if (selectedAddress === null) return false;
          if (orderType === "now") return true;
          return selectedDate !== "" && selectedTime !== "";
        }
        if (checkoutSubStep === 2) {
          if (paymentType === "cash") return true;
          if (paymentType === "card") return selectedPaymentMethod !== null;
          if (paymentType === "points") {
            if (isFullyPaidWithPoints()) return true;
            if (pointsRemainingPayment === "cash") return true;
            return selectedPaymentMethod !== null;
          }
          return false;
        }
        return true;
      default: return true;
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
      if (currentStep === 4) setCheckoutSubStep(1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedVendor || !selectedAddress) return;

    setSubmitting(true);
    setError(null);

    try {
      let scheduledDate = selectedDate;
      let scheduledTime = selectedTime;

      if (orderType === "now") {
        const now = new Date();
        const minutes = now.getMinutes();
        // Round to next 30-minute slot
        if (minutes >= 30) {
          now.setHours(now.getHours() + 1);
          now.setMinutes(0);
        } else {
          now.setMinutes(30);
        }
        scheduledDate = now.toISOString().split("T")[0];
        scheduledTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
      }

      let actualPaymentType: "card" | "cash" | "wallet" = "card";
      let paymentMethodId: string | undefined = undefined;

      if (paymentType === "points") {
        if (isFullyPaidWithPoints()) {
          actualPaymentType = "card";
        } else {
          actualPaymentType = pointsRemainingPayment;
          if (pointsRemainingPayment === "card") {
            paymentMethodId = selectedPaymentMethod || undefined;
          }
        }
      } else if (paymentType === "card") {
        actualPaymentType = "card";
        paymentMethodId = selectedPaymentMethod || undefined;
      } else {
        actualPaymentType = "cash";
      }

      const orderData: CreateOrderData = {
        vendor_id: selectedVendor,
        address_id: selectedAddress,
        payment_type: actualPaymentType,
        payment_method_id: paymentMethodId,
        coupon_code: appliedCoupon?.code,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        notes: notes || undefined,
        items: selectedItems.map((item) => ({
          sub_service_id: item.subService.id,
          quantity: item.quantity,
        })),
        is_recurring: orderType === "recurring",
        frequency_type: orderType === "recurring" ? recurringFrequency : undefined,
        points_to_redeem: pointsToRedeem > 0 ? pointsToRedeem : undefined,
      };

      if (vatSettings && vatSettings.vat_enabled) {
        orderData.vat = {
          enabled: vatSettings.vat_enabled,
          rate: vatSettings.vat_rate,
          tax_registration_number: vatSettings.tax_registration_number || null,
          amount: tax,
        };
      }

      const response = await createOrder(orderData);
      router.push(`/customer/orders/${response.data.id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to place order";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

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
          <CategoryStep
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        );
      case 2:
        return (
          <VendorStep
            vendors={vendors}
            selectedVendor={selectedVendor}
            onSelectVendor={handleVendorSelect}
            formatCurrency={formatCurrency}
          />
        );
      case 3:
        return (
          <ServiceStep
            vendorDetails={selectedVendorDetails}
            selectedItems={selectedItems}
            expandedServices={expandedServices}
            onToggleServiceExpanded={toggleServiceExpanded}
            onItemToggle={handleItemToggle}
            onQuantityChange={handleQuantityChange}
            formatCurrency={formatCurrency}
            subtotal={subtotal}
            totalDuration={totalDuration}
          />
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
          <AddressScheduleStep
            addresses={addresses}
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
            orderType={orderType}
            onOrderTypeChange={setOrderType}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedTime={selectedTime}
            onTimeChange={setSelectedTime}
            recurringFrequency={recurringFrequency}
            onFrequencyChange={setRecurringFrequency}
            vendorId={selectedVendor}
            totalDuration={totalDuration}
          />
        );
      case 2:
        return (
          <PaymentStep
            paymentMethods={paymentMethods}
            paymentType={paymentType}
            onPaymentTypeChange={setPaymentType}
            selectedPaymentMethod={selectedPaymentMethod}
            onSelectPaymentMethod={setSelectedPaymentMethod}
            pointsBalance={pointsBalance}
            pointsToRedeem={pointsToRedeem}
            pointsDiscount={pointsDiscount}
            onPointsPaymentSelect={handlePointsPaymentSelect}
            onClearPoints={handleClearPoints}
            isFullyPaidWithPoints={isFullyPaidWithPoints()}
            pointsRemainingPayment={pointsRemainingPayment}
            onPointsRemainingPaymentChange={setPointsRemainingPayment}
            couponCode={couponCode}
            onCouponCodeChange={setCouponCode}
            appliedCoupon={appliedCoupon}
            couponError={couponError}
            couponLoading={couponLoading}
            onApplyCoupon={() => handleApplyCoupon(subtotal)}
            onRemoveCoupon={handleRemoveCoupon}
            notes={notes}
            onNotesChange={setNotes}
            formatCurrency={formatCurrency}
            remainingAmount={total}
          />
        );
      case 3:
        return (
          <SummaryStep
            vendorDetails={selectedVendorDetails}
            selectedItems={selectedItems}
            selectedAddress={addresses.find((a) => a.id === selectedAddress)}
            orderType={orderType}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            recurringFrequency={recurringFrequency}
            paymentType={paymentType}
            selectedPaymentMethod={paymentMethods.find((p) => p.id === selectedPaymentMethod)}
            pointsToRedeem={pointsToRedeem}
            pointsDiscount={pointsDiscount}
            isFullyPaidWithPoints={isFullyPaidWithPoints()}
            pointsRemainingPayment={pointsRemainingPayment}
            appliedCoupon={appliedCoupon}
            notes={notes}
            subtotal={subtotal}
            tax={tax}
            total={total}
            vatSettings={vatSettings}
            formatCurrency={formatCurrency}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/customer/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">New Order</h1>
          <p className="text-sm text-gray-500">
            Step {currentStep} of {ORDER_STEPS.length}
            {currentStep === 4 && ` - ${["Address & Schedule", "Payment", "Summary"][checkoutSubStep - 1]}`}
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <OrderStepIndicator currentStep={currentStep} checkoutSubStep={checkoutSubStep} />

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
