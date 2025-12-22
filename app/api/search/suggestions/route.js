import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        suggestions: [],
      });
    }

    // Find matching products
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    })
      .select("name category image price")
      .limit(5)
      .lean();

    // Get unique category suggestions
    const categories = await Product.distinct("category", {
      category: { $regex: query, $options: "i" },
    });

    const suggestions = {
      products: products.map((p) => ({
        _id: p._id,
        name: p.name,
        category: p.category,
        image: p.images?.[0] || "/placeholder.png",
        price: p.price,
      })),
      categories: categories.slice(0, 3),
    };

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Error getting search suggestions:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
