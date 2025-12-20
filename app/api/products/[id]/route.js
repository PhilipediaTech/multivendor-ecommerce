import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(request, context) {
  try {
    // In Next.js 14+, params is a promise that needs to be awaited
    const params = await context.params;
    const productId = params.id;

    console.log("Looking for product with ID:", productId);

    await connectDB();

    console.log("Connected to database:", mongoose.connection.db.databaseName);
    console.log("Using collection:", Product.collection.name);

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log("Invalid ObjectId format");
      return NextResponse.json(
        { success: false, message: "Invalid product ID format" },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId)
      .populate("vendor", "name email vendorInfo")
      .lean();

    console.log("Product found:", product ? "Yes" : "No");

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // If vendor doesn't exist, set a default
    if (!product.vendor) {
      product.vendor = {
        _id: "unknown",
        name: "Unknown Vendor",
        vendorInfo: {
          shopName: "Unknown Shop",
          rating: 0,
        },
      };
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
