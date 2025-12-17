"use client";

export default function ProductsFilter({ filters, setFilters }) {
  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports",
    "Books",
    "Toys",
    "Beauty",
    "Other",
  ];

  const sortOptions = [
    { value: "-createdAt", label: "Newest" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
    { value: "-rating", label: "Highest Rated" },
    { value: "name", label: "Name: A to Z" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-sm text-gray-700">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.toLowerCase()}
                checked={
                  filters.category === category.toLowerCase() ||
                  (category === "All" && filters.category === "all")
                }
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value, page: 1 })
                }
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-sm text-gray-700">Price Range</h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-600">Min Price (£)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value, page: 1 })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600">Max Price (£)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value, page: 1 })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="1000"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-sm text-gray-700">Sort By</h4>
        <select
          value={filters.sort}
          onChange={(e) =>
            setFilters({ ...filters, sort: e.target.value, page: 1 })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() =>
          setFilters({
            category: "all",
            search: "",
            minPrice: "",
            maxPrice: "",
            sort: "-createdAt",
            page: 1,
          })
        }
        className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );
}
