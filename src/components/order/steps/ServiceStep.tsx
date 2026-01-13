"use client";

import { Check, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { ServiceStepProps } from "../types";

export function ServiceStep({
  vendorDetails,
  selectedItems,
  expandedServices,
  onToggleServiceExpanded,
  onItemToggle,
  onQuantityChange,
  formatCurrency,
  subtotal,
  totalDuration,
}: ServiceStepProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Services</h2>
      {!vendorDetails?.services || vendorDetails.services.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No services available from this vendor</p>
      ) : (
        <div className="space-y-4">
          {vendorDetails.services.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => onToggleServiceExpanded(service.id)}
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
                              <span>
                                {formatCurrency(
                                  typeof subService.price === 'string'
                                    ? parseFloat(subService.price)
                                    : subService.price
                                )}
                              </span>
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
                                    onQuantityChange(subService.id, -1);
                                  }}
                                  className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                                >
                                  <span className="w-4 h-4 flex items-center justify-center text-gray-600">-</span>
                                </button>
                                <span className="w-8 text-center font-medium">{selectedItem.quantity}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onQuantityChange(subService.id, 1);
                                  }}
                                  className="p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
                                >
                                  <span className="w-4 h-4 flex items-center justify-center text-gray-600">+</span>
                                </button>
                              </div>
                            )}
                            <button
                              onClick={() => onItemToggle(subService, service.name)}
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
                <span className="font-medium text-gray-900">Subtotal: {formatCurrency(subtotal)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Estimated duration: {totalDuration} minutes
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
