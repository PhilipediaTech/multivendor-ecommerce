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

    const vendorId = session.user.id;

    // Get all orders containing vendor's products
    const allOrders = await Order.find({
      "items.vendor": vendorId,
    }).lean();

    // Calculate stats
    let totalOrders = allOrders.length;
    let totalRevenue = 0;
    let pendingOrders = 0;
    let processingOrders = 0;
    let shippedOrders = 0;
    let deliveredOrders = 0;

    allOrders.forEach((order) => {
      // Calculate revenue from vendor's items only
      const vendorItems = order.items.filter(
        (item) => item.vendor.toString() === vendorId
      );
      const orderRevenue = vendorItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      totalRevenue += orderRevenue;

      // Count by status
      if (order.status === "pending") pendingOrders++;
      if (order.status === "processing") processingOrders++;
      if (order.status === "shipped") shippedOrders++;
      if (order.status === "delivered") deliveredOrders++;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
