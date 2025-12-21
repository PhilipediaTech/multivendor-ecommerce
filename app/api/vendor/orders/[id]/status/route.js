import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "vendor") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { status, trackingNumber } = await request.json();

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the order and verify vendor owns products in it
    const order = await Order.findById(params.id).populate(
      "customer",
      "name email"
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Verify vendor has products in this order
    const vendorHasProducts = order.items.some(
      (item) => item.vendor.toString() === session.user.id
    );

    if (!vendorHasProducts) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to update this order",
        },
        { status: 403 }
      );
    }

    // Update order status
    const updateData = { status };
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    const updatedOrder = await Order.findByIdAndUpdate(params.id, updateData, {
      new: true,
    }).populate("customer", "name email");

    // Send status update email
    try {
      const { orderStatusUpdateTemplate } = await import(
        "@/lib/utils/emailTemplates"
      );
      const { sendEmail } = await import("@/lib/utils/email");

      const emailContent = orderStatusUpdateTemplate(
        updatedOrder,
        updatedOrder.customer.name,
        status
      );

      await sendEmail(
        updatedOrder.customer.email,
        emailContent.subject,
        emailContent.html,
        emailContent.text
      );

      console.log(`✅ Order status update email sent: ${status}`);
    } catch (emailError) {
      console.error("❌ Failed to send status update email:", emailError);
      // Don't fail the status update if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 }
    );
  }
}
