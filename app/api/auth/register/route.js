import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine the actual role and vendor application status
    let actualRole = "customer";
    let vendorInfo = {};

    if (role === "vendor") {
      // User wants to be a vendor - create as customer with pending application
      actualRole = "customer";
      vendorInfo = {
        shopName: "", // Will be filled when they complete application
        shopDescription: "",
        applicationStatus: "pending",
        isApproved: false,
        appliedAt: new Date(),
      };
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: actualRole,
      vendorInfo: role === "vendor" ? vendorInfo : undefined,
    });

    // Send welcome email
    try {
      const { welcomeEmailTemplate } = await import(
        "@/lib/utils/emailTemplates"
      );
      const { sendEmail } = await import("@/lib/utils/email");

      const emailContent = welcomeEmailTemplate(user.name, user.email);

      await sendEmail(
        user.email,
        emailContent.subject,
        emailContent.html,
        emailContent.text
      );

      console.log("✅ Welcome email sent to:", user.email);
    } catch (emailError) {
      console.error("❌ Failed to send welcome email:", emailError);
    }

    // If vendor application, notify them about pending status
    if (role === "vendor") {
      console.log("📋 Vendor application created for:", user.email);
    }

    return NextResponse.json({
      success: true,
      message:
        role === "vendor"
          ? "Account created! Your vendor application is pending review."
          : "Account created successfully!",
      requiresApproval: role === "vendor",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
