import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "vendor") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Build query - find orders that contain products from this vendor
    let query = {
      "items.vendor": session.user.id,
    };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("customer", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    // Filter items to only show vendor's products
    const filteredOrders = orders.map((order) => ({
      ...order,
      items: order.items.filter(
        (item) => item.vendor.toString() === session.user.id
      ),
    }));

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      orders: filteredOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching vendor orders:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
