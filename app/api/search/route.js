import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const minPrice = parseFloat(searchParams.get("minPrice")) || 0;
    const maxPrice = parseFloat(searchParams.get("maxPrice")) || Infinity;
    const sort = searchParams.get("sort") || "relevance";
    const limit = parseInt(searchParams.get("limit")) || 20;

    // Build search query
    let searchQuery = {};

    // Text search
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      searchQuery.category = category;
    }

    // Price range filter
    searchQuery.price = { $gte: minPrice, $lte: maxPrice };

    // Sort options
    let sortOption = {};
    switch (sort) {
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      case "name":
        sortOption = { name: 1 };
        break;
      case "rating":
        sortOption = { rating: -1, numReviews: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      default:
        // Relevance: prioritize products with query in name
        if (query) {
          sortOption = { rating: -1, numReviews: -1 };
        } else {
          sortOption = { createdAt: -1 };
        }
    }

    // Execute search
    const products = await Product.find(searchQuery)
      .sort(sortOption)
      .limit(limit)
      .populate("vendor", "name")
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(searchQuery);

    // Get available categories for filters
    const categories = await Product.distinct("category");

    return NextResponse.json({
      success: true,
      products,
      total,
      categories,
      query: {
        q: query,
        category,
        minPrice,
        maxPrice,
        sort,
      },
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
