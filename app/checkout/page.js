"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import useCartStore from "@/lib/store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items } = useCartStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?redirect=/checkout");
    }
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [status, items, router]);

  if (status === "loading" || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Checkout Coming Soon
            </h1>
            <p className="text-gray-600 mb-6">
              We're building the checkout page with Stripe integration. This
              will be implemented in the next steps!
            </p>
            <div className="space-y-3">
              <div className="text-left bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  What's coming:
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✓ Shipping address form</li>
                  <li>✓ Payment method selection</li>
                  <li>✓ Stripe payment integration</li>
                  <li>✓ Order confirmation</li>
                </ul>
              </div>
              <button
                onClick={() => router.push("/cart")}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
