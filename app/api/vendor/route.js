import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    // Get all vendors
    const vendors = await User.find({ role: "vendor" })
      .select("name email businessName")
      .lean();

    // Get product count for each vendor
    const vendorsWithCounts = await Promise.all(
      vendors.map(async (vendor) => {
        const productCount = await Product.countDocuments({
          vendor: vendor._id,
        });
        return {
          ...vendor,
          productCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      vendors: vendorsWithCounts,
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
