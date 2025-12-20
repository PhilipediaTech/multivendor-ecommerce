"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatCurrency, formatDate } from "@/lib/utils/helpers";

export default function OrderDetailPage({ params }) {
  const unwrappedParams = use(params); // Unwrap the params promise
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?redirect=/orders");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && unwrappedParams.id) {
      fetchOrder();
    }
  }, [status, unwrappedParams.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `/api/customer/orders/${unwrappedParams.id}`
      );
      const data = await response.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        router.push("/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      router.push("/orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { name: "Order Placed", status: "pending", completed: true },
      {
        name: "Processing",
        status: "processing",
        completed: ["processing", "shipped", "delivered"].includes(
          order?.status
        ),
      },
      {
        name: "Shipped",
        status: "shipped",
        completed: ["shipped", "delivered"].includes(order?.status),
      },
      {
        name: "Delivered",
        status: "delivered",
        completed: order?.status === "delivered",
      },
    ];

    if (order?.status === "cancelled") {
      return [
        { name: "Order Placed", status: "pending", completed: true },
        { name: "Cancelled", status: "cancelled", completed: true },
      ];
    }

    return steps;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading order details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session || !order) {
    return null;
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/orders"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <span
              className={`inline-block px-4 py-2 text-sm rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Progress Steps */}
          <div className="relative">
            <div className="flex justify-between">
              {statusSteps.map((step, index) => (
                <div
                  key={step.name}
                  className="flex flex-col items-center flex-1 relative"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                      step.completed
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-xs sm:text-sm text-center ${
                      step.completed
                        ? "text-gray-900 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
              ))}
            </div>
            {/* Progress line */}
            <div
              className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0"
              style={{ marginLeft: "2.5rem", marginRight: "2.5rem" }}
            >
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${
                    ((statusSteps.filter((s) => s.completed).length - 1) /
                      (statusSteps.length - 1)) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>
                    {order.shipping === 0 ? (
                      <span className="text-green-600 font-medium">FREE</span>
                    ) : (
                      formatCurrency(order.shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <div className="text-gray-700 space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.state &&
                    `, ${order.shippingAddress.state}`}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
