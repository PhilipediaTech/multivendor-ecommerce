import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";

    await connectDB();

    const query = {};
    if (status === "all") {
      query["vendorInfo.applicationStatus"] = {
        $in: ["pending", "approved", "rejected"],
      };
    } else {
      query["vendorInfo.applicationStatus"] = status;
    }

    const applications = await User.find(query)
      .select("name email vendorInfo createdAt")
      .sort({ "vendorInfo.appliedAt": -1 })
      .lean();

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error fetching vendor applications:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
