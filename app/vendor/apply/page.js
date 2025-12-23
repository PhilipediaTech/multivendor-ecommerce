"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function VendorApplicationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [application, setApplication] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?redirect=/vendor/apply");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      checkApplicationStatus();
    }
  }, [status]);

  const checkApplicationStatus = async () => {
    try {
      const response = await fetch("/api/vendor/apply");
      const data = await response.json();

      if (data.success) {
        setApplication(data.application);
        if (data.isVendor) {
          router.push("/vendor-dashboard");
        }
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/vendor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setFormData({ shopName: "", shopDescription: "" });
        checkApplicationStatus();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setError("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || checkingStatus) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Show application status if exists and has business info
  if (
    application?.applicationStatus === "pending" &&
    application?.shopName &&
    application?.shopDescription
  ) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Application Pending Review
            </h1>
            <p className="text-gray-600 mb-6">
              Your vendor application is currently under review. We'll notify
              you via email once it's been processed.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Business Name:</strong> {application.shopName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Applied:</strong>{" "}
                {new Date(application.appliedAt).toLocaleDateString()}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show rejection message
  if (application?.applicationStatus === "rejected") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Application Not Approved
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              Unfortunately, your previous vendor application was not approved.
            </p>
            {application.rejectionReason && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-sm font-medium text-red-800 mb-1">Reason:</p>
                <p className="text-sm text-red-700">
                  {application.rejectionReason}
                </p>
              </div>
            )}
            <p className="text-gray-600 mb-6 text-center">
              You can submit a new application addressing the concerns mentioned
              above.
            </p>
            <div className="text-center">
              <button
                onClick={() =>
                  setApplication({ ...application, applicationStatus: "none" })
                }
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Apply Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show application form if pending but no business info yet (came from registration)
  const isPendingWithoutInfo =
    application?.applicationStatus === "pending" &&
    (!application?.shopName || !application?.shopDescription);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isPendingWithoutInfo
              ? "Complete Your Vendor Application"
              : "Become a Vendor"}
          </h1>
          <p className="text-gray-600">
            {isPendingWithoutInfo
              ? "Please provide your business details to complete your vendor application"
              : "Join our marketplace and start selling your products today!"}
          </p>
        </div>

        {isPendingWithoutInfo && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <svg
                className="h-5 w-5 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="ml-3 text-sm text-yellow-700">
                Your account is pending approval. Complete this form to submit
                your application for review.
              </p>
            </div>
          </div>
        )}

        {/* Benefits Section - only show for new applications */}
        {!isPendingWithoutInfo && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Why Sell on MarketHub?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-600 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Large Customer Base
                  </h3>
                  <p className="text-sm text-gray-600">
                    Reach thousands of active buyers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-600 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">Easy to Use</h3>
                  <p className="text-sm text-gray-600">
                    Simple dashboard to manage products
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-600 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">Secure Payments</h3>
                  <p className="text-sm text-gray-600">
                    Get paid quickly and securely
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-green-600 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Analytics & Insights
                  </h3>
                  <p className="text-sm text-gray-600">
                    Track sales and performance
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {isPendingWithoutInfo
              ? "Business Information"
              : "Vendor Application"}
          </h2>

          {message && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) =>
                  setFormData({ ...formData, shopName: e.target.value })
                }
                required
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Your business or brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description *
              </label>
              <textarea
                value={formData.shopDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shopDescription: e.target.value,
                  })
                }
                required
                rows={6}
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Tell us about your business, what you sell, and why you want to join MarketHub..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.shopDescription.length}/1000 characters
              </p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Your application will be reviewed by our
                team. You will receive an email notification once your
                application has been processed.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
