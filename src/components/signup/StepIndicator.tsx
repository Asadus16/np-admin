"use client";

import { Check, LucideIcon } from "lucide-react";

interface Step {
  id: number;
  name: string;
  icon: LucideIcon;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1 mb-6 w-full max-w-full overflow-x-auto px-2">
      <div className="flex items-center gap-1 min-w-max">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center min-w-[60px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white"
                      : isCurrent
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-gray-300 text-gray-400 bg-white"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 text-center leading-tight px-0.5 ${
                    isCurrent ? "text-gray-900 font-medium" : "text-gray-500"
                  }`}
                  style={{ 
                    maxWidth: 'fit-content',
                    lineHeight: '1.2'
                  }}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                
                <div
                  className={`w-6 h-0.5 mx-1 -mt-4 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
