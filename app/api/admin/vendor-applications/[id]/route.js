import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request, context) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { action, rejectionReason } = await request.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }

    if (action === "reject" && !rejectionReason) {
      return NextResponse.json(
        { success: false, message: "Rejection reason is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.vendorInfo?.applicationStatus !== "pending") {
      return NextResponse.json(
        { success: false, message: "Application is not pending" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Approve vendor
      user.role = "vendor";
      user.vendorInfo.applicationStatus = "approved";
      user.vendorInfo.isApproved = true;
      user.vendorInfo.reviewedAt = new Date();
      user.vendorInfo.reviewedBy = session.user.id;
    } else {
      // Reject vendor
      user.vendorInfo.applicationStatus = "rejected";
      user.vendorInfo.isApproved = false;
      user.vendorInfo.reviewedAt = new Date();
      user.vendorInfo.reviewedBy = session.user.id;
      user.vendorInfo.rejectionReason = rejectionReason;
    }

    await user.save();

    // Send email notification
    try {
      const { sendVendorApplicationEmail } = await import(
        "@/lib/utils/emailTemplates"
      );
      const { sendEmail } = await import("@/lib/utils/email");

      const emailContent = sendVendorApplicationEmail(
        user.name,
        action === "approve",
        rejectionReason
      );

      await sendEmail(
        user.email,
        emailContent.subject,
        emailContent.html,
        emailContent.text
      );

      console.log(`✅ Vendor ${action} email sent to:`, user.email);
    } catch (emailError) {
      console.error("❌ Failed to send vendor application email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: `Vendor application ${
        action === "approve" ? "approved" : "rejected"
      } successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorInfo: user.vendorInfo,
      },
    });
  } catch (error) {
    console.error("Error processing vendor application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process application" },
      { status: 500 }
    );
  }
}
