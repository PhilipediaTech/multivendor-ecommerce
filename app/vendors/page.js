import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

async function getVendors() {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/api/vendors`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.vendors || [];
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
}

export default async function VendorsPage() {
  const vendors = await getVendors();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Vendors</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover trusted sellers offering quality products
          </p>
        </div>

        {vendors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No vendors yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to start selling on MarketHub
            </p>
            <Link
              href="/vendor-dashboard"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Become a Vendor
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <div
                key={vendor._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-600">
                        {vendor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vendor.name}
                      </h3>
                      <p className="text-sm text-gray-600">{vendor.email}</p>
                    </div>
                  </div>

                  {vendor.shopName && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">
                        Business Name
                      </p>
                      <p className="text-gray-900">{vendor.shopName}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Products
                    </p>
                    <p className="text-2xl font-bold text-primary-600">
                      {vendor.productCount || 0}
                    </p>
                  </div>

                  <Link
                    href={`/products?vendor=${vendor._id}`}
                    className="block w-full text-center bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
                  >
                    View Products
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
