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

    const body = await request.json();
    const { items, shippingAddress, paymentIntentId } = body;

    console.log("=== ORDER CREATION DEBUG ===");
    console.log("User:", session.user.id);
    console.log("Items received:", JSON.stringify(items, null, 2));
    console.log("Shipping:", JSON.stringify(shippingAddress, null, 2));

    await connectDB();

    // Validate and get full product details
    const productIds = items.map((item) => item._id);
    console.log("Product IDs to fetch:", productIds);

    const products = await Product.find({ _id: { $in: productIds } }).lean();
    console.log("Products found:", products.length);
    console.log(
      "Products:",
      JSON.stringify(
        products.map((p) => ({ id: p._id, name: p.name, price: p.price })),
        null,
        2
      )
    );

    // Create order items with full details
    const orderItems = [];

    for (const item of items) {
      const product = products.find(
        (p) => p._id.toString() === item._id.toString()
      );

      if (!product) {
        console.error(`Product not found: ${item._id}`);
        throw new Error(`Product ${item._id} not found`);
      }

      const price = Number(product.price);
      const quantity = Number(item.quantity);

      console.log(`Item: ${product.name}, Price: ${price}, Qty: ${quantity}`);

      if (isNaN(price) || isNaN(quantity)) {
        console.error(
          `Invalid price or quantity: price=${price}, qty=${quantity}`
        );
        throw new Error(
          `Invalid price or quantity for product ${product.name}`
        );
      }

      orderItems.push({
        product: product._id,
        productName: product.name,
        quantity: quantity,
        price: price,
        vendor: product.vendor,
      });
    }

    console.log("Order items created:", JSON.stringify(orderItems, null, 2));

    // Calculate totals - ensure all values are numbers
    let subtotal = 0;
    for (const item of orderItems) {
      const itemTotal = item.price * item.quantity;
      console.log(
        `${item.productName}: £${item.price} × ${item.quantity} = £${itemTotal}`
      );
      subtotal += itemTotal;
    }

    console.log("Subtotal calculated:", subtotal);

    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.2; // 20% VAT
    const total = subtotal + shipping + tax;

    console.log("Final calculations:");
    console.log("  Subtotal:", subtotal);
    console.log("  Shipping:", shipping);
    console.log("  Tax:", tax);
    console.log("  Total:", total);

    // Verify all numbers are valid
    if (isNaN(subtotal) || isNaN(shipping) || isNaN(tax) || isNaN(total)) {
      console.error("NaN DETECTED!", { subtotal, shipping, tax, total });
      throw new Error("Invalid order total calculation - NaN detected");
    }

    const orderData = {
      orderNumber: generateOrderNumber(),
      customer: session.user.id,
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      shippingAddress,
      paymentInfo: {
        method: "stripe",
        transactionId: paymentIntentId,
        status: "paid",
      },
      status: "pending",
    };

    console.log("Order data to save:", JSON.stringify(orderData, null, 2));

    // Create order
    const order = await Order.create(orderData);

    console.log("Order created successfully:", order._id);
    console.log("Order totals from DB:", {
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    console.log("Stock updated for all products");
    console.log("=== ORDER CREATION COMPLETE ===");

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
    console.error("=== ORDER CREATION ERROR ===");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
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
