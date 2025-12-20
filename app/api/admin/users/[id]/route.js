import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Update user role
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

    const { role } = await request.json();

    if (!["customer", "vendor", "admin"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Prevent admin from deleting themselves
    if (params.id === session.user.id) {
      return NextResponse.json(
        { success: false, message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndDelete(params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
