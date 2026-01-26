"use client";

import { Category } from "@/types/category";

interface ServiceTabsProps {
  categories: Category[];
  selectedCategory?: string;
  onCategoryChange: (category: string) => void;
}

export default function ServiceTabs({
  categories,
  selectedCategory,
  onCategoryChange,
}: ServiceTabsProps) {
  return (
    <div className="flex items-center gap-8 overflow-x-auto hide-scrollbar scroll-smooth px-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`whitespace-nowrap transition-colors ${
            selectedCategory === category.id
              ? "text-gray-900 font-medium border-b-2 border-gray-900"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
