import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { generateOrderNumber } from "@/lib/utils/helpers";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { items, shippingAddress, paymentIntentId } = await request.json();

    await connectDB();

    // Validate and get full product details
    const productIds = items.map((item) => item._id);
    const products = await Product.find({ _id: { $in: productIds } });

    // Create order items with full details
    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item._id);

      if (!product) {
        throw new Error(`Product ${item._id} not found`);
      }

      return {
        product: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        vendor: product.vendor,
      };
    });

    // Calculate totals
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.2; // 20% VAT
    const total = subtotal + shipping + tax;

    // Create order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: session.user.id,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      paymentInfo: {
        method: "stripe",
        transactionId: paymentIntentId,
        status: "paid",
      },
      status: "pending",
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
