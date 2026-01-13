"use client";

import { Check, ArrowRight } from "lucide-react";
import { ORDER_STEPS, CHECKOUT_SUB_STEPS } from "./types";

interface OrderStepIndicatorProps {
  currentStep: number;
  checkoutSubStep: number;
}

export function OrderStepIndicator({ currentStep, checkoutSubStep }: OrderStepIndicatorProps) {
  return (
    <>
      {/* Progress Steps */}
      <div className="flex items-start pb-2 overflow-x-auto">
        {ORDER_STEPS.map((step, idx) => (
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
            {idx < ORDER_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-4 min-w-4 ${currentStep > step.id ? "bg-gray-900" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Checkout Sub-steps */}
      {currentStep === 4 && (
        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
          {CHECKOUT_SUB_STEPS.map((subStep, idx) => (
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
              {idx < CHECKOUT_SUB_STEPS.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-300 mx-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
