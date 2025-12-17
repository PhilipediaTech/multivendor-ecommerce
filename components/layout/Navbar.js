import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition"
            >
              MarketHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-gray-700 hover:text-primary-600 transition font-medium"
            >
              Products
            </Link>
            <Link
              href="/vendors"
              className="text-gray-700 hover:text-primary-600 transition font-medium"
            >
              Vendors
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary-600 transition font-medium"
            >
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-primary-600 transition font-medium"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
