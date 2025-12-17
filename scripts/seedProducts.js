// This script is for development/testing only
// Run with: node scripts/seedProducts.js

const mongoose = require("mongoose");

const MONGODB_URI = "YOUR_MONGODB_URI_HERE"; // Replace with your actual MongoDB URI

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  comparePrice: Number,
  category: String,
  images: Array,
  stock: Number,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isActive: Boolean,
  isFeatured: Boolean,
  rating: Number,
  numReviews: Number,
  tags: Array,
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    description:
      "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 79.99,
    comparePrice: 99.99,
    category: "Electronics",
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        publicId: "sample",
      },
    ],
    stock: 50,
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    numReviews: 128,
    tags: ["audio", "wireless", "bluetooth"],
  },
  {
    name: "Smart Watch Series 5",
    slug: "smart-watch-series-5",
    description:
      "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring.",
    price: 249.99,
    comparePrice: 299.99,
    category: "Electronics",
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        publicId: "sample",
      },
    ],
    stock: 30,
    isActive: true,
    isFeatured: false,
    rating: 4.8,
    numReviews: 89,
    tags: ["smartwatch", "fitness", "health"],
  },
  {
    name: "Premium Cotton T-Shirt",
    slug: "premium-cotton-tshirt",
    description:
      "Comfortable 100% organic cotton t-shirt available in multiple colors.",
    price: 24.99,
    comparePrice: 34.99,
    category: "Fashion",
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        publicId: "sample",
      },
    ],
    stock: 100,
    isActive: true,
    isFeatured: false,
    rating: 4.3,
    numReviews: 234,
    tags: ["clothing", "casual", "cotton"],
  },
  {
    name: "Modern Table Lamp",
    slug: "modern-table-lamp",
    description:
      "Elegant LED table lamp with adjustable brightness and USB charging port.",
    price: 39.99,
    comparePrice: 0,
    category: "Home & Garden",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
        publicId: "sample",
      },
    ],
    stock: 45,
    isActive: true,
    isFeatured: true,
    rating: 4.6,
    numReviews: 67,
    tags: ["lighting", "home", "led"],
  },
  {
    name: "Yoga Mat Pro",
    slug: "yoga-mat-pro",
    description:
      "Extra thick non-slip yoga mat perfect for all types of workouts.",
    price: 34.99,
    comparePrice: 49.99,
    category: "Sports",
    images: [
      {
        url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
        publicId: "sample",
      },
    ],
    stock: 75,
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    numReviews: 156,
    tags: ["yoga", "fitness", "exercise"],
  },
  {
    name: "The Complete Guide to Web Development",
    slug: "complete-guide-web-development",
    description:
      "Comprehensive book covering HTML, CSS, JavaScript, and modern frameworks.",
    price: 29.99,
    comparePrice: 0,
    category: "Books",
    images: [
      {
        url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500",
        publicId: "sample",
      },
    ],
    stock: 60,
    isActive: true,
    isFeatured: false,
    rating: 4.9,
    numReviews: 342,
    tags: ["programming", "education", "web development"],
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Get a user ID to assign as vendor (you'll need to replace this with an actual user ID from your database)
    const User = mongoose.model("User");
    const user = await User.findOne({ role: "vendor" });

    if (!user) {
      console.log(
        "No vendor user found. Please create a vendor account first."
      );
      return;
    }

    // Add vendor to all products
    const productsWithVendor = sampleProducts.map((product) => ({
      ...product,
      vendor: user._id,
    }));

    await Product.deleteMany({}); // Clear existing products
    await Product.insertMany(productsWithVendor);

    console.log("Sample products seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
