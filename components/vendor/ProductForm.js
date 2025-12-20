"use client";

import { useState } from "react";
import { generateSlug } from "@/lib/utils/helpers";

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || "",
    comparePrice: product?.comparePrice || "",
    category: product?.category || "Electronics",
    stock: product?.stock || "",
    images: product?.images || [],
    tags: product?.tags?.join(", ") || "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
  });

  const [imageUrl, setImageUrl] = useState("");

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports",
    "Books",
    "Toys",
    "Beauty",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      setFormData({
        ...formData,
        name: value,
        slug: generateSlug(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, { url: imageUrl, publicId: "" }],
      });
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      comparePrice: parseFloat(formData.comparePrice) || 0,
      stock: parseInt(formData.stock),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Premium Wireless Headphones"
        />
      </div>

      {/* Slug (Auto-generated, read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug (URL-friendly name)
        </label>
        <input
          type="text"
          value={formData.slug}
          readOnly
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Detailed product description..."
        />
      </div>

      {/* Price Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (£) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="79.99"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compare Price (£)
          </label>
          <input
            type="number"
            name="comparePrice"
            value={formData.comparePrice}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="129.99"
          />
          <p className="text-xs text-gray-500 mt-1">
            Original price for showing discounts
          </p>
        </div>
      </div>

      {/* Category and Stock */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Quantity *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="50"
          />
        </div>
      </div>

      {/* Images */}
      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images
        </label>

        {/* Upload Methods */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload from Device
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    // Show loading state
                    const loadingImg = {
                      url: URL.createObjectURL(file),
                      publicId: "uploading",
                      isUploading: true,
                    };
                    setFormData({
                      ...formData,
                      images: [...formData.images, loadingImg],
                    });

                    // Upload to Cloudinary
                    try {
                      const formData = new FormData();
                      formData.append("file", file);

                      const response = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });

                      const data = await response.json();

                      if (data.success) {
                        // Replace loading image with uploaded image
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.map((img) =>
                            img.publicId === "uploading"
                              ? { url: data.url, publicId: data.publicId }
                              : img
                          ),
                        }));
                      } else {
                        alert("Upload failed: " + data.message);
                        // Remove loading image
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter(
                            (img) => img.publicId !== "uploading"
                          ),
                        }));
                      }
                    } catch (error) {
                      console.error("Upload error:", error);
                      alert("Upload failed");
                      // Remove loading image
                      setFormData((prev) => ({
                        ...prev,
                        images: prev.images.filter(
                          (img) => img.publicId !== "uploading"
                        ),
                      }));
                    }

                    // Reset input
                    e.target.value = "";
                  }}
                  className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Recommended: JPG, PNG or WebP. Max 5MB.
              </p>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Add Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://images.unsplash.com/photo-..."
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Preview Grid */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full h-24 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
                  <img
                    src={image.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {image.isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                {!image.isUploading && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-primary-600 text-white text-xs px-2 py-0.5 rounded">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-600 mt-2">
          First image will be used as the main product image
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="wireless, bluetooth, audio"
        />
      </div>

      {/* Status Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">
            Active (visible to customers)
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Featured</span>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Saving..."
            : product
            ? "Update Product"
            : "Create Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
