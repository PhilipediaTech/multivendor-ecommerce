import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ✅ FIXED PATH
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

async function getVendors() {
  try {
    await connectDB();

    // Get all approved vendors
    const vendors = await User.find({
      role: "vendor",
      "vendorInfo.isApproved": true,
      "vendorInfo.applicationStatus": "approved",
    })
      .select("name email vendorInfo createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Convert MongoDB objects to plain objects and serialize dates
    return vendors.map((vendor) => ({
      _id: vendor._id.toString(),
      name: vendor.name,
      email: vendor.email,
      shopName: vendor.vendorInfo?.shopName || vendor.name,
      shopDescription: vendor.vendorInfo?.shopDescription || "",
      createdAt: vendor.createdAt
        ? new Date(vendor.createdAt).toISOString()
        : null,
    }));
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
}

async function getVendorProductCount(vendorId) {
  try {
    const Product = (await import("@/models/Product")).default;
    const count = await Product.countDocuments({
      vendor: vendorId,
      isActive: true,
    });
    return count;
  } catch (error) {
    console.error("Error counting products:", error);
    return 0;
  }
}

export default async function VendorsPage() {
  const session = await getServerSession(authOptions);
  const vendors = await getVendors();

  // Get product counts for each vendor
  const vendorsWithCounts = await Promise.all(
    vendors.map(async (vendor) => ({
      ...vendor,
      productCount: await getVendorProductCount(vendor._id),
    }))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Vendors</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover trusted sellers offering quality products
          </p>
        </div>

        {/* Vendors Grid */}
        {vendorsWithCounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendorsWithCounts.map((vendor) => (
              <VendorCard key={vendor._id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <EmptyVendorsState session={session} />
        )}

        {/* Call to Action for Non-Vendors */}
        {session?.user?.role !== "vendor" && vendorsWithCounts.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Want to become a vendor?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join our marketplace and start selling your products to thousands
              of customers
            </p>
            <Link
              href="/auth/register"
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Selling Today
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Vendor Card Component
function VendorCard({ vendor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
      {/* Vendor Header with Icon */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-24 flex items-center justify-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
          <svg
            className="w-10 h-10 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
      </div>

      {/* Vendor Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {vendor.shopName}
        </h3>

        {vendor.shopDescription && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {vendor.shopDescription}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span>{vendor.productCount} products</span>
          </div>

          {vendor.createdAt && (
            <div className="flex items-center gap-1">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Joined {new Date(vendor.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* View Products Button */}
        <Link
          href={`/products?vendor=${vendor._id}`}
          className="block w-full bg-primary-600 text-white text-center py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          View Products
        </Link>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyVendorsState({ session }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
      {/* Icon */}
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>

      {/* Message */}
      <h2 className="text-2xl font-bold text-gray-900 mb-3">No vendors yet</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Be the first to start selling on MarketHub
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {session?.user ? (
          <>
            {session.user.role === "vendor" ? (
              <Link
                href="/vendor-dashboard"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : session.user.role === "admin" ? (
              <Link
                href="/admin/users"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Manage Vendors
              </Link>
            ) : (
              <Link
                href="/vendor/apply"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Become a Vendor
              </Link>
            )}
          </>
        ) : (
          <>
            <Link
              href="/auth/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Become a Vendor
            </Link>
            <Link
              href="/products"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Browse Products
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
