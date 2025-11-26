"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FilterSidebar() {
  const [openSections, setOpenSections] = useState<string[]>(["categories", "price", "rating"]);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const categories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Toys"];
  const priceRanges = ["Under $25", "$25 - $50", "$50 - $100", "$100 - $200", "Over $200"];
  const ratings = ["5 Stars", "4 Stars & Up", "3 Stars & Up", "2 Stars & Up"];

  return (
    <div className="w-64 space-y-4 animate-slideInLeft">
      {/* Categories */}
      <div className="glass-strong rounded-2xl p-5 hover-lift">
        <button
          onClick={() => toggleSection("categories")}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-lg text-gray-100">Categories</h3>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSections.includes("categories") ? "rotate-180" : ""
              }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${openSections.includes("categories") ? "max-h-96 mt-4" : "max-h-0"
            }`}
        >
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-gray-300 group-hover:text-indigo-400 transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="glass-strong rounded-2xl p-5 hover-lift">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-lg text-gray-100">Price Range</h3>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSections.includes("price") ? "rotate-180" : ""
              }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${openSections.includes("price") ? "max-h-96 mt-4" : "max-h-0"
            }`}
        >
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="price"
                  className="w-4 h-4 border-gray-600 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-gray-300 group-hover:text-indigo-400 transition-colors">
                  {range}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="glass-strong rounded-2xl p-5 hover-lift">
        <button
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-lg text-gray-100">Rating</h3>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openSections.includes("rating") ? "rotate-180" : ""
              }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${openSections.includes("rating") ? "max-h-96 mt-4" : "max-h-0"
            }`}
        >
          <div className="space-y-2">
            {ratings.map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-white/5 text-indigo-500 focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                />
                <span className="text-sm text-gray-300 group-hover:text-indigo-400 transition-colors">
                  {rating}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
