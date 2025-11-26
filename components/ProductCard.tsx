"use client";

import Image from "next/image";
import { Eye, Star } from "lucide-react";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  rating: number;
  image: string;
}

export default function ProductCard({ id, title, price, rating, image }: ProductCardProps) {
  return (
    <div className="card hover-lift p-4 group cursor-pointer animate-scaleIn">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-white/5">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-100 line-clamp-2 group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-600"
                }`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({rating.toFixed(1)})</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold gradient-text">${price.toFixed(2)}</span>
          <button className="btn btn-primary text-sm py-2 px-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}
