"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="w-full max-w-2xl">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-hover:text-indigo-400" />
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-xl"
        />
      </div>
    </div>
  );
}
