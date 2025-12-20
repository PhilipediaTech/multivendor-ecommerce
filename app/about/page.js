import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About MarketHub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted multi-vendor marketplace connecting buyers with quality
            sellers worldwide
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At MarketHub, we believe in empowering entrepreneurs and
              connecting them with customers who value quality and authenticity.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are committed to building a sustainable marketplace that
              benefits everyone.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Curated Vendors
                  </h3>
                  <p className="text-gray-600">
                    Every seller is verified to ensure quality
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Secure Payments
                  </h3>
                  <p className="text-gray-600">Stripe-powered checkout</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Customer Support
                  </h3>
                  <p className="text-gray-600">Dedicated team ready to help</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fast Shipping</h3>
                  <p className="text-gray-600">Quick delivery options</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-primary-600 rounded-2xl p-12 text-white mb-16">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold mb-2">500+</p>
              <p className="text-primary-100">Active Vendors</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">10K+</p>
              <p className="text-primary-100">Products Listed</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">50K+</p>
              <p className="text-primary-100">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">98%</p>
              <p className="text-primary-100">Satisfaction Rate</p>
            </div>
          </div>
        </div>
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Trust
              </h3>
              <p className="text-gray-600">
                Building lasting relationships through transparency
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Innovation
              </h3>
              <p className="text-gray-600">Constantly improving our platform</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Community
              </h3>
              <p className="text-gray-600">Supporting entrepreneurs globally</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful vendors on MarketHub and grow your
            business today
          </p>
          <a
            href="/vendor-dashboard"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Become a Vendor
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
