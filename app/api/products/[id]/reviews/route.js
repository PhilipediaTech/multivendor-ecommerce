import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get all reviews for a product
export async function GET(request, context) {
  try {
    const params = await context.params;
    await connectDB();

    const reviews = await Review.find({ product: params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// Create a new review
export async function POST(request, context) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { rating, title, comment, orderId } = await request.json();

    // Validate input
    if (!rating || !title || !comment || !orderId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify the order exists and belongs to the user
    const order = await Order.findOne({
      _id: orderId,
      customer: session.user.id,
      status: "delivered", // Only delivered orders can be reviewed
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found or not eligible for review",
        },
        { status: 404 }
      );
    }

    // Verify the product is in the order
    const productInOrder = order.items.find(
      (item) => item.product.toString() === params.id
    );

    if (!productInOrder) {
      return NextResponse.json(
        { success: false, message: "Product not found in this order" },
        { status: 404 }
      );
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      product: params.id,
      user: session.user.id,
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      product: params.id,
      user: session.user.id,
      order: orderId,
      rating: Number(rating),
      title,
      comment,
      verified: true,
    });

    // Update product rating
    await updateProductRating(params.id);

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);

    // Handle duplicate review error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to submit review" },
      { status: 500 }
    );
  }
}

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const reviews = await Review.find({ product: productId });

    const numReviews = reviews.length;
    const rating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / numReviews;

    await Product.findByIdAndUpdate(productId, {
      rating: rating.toFixed(1),
      numReviews,
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
}
