import { useState, useCallback } from "react";
import { validateCoupon } from "@/lib/order";

interface UseCouponReturn {
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: { code: string; discount: number } | null;
  couponError: string | null;
  couponLoading: boolean;
  handleApplyCoupon: (subtotal: number) => Promise<void>;
  handleRemoveCoupon: () => void;
}

export function useCoupon(): UseCouponReturn {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = useCallback(async (subtotal: number) => {
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);
    try {
      const response = await validateCoupon(couponCode, subtotal);
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
  }, [couponCode]);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  }, []);

  return {
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    couponLoading,
    handleApplyCoupon,
    handleRemoveCoupon,
  };
}
