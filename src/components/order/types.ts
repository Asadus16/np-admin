import { CustomerCategory, CustomerVendor, CustomerVendorSubService } from "@/types/order";
import { Address } from "@/lib/address";
import { PaymentMethod } from "@/lib/paymentMethod";
import { PointsBalance } from "@/types/points";
import { TaxSettings } from "@/types/feesCommissions";

export interface SelectedItem {
  subService: CustomerVendorSubService;
  serviceName: string;
  quantity: number;
}

export type OrderType = "now" | "schedule" | "recurring";
export type PaymentType = "card" | "cash" | "points";
export type RecurringFrequency = "daily" | "weekly" | "biweekly" | "monthly";

export interface OrderPricing {
  subtotal: number;
  tax: number;
  discount: number;
  pointsDiscount: number;
  total: number;
  totalDuration: number;
}

export interface VatSettings {
  vat_enabled: boolean;
  vat_rate: number;
  tax_registration_number: string | null;
}

// Step definitions
export const ORDER_STEPS = [
  { id: 1, name: "Category" },
  { id: 2, name: "Vendor" },
  { id: 3, name: "Services" },
  { id: 4, name: "Checkout" },
];

export const CHECKOUT_SUB_STEPS = [
  { id: 1, name: "Address & Schedule" },
  { id: 2, name: "Payment" },
  { id: 3, name: "Summary" },
];

// Time slots (30-minute intervals)
export const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

// Props for step components
export interface CategoryStepProps {
  categories: CustomerCategory[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export interface VendorStepProps {
  vendors: CustomerVendor[];
  selectedVendor: string | null;
  onSelectVendor: (vendorId: string) => void;
  formatCurrency: (value: number) => string;
}

export interface ServiceStepProps {
  vendorDetails: CustomerVendor | null;
  selectedItems: SelectedItem[];
  expandedServices: string[];
  onToggleServiceExpanded: (serviceId: string) => void;
  onItemToggle: (subService: CustomerVendorSubService, serviceName: string) => void;
  onQuantityChange: (subServiceId: string, delta: number) => void;
  formatCurrency: (value: number) => string;
  subtotal: number;
  totalDuration: number;
}

export interface AddressScheduleStepProps {
  addresses: Address[];
  selectedAddress: string | null;
  onSelectAddress: (addressId: string) => void;
  orderType: OrderType;
  onOrderTypeChange: (type: OrderType) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  recurringFrequency: RecurringFrequency;
  onFrequencyChange: (frequency: RecurringFrequency) => void;
}

export interface PaymentStepProps {
  paymentMethods: PaymentMethod[];
  paymentType: PaymentType;
  onPaymentTypeChange: (type: PaymentType) => void;
  selectedPaymentMethod: string | null;
  onSelectPaymentMethod: (methodId: string) => void;
  pointsBalance: PointsBalance | null;
  pointsToRedeem: number;
  pointsDiscount: number;
  onPointsPaymentSelect: () => void;
  onClearPoints: () => void;
  isFullyPaidWithPoints: boolean;
  pointsRemainingPayment: "card" | "cash";
  onPointsRemainingPaymentChange: (type: "card" | "cash") => void;
  couponCode: string;
  onCouponCodeChange: (code: string) => void;
  appliedCoupon: { code: string; discount: number } | null;
  couponError: string | null;
  couponLoading: boolean;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  formatCurrency: (value: number) => string;
  remainingAmount: number;
}

export interface SummaryStepProps {
  vendorDetails: CustomerVendor | null;
  selectedItems: SelectedItem[];
  selectedAddress: Address | undefined;
  orderType: OrderType;
  selectedDate: string;
  selectedTime: string;
  recurringFrequency: RecurringFrequency;
  paymentType: PaymentType;
  selectedPaymentMethod: PaymentMethod | undefined;
  pointsToRedeem: number;
  pointsDiscount: number;
  isFullyPaidWithPoints: boolean;
  pointsRemainingPayment: "card" | "cash";
  appliedCoupon: { code: string; discount: number } | null;
  notes: string;
  subtotal: number;
  tax: number;
  total: number;
  vatSettings: VatSettings | null;
  formatCurrency: (value: number) => string;
}
