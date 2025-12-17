import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/avatar-default.png",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      postalCode: { type: String, default: "" },
      country: { type: String, default: "" },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Vendor-specific fields
    vendorInfo: {
      shopName: { type: String, default: "" },
      shopDescription: { type: String, default: "" },
      shopLogo: { type: String, default: "" },
      isApproved: { type: Boolean, default: false },
      rating: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
      totalProducts: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ "vendorInfo.isApproved": 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
