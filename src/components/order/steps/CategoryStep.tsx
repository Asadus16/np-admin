"use client";

import { CategoryStepProps } from "../types";

export function CategoryStep({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryStepProps) {
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
              onClick={() => onSelectCategory(cat.id)}
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
}
