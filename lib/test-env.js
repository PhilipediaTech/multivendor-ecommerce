export function testEnvVariables() {
  console.log("Testing environment variables...");
  console.log("MongoDB:", process.env.MONGODB_URI ? "✅ Set" : "❌ Missing");
  console.log(
    "NextAuth Secret:",
    process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "Stripe Publishable:",
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "Stripe Secret:",
    process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing"
  );
  console.log(
    "Cloudinary Cloud:",
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing"
  );
}
