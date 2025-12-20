const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "YOUR_MONGODB_URI_HERE";

async function fixIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const User = mongoose.model(
      "User",
      new mongoose.Schema({}, { strict: false })
    );

    // Drop duplicate indexes
    await User.collection.dropIndex("email_1").catch(() => {});

    console.log("Indexes fixed!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

fixIndexes();
