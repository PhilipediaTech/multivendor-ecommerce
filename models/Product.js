import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: 0,
    },
    comparePrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "Electronics",
        "Fashion",
        "Home & Garden",
        "Sports",
        "Books",
        "Toys",
        "Beauty",
        "Other",
      ],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    tags: [String],
    specifications: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ vendor: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ isActive: 1 });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
