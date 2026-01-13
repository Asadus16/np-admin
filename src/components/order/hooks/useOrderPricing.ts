import { useMemo } from "react";
import { SelectedItem, VatSettings, OrderPricing } from "../types";
import { CustomerVendor } from "@/types/order";
import { TaxSettings } from "@/types/feesCommissions";

interface UseOrderPricingProps {
  selectedItems: SelectedItem[];
  selectedVendorDetails: CustomerVendor | null;
  taxSettings: TaxSettings | null;
  appliedCoupon: { code: string; discount: number } | null;
  pointsDiscount: number;
}

export function useOrderPricing({
  selectedItems,
  selectedVendorDetails,
  taxSettings,
  appliedCoupon,
  pointsDiscount,
}: UseOrderPricingProps): OrderPricing & { vatSettings: VatSettings | null } {
  return useMemo(() => {
    // Calculate subtotal
    const subtotal = selectedItems.reduce((sum, item) => {
      const price = typeof item.subService.price === 'string'
        ? parseFloat(item.subService.price)
        : item.subService.price;
      return sum + price * item.quantity;
    }, 0);

    // Get VAT settings from vendor or fall back to tax settings
    const vendorVat = selectedVendorDetails?.vat;
    let vatSettings: VatSettings | null = null;

    if (vendorVat) {
      vatSettings = {
        vat_enabled: vendorVat.enabled,
        vat_rate: vendorVat.rate,
        tax_registration_number: vendorVat.tax_registration_number || null,
      };
    } else if (taxSettings) {
      vatSettings = {
        vat_enabled: taxSettings.vat_enabled,
        vat_rate: taxSettings.vat_rate,
        tax_registration_number: taxSettings.tax_registration_number || null,
      };
    }

    // Calculate tax
    let tax = 0;
    if (vatSettings && vatSettings.vat_enabled) {
      const discount = appliedCoupon?.discount || 0;
      const vatRateDecimal = vatSettings.vat_rate / 100;
      tax = Math.round((subtotal - discount) * vatRateDecimal * 100) / 100;
    }

    // Calculate total
    const discount = appliedCoupon?.discount || 0;
    const total = Math.max(0, subtotal - discount + tax - pointsDiscount);

    // Calculate total duration
    const totalDuration = selectedItems.reduce(
      (sum, item) => sum + item.subService.duration * item.quantity,
      0
    );

    return {
      subtotal,
      tax,
      discount,
      pointsDiscount,
      total,
      totalDuration,
      vatSettings,
    };
  }, [selectedItems, selectedVendorDetails, taxSettings, appliedCoupon, pointsDiscount]);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
  }).format(value);
}
