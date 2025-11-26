import Link from "next/link";
import { ShoppingBag, TrendingUp, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1e] via-[#1a1a2e] to-[#0f0f1e]">
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center space-y-8 animate-fadeIn">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              Discover Amazing
              <br />
              <span className="gradient-text">Products</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore our curated marketplace with thousands of premium products
              from top brands around the world
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Link href="/products">
              <button className="btn btn-primary text-lg py-4 px-10 flex items-center gap-3 shadow-lg shadow-indigo-500/50">
                <ShoppingBag className="w-5 h-5" />
                Browse Products
              </button>
            </Link>
            <button className="btn btn-outline text-lg py-4 px-10">
              Learn More
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20 max-w-5xl mx-auto">
            <div className="glass-strong rounded-2xl p-8 hover-lift animate-scaleIn">
              <div className="w-14 h-14 rounded-xl gradient-bg-primary flex items-center justify-center mb-4 animate-float">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Trending Products
              </h3>
              <p className="text-gray-400">
                Discover the latest trending items loved by our community
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-8 hover-lift animate-scaleIn" style={{ animationDelay: "0.1s" }}>
              <div className="w-14 h-14 rounded-xl gradient-bg-secondary flex items-center justify-center mb-4 animate-float" style={{ animationDelay: "1s" }}>
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Secure Shopping
              </h3>
              <p className="text-gray-400">
                Shop with confidence using our secure payment system
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-8 hover-lift animate-scaleIn" style={{ animationDelay: "0.2s" }}>
              <div className="w-14 h-14 rounded-xl gradient-bg-primary flex items-center justify-center mb-4 animate-float" style={{ animationDelay: "2s" }}>
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-400">
                Quick and reliable shipping to your doorstep
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="pt-20 pb-10">
            <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
                  <div className="text-gray-400">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
                  <div className="text-gray-400">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">99%</div>
                  <div className="text-gray-400">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
