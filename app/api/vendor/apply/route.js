import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
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

    const { shopName, shopDescription } = await request.json();

    if (!shopName || !shopDescription) {
      return NextResponse.json(
        {
          success: false,
          message: "Business name and description are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.role === "vendor") {
      return NextResponse.json(
        { success: false, message: "You are already a vendor" },
        { status: 400 }
      );
    }

    // Check if already has complete pending application
    if (
      user.vendorInfo?.applicationStatus === "pending" &&
      user.vendorInfo?.shopName &&
      user.vendorInfo?.shopDescription
    ) {
      return NextResponse.json(
        { success: false, message: "You already have a pending application" },
        { status: 400 }
      );
    }

    // Create or update vendor application
    user.vendorInfo = {
      ...user.vendorInfo,
      shopName: shopName,
      shopDescription: shopDescription,
      applicationStatus: "pending",
      isApproved: false,
      appliedAt: user.vendorInfo?.appliedAt || new Date(),
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message:
        "Vendor application submitted successfully. You will be notified once reviewed.",
    });
  } catch (error) {
    console.error("Error submitting vendor application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit application" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id).select("vendorInfo role");

    return NextResponse.json({
      success: true,
      application: user.vendorInfo || { applicationStatus: "none" },
      isVendor: user.role === "vendor",
    });
  } catch (error) {
    console.error("Error fetching vendor application:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
