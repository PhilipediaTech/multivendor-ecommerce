import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import Review from "@/models/Review";
import Order from "@/models/Order";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        success: true,
        canReview: false,
        reason: "Not logged in",
      });
    }

    await connectDB();

    // Check if already reviewed
    const existingReview = await Review.findOne({
      product: params.id,
      user: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json({
        success: true,
        canReview: false,
        reason: "Already reviewed",
      });
    }

    // Check if user has delivered order with this product
    const deliveredOrder = await Order.findOne({
      customer: session.user.id,
      status: "delivered",
      "items.product": params.id,
    });

    if (!deliveredOrder) {
      return NextResponse.json({
        success: true,
        canReview: false,
        reason: "No delivered order",
      });
    }

    return NextResponse.json({
      success: true,
      canReview: true,
      orderId: deliveredOrder._id,
    });
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
