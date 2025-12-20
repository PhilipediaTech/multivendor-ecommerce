import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const [totalUsers, totalVendors, totalProducts, totalOrders, orders] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "vendor" }),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.find().lean(),
      ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt")
      .lean();

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber customer total status createdAt")
      .populate("customer", "name email")
      .lean();

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentUsers,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
