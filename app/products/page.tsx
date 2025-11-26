import SearchBar from "@/components/SearchBar";
import FilterSidebar from "@/components/FilterSidebar";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock product data
const products = [
  { id: 1, title: "Premium Wireless Headphones", price: 199.99, rating: 4.8, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop" },
  { id: 2, title: "Smart Watch Series 5", price: 349.99, rating: 4.6, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop" },
  { id: 3, title: "Laptop Stand Aluminum", price: 79.99, rating: 4.9, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop" },
  { id: 4, title: "Mechanical Keyboard RGB", price: 129.99, rating: 4.7, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop" },
  { id: 5, title: "4K Webcam Pro", price: 159.99, rating: 4.5, image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500&h=500&fit=crop" },
  { id: 6, title: "Portable SSD 1TB", price: 149.99, rating: 4.8, image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop" },
  { id: 7, title: "Gaming Mouse Wireless", price: 89.99, rating: 4.6, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop" },
  { id: 8, title: "USB-C Hub Multiport", price: 49.99, rating: 4.4, image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop" },
  { id: 9, title: "Desk Lamp LED", price: 39.99, rating: 4.7, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop" },
  { id: 10, title: "Monitor 27 inch 4K", price: 499.99, rating: 4.9, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop" },
  { id: 11, title: "Ergonomic Office Chair", price: 299.99, rating: 4.8, image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&h=500&fit=crop" },
  { id: 12, title: "Wireless Charger Pad", price: 29.99, rating: 4.5, image: "https://images.unsplash.com/photo-1591290619762-0ccf8cf36bb7?w=500&h=500&fit=crop" },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e]">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-2xl font-bold gradient-text">Marketplace</h1>
          </div>
          <SearchBar />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <FilterSidebar />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-400">
                Showing <span className="text-indigo-400 font-semibold">{products.length}</span> products
              </p>
              <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-indigo-500/50">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div key={product.id} style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
