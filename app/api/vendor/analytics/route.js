import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
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
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get all orders containing vendor's products
    const orders = await Order.find({
      "items.vendor": vendorId,
      createdAt: { $gte: startDate, $lte: endDate },
    }).lean();

    // Calculate revenue over time (daily)
    const revenueByDay = {};
    const salesByDay = {};
    let totalRevenue = 0;
    let totalOrders = orders.length;

    orders.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split("T")[0];

      // Calculate revenue from vendor's items only
      const vendorItems = order.items.filter(
        (item) => item.vendor.toString() === vendorId
      );
      const orderRevenue = vendorItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      totalRevenue += orderRevenue;

      if (!revenueByDay[dateKey]) {
        revenueByDay[dateKey] = 0;
        salesByDay[dateKey] = 0;
      }
      revenueByDay[dateKey] += orderRevenue;
      salesByDay[dateKey] += 1;
    });

    // Format revenue data for charts
    const revenueData = Object.keys(revenueByDay)
      .sort()
      .map((date) => ({
        date,
        revenue: parseFloat(revenueByDay[date].toFixed(2)),
        sales: salesByDay[date],
      }));

    // Get product performance
    const products = await Product.find({ vendor: vendorId }).lean();

    const productSales = {};
    orders.forEach((order) => {
      order.items
        .filter((item) => item.vendor.toString() === vendorId)
        .forEach((item) => {
          const productId = item.product.toString();
          if (!productSales[productId]) {
            productSales[productId] = {
              productId,
              name: item.productName,
              quantity: 0,
              revenue: 0,
            };
          }
          productSales[productId].quantity += item.quantity;
          productSales[productId].revenue += item.price * item.quantity;
        });
    });

    // Top products by revenue
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        revenue: parseFloat(p.revenue.toFixed(2)),
        sales: p.quantity,
      }));

    // Category breakdown
    const categoryRevenue = {};
    products.forEach((product) => {
      const category = product.category || "Uncategorized";
      if (!categoryRevenue[category]) {
        categoryRevenue[category] = 0;
      }

      // Find sales for this product
      const sales = productSales[product._id.toString()];
      if (sales) {
        categoryRevenue[category] += sales.revenue;
      }
    });

    const categoryData = Object.keys(categoryRevenue).map((category) => ({
      name: category,
      value: parseFloat(categoryRevenue[category].toFixed(2)),
    }));

    // Order status breakdown
    const statusBreakdown = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      if (statusBreakdown[order.status] !== undefined) {
        statusBreakdown[order.status]++;
      }
    });

    const statusData = Object.keys(statusBreakdown).map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: statusBreakdown[status],
    }));

    // Calculate average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate growth (compare with previous period)
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - parseInt(period));

    const previousOrders = await Order.find({
      "items.vendor": vendorId,
      createdAt: { $gte: previousStartDate, $lt: startDate },
    }).lean();

    let previousRevenue = 0;
    previousOrders.forEach((order) => {
      const vendorItems = order.items.filter(
        (item) => item.vendor.toString() === vendorId
      );
      previousRevenue += vendorItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    });

    const revenueGrowth =
      previousRevenue > 0
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    const ordersGrowth =
      previousOrders.length > 0
        ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100
        : 0;

    return NextResponse.json({
      success: true,
      analytics: {
        summary: {
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          totalOrders,
          avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
          revenueGrowth: parseFloat(revenueGrowth.toFixed(2)),
          ordersGrowth: parseFloat(ordersGrowth.toFixed(2)),
        },
        revenueData,
        topProducts,
        categoryData,
        statusData,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
