import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ReviewSchema.index({ product: 1 });
ReviewSchema.index({ customer: 1 });
ReviewSchema.index({ rating: 1 });

// Ensure one review per customer per product
ReviewSchema.index({ product: 1, customer: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
