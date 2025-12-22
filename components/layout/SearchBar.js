"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState({
    products: [],
    categories: [],
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions({ products: [], categories: [] });
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        if (data.success) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleCategoryClick = (category) => {
    router.push(`/search?category=${encodeURIComponent(category)}`);
    setShowSuggestions(false);
    setQuery("");
  };

  return (
    <div className="relative flex-1 max-w-xl" ref={wrapperRef}>
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder="Search products..."
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : (
            <>
              {/* Category Suggestions */}
              {suggestions.categories.length > 0 && (
                <div className="p-3 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Categories
                  </p>
                  <div className="space-y-1">
                    {suggestions.categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span className="text-sm">{category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Suggestions */}
              {suggestions.products.length > 0 && (
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Products
                  </p>
                  <div className="space-y-1">
                    {suggestions.products.map((product) => (
                      <Link
                        key={product._id}
                        href={`/products/${product._id}`}
                        onClick={() => {
                          setShowSuggestions(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.category}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          £{product.price.toFixed(2)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {suggestions.products.length === 0 &&
                suggestions.categories.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No suggestions found
                  </div>
                )}

              {/* View All Results Link */}
              {(suggestions.products.length > 0 ||
                suggestions.categories.length > 0) && (
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={handleSearch}
                    className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
