"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageGallery from "@/components/customer/ImageGallery";
import useCartStore from "@/lib/store/cartStore";
import { formatCurrency } from "@/lib/utils/helpers";

export default function TestProductPage() {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const mockProduct = {
    _id: "test123",
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    category: "Electronics",
    price: 79.99,
    comparePrice: 129.99,
    rating: 4.5,
    numReviews: 128,
    stock: 50,
    description:
      "Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and supreme comfort for all-day wear.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        publicId: "sample1",
      },
      {
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
        publicId: "sample2",
      },
      {
        url: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800",
        publicId: "sample3",
      },
    ],
    vendor: {
      _id: "vendor123",
      name: "John Doe",
      vendorInfo: {
        shopName: "TechPro Store",
        rating: 4.8,
      },
    },
    specifications: {
      Brand: "TechPro",
      "Battery Life": "30 hours",
      Connectivity: "Bluetooth 5.0",
      Weight: "250g",
    },
  };

  const handleAddToCart = () => {
    addItem(mockProduct, quantity);
    alert(`Added ${quantity} item(s) to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <ImageGallery
            images={mockProduct.images}
            productName={mockProduct.name}
          />

          {/* Product Info */}
          <div>
            <p className="text-sm text-primary-600 mb-2">
              {mockProduct.category}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {mockProduct.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(mockProduct.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">
                {mockProduct.rating} ({mockProduct.numReviews} reviews)
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {formatCurrency(mockProduct.price)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(mockProduct.comparePrice)}
                </span>
              </div>
              <p className="text-green-600 font-medium mt-1">
                You save{" "}
                {formatCurrency(mockProduct.comparePrice - mockProduct.price)}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-green-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">
                  In Stock ({mockProduct.stock} available)
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(
                          mockProduct.stock,
                          parseInt(e.target.value) || 1
                        )
                      )
                    )
                  }
                  className="w-20 h-10 text-center border border-gray-300 rounded-lg"
                  min="1"
                  max={mockProduct.stock}
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(mockProduct.stock, quantity + 1))
                  }
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{mockProduct.description}</p>

            <button
              onClick={handleAddToCart}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
