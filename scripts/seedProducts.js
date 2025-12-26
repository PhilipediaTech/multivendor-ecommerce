const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// IMPORTANT: Replace with your actual MongoDB connection string
const MONGODB_URI =
  "mongodb+srv://philipediatech:abDTx6IgP8VRf1ro@multivendorapp.ysost5m.mongodb.net/?appName=multivendorApp&retryWrites=true&w=majority";

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    comparePrice: { type: Number, default: 0 },
    category: { type: String, required: true },
    images: [String],
    stock: { type: Number, default: 0 },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    tags: [String],
    specifications: { type: Map, of: String },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  vendorInfo: {
    shopName: String,
    shopDescription: String,
    isApproved: Boolean,
    applicationStatus: String,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Function to generate slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// 40 Products with REAL, MATCHING Images from Unsplash
const products = [
  // ELECTRONICS (10 products)
  {
    name: "Apple iPhone 15 Pro Max 256GB",
    description:
      "The ultimate iPhone with A17 Pro chip, titanium design, and advanced camera system. Features 6.7-inch Super Retina XDR display with ProMotion technology, 48MP main camera, and all-day battery life. Capture stunning 4K video and enjoy desktop-class gaming performance.",
    price: 1199.99,
    comparePrice: 1299.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      "https://images.unsplash.com/photo-1695048064490-b024c3c0a9e5?w=800&q=80",
      "https://images.unsplash.com/photo-1695653422715-991ec3a0db8a?w=800&q=80",
    ],
    stock: 45,
    tags: ["smartphone", "apple", "iphone", "5g"],
    isFeatured: true,
  },
  {
    name: 'Samsung 65" QLED 4K Smart TV',
    description:
      "Immerse yourself in stunning 4K resolution with Quantum HDR technology. Features Motion Rate 240, built-in streaming apps, AI upscaling, and voice control with Bixby and Alexa. Perfect for movies, gaming, and sports.",
    price: 899.99,
    comparePrice: 1099.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
      "https://images.unsplash.com/photo-1593359863207-64aac8ae4b2f?w=800&q=80",
      "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&q=80",
    ],
    stock: 20,
    tags: ["tv", "samsung", "4k", "smart-tv"],
    isFeatured: true,
  },
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description:
      "Industry-leading noise cancellation meets exceptional Hi-Res audio quality. Features 30-hour battery life, multipoint connection, speak-to-chat technology, and premium comfort. Perfect for travel, work, or music enjoyment.",
    price: 399.99,
    comparePrice: 449.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    ],
    stock: 80,
    tags: ["headphones", "sony", "wireless", "noise-cancelling"],
  },
  {
    name: 'MacBook Pro 14" M3 Chip',
    description:
      "Supercharged for professionals with Apple M3 chip. Features stunning Liquid Retina XDR display, up to 22 hours battery life, and blazing-fast performance. Perfect for creative work, coding, and multitasking.",
    price: 1999.99,
    comparePrice: 2199.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
    ],
    stock: 30,
    tags: ["laptop", "apple", "macbook", "pro"],
    isFeatured: true,
  },
  {
    name: 'iPad Air 11" with M2 Chip',
    description:
      "Powerful, colorful, and versatile. Features stunning Liquid Retina display, M2 chip performance, and support for Apple Pencil Pro. Perfect for creativity, productivity, and entertainment.",
    price: 599.99,
    comparePrice: 649.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80",
      "https://images.unsplash.com/photo-1585790050230-5dd28404f113?w=800&q=80",
    ],
    stock: 60,
    tags: ["tablet", "apple", "ipad", "m2"],
  },
  {
    name: "Canon EOS R6 Mark II Camera",
    description:
      "Professional mirrorless camera with 24.2MP full-frame sensor. Features 40fps continuous shooting, 6K video, in-body stabilization, and advanced autofocus. Perfect for photography enthusiasts and professionals.",
    price: 2499.99,
    comparePrice: 2699.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1606980707986-7b0411b5f935?w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    ],
    stock: 15,
    tags: ["camera", "canon", "mirrorless", "photography"],
  },
  {
    name: "DJI Mavic 3 Pro Drone",
    description:
      "Professional drone with Hasselblad camera and tri-camera system. Features 4K/120fps video, 46-minute flight time, omnidirectional obstacle sensing, and intelligent flight modes.",
    price: 1799.99,
    comparePrice: 1999.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
      "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800&q=80",
      "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=800&q=80",
    ],
    stock: 25,
    tags: ["drone", "dji", "aerial", "photography"],
  },
  {
    name: "Nintendo Switch OLED Model",
    description:
      "Enhanced gaming console with vibrant 7-inch OLED screen. Features improved audio, 64GB storage, wide adjustable stand, and dock with wired LAN port. Play at home or on the go.",
    price: 349.99,
    comparePrice: 379.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80",
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80",
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&q=80",
    ],
    stock: 70,
    tags: ["gaming", "nintendo", "switch", "console"],
    isFeatured: true,
  },
  {
    name: "Bose SoundLink Revolve+ Speaker",
    description:
      "Premium portable Bluetooth speaker with 360-degree sound. Features 17-hour battery life, water-resistant design, built-in microphone, and wireless range of 30 feet. Perfect for indoor and outdoor use.",
    price: 299.99,
    comparePrice: 329.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    ],
    stock: 55,
    tags: ["speaker", "bose", "bluetooth", "portable"],
  },
  {
    name: "Apple Watch Series 9 GPS 45mm",
    description:
      "Advanced health and fitness tracking with always-on Retina display. Features heart rate monitoring, ECG, blood oxygen sensor, sleep tracking, and crash detection. Works seamlessly with iPhone.",
    price: 429.99,
    comparePrice: 459.99,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
    ],
    stock: 90,
    tags: ["smartwatch", "apple", "fitness", "health"],
  },

  // FASHION (10 products)
  {
    name: "Men's Premium Leather Jacket",
    description:
      "Timeless style with genuine cowhide leather construction. Features YKK zippers, multiple pockets, quilted lining, and tailored fit. Available in black and brown. Perfect for any season and occasion.",
    price: 299.99,
    comparePrice: 399.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    ],
    stock: 35,
    tags: ["jacket", "leather", "mens", "outerwear"],
  },
  {
    name: "Women's Designer Handbag",
    description:
      "Elegant Italian leather handbag with gold-tone hardware. Features multiple compartments, adjustable strap, signature logo, and premium craftsmanship. Perfect for everyday use or special occasions.",
    price: 449.99,
    comparePrice: 549.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    ],
    stock: 28,
    tags: ["handbag", "luxury", "leather", "womens"],
    isFeatured: true,
  },
  {
    name: "Men's Slim Fit Denim Jeans",
    description:
      "Classic slim-fit jeans in premium stretch denim. Features five-pocket styling, button fly, and comfortable fit. Perfect for casual or smart-casual occasions. Available in multiple washes.",
    price: 79.99,
    comparePrice: 99.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80",
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80",
    ],
    stock: 100,
    tags: ["jeans", "denim", "mens", "casual"],
  },
  {
    name: "Women's Silk Evening Dress",
    description:
      "Elegant floor-length evening dress in luxurious silk blend. Features flattering A-line silhouette, concealed zipper, and delicate draping. Perfect for weddings, galas, and formal events.",
    price: 199.99,
    comparePrice: 279.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    ],
    stock: 40,
    tags: ["dress", "evening", "formal", "womens"],
  },
  {
    name: "Unisex Running Sneakers",
    description:
      "High-performance running shoes with responsive cushioning. Features breathable mesh upper, durable rubber outsole, and lightweight design. Perfect for running, training, and everyday wear.",
    price: 129.99,
    comparePrice: 159.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
    ],
    stock: 120,
    tags: ["sneakers", "running", "athletic", "shoes"],
  },
  {
    name: "Men's Cashmere Sweater",
    description:
      "Luxurious 100% cashmere crew neck sweater. Features ribbed cuffs and hem, soft hand feel, and timeless design. Available in multiple colors. Perfect for layering or wearing alone.",
    price: 189.99,
    comparePrice: 249.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
    ],
    stock: 50,
    tags: ["sweater", "cashmere", "mens", "knitwear"],
  },
  {
    name: "Women's Sunglasses UV Protection",
    description:
      "Designer sunglasses with 100% UV protection. Features polarized lenses, durable metal frames, and elegant styling. Includes protective case and cleaning cloth. Perfect for sunny days.",
    price: 149.99,
    comparePrice: 199.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80",
    ],
    stock: 75,
    tags: ["sunglasses", "accessories", "womens", "uv-protection"],
  },
  {
    name: "Leather Belt with Buckle",
    description:
      "Premium full-grain leather belt with polished buckle. Features adjustable fit, classic design, and exceptional durability. Available in black and brown. Perfect for formal and casual wear.",
    price: 59.99,
    comparePrice: 79.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1581115260669-ffbfd4401935?w=800&q=80",
    ],
    stock: 85,
    tags: ["belt", "leather", "accessories", "unisex"],
  },
  {
    name: "Women's Wool Winter Coat",
    description:
      "Elegant wool blend coat with timeless silhouette. Features button closure, side pockets, fully lined interior, and warm insulation. Perfect for cold weather in style.",
    price: 349.99,
    comparePrice: 449.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
      "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    ],
    stock: 30,
    tags: ["coat", "winter", "wool", "womens"],
  },
  {
    name: "Designer Watch Chronograph",
    description:
      "Sophisticated chronograph watch with stainless steel case. Features sapphire crystal, water resistance to 100m, date display, and premium leather strap. Perfect statement piece.",
    price: 599.99,
    comparePrice: 749.99,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
    ],
    stock: 45,
    tags: ["watch", "chronograph", "luxury", "accessories"],
    isFeatured: true,
  },

  // HOME & GARDEN (10 products)
  {
    name: "Professional Coffee Maker 12-Cup",
    description:
      "Programmable drip coffee maker with thermal carafe. Features auto-brew scheduling, brew strength control, 2-hour auto-shutoff, and easy-clean design. Includes permanent filter.",
    price: 129.99,
    comparePrice: 169.99,
    category: "Home & Garden",
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800&q=80",
    ],
    stock: 65,
    tags: ["coffee", "kitchen", "appliance", "drip"],
  },
  {
    name: "Luxury Velvet Throw Pillows Set of 4",
    description:
      "Premium velvet decorative pillows in coordinating colors. Features invisible zippers, plush filling, machine-washable covers, and elegant design. Perfect for sofas, beds, or accent chairs.",
    price: 79.99,
    comparePrice: 99.99,
    category: "Home & Garden",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    ],
    stock: 55,
    tags: ["pillows", "decor", "velvet", "living-room"],
  },
  {
    name: "Dyson V15 Cordless Vacuum",
    description:
      "Powerful cordless vacuum with laser dust detection. Features 60-minute runtime, HEPA filtration, LCD screen, and whole-machine deep cleaning. Includes multiple attachments.",
    price: 649.99,
    comparePrice: 749.99,
    category: "Home & Garden",
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80",
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=800&q=80",
    ],
    stock: 40,
    tags: ["vacuum", "dyson", "cordless", "cleaning"],
    isFeatured: true,
  },
  {
    name: "Indoor Herb Garden Kit",
    description:
      "Complete hydroponic growing system for fresh herbs. Features LED grow lights, automatic watering, and space for 12 plants. Includes seed pods for basil, mint, and parsley.",
    price: 89.99,
    comparePrice: 119.99,
    category: "Home & Garden",
    images: [
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80",
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    ],
    stock: 70,
    tags: ["garden", "herbs", "hydroponic", "indoor"],
  },
  {
    name: "Egyptian Cotton Sheet Set Queen",
    description:
      "Luxurious 800-thread-count Egyptian cotton sheets. Features deep pockets, breathable fabric, fade-resistant colors, and machine washable. Includes flat sheet, fitted sheet, and pillowcases.",
    price: 149.99,
    comparePrice: 199.99,
    category: "Home & Garden",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    ],
    stock: 80,
    tags: ["bedding", "sheets", "cotton", "luxury"],
  },
  {
    name: "Smart LED Floor Lamp",
    description:
      "Modern floor lamp with WiFi control and color-changing LED. Features voice control compatibility, adjustable brightness, scheduling, and energy-efficient lighting. Perfect for any room.",
    price: 119.99,
    comparePrice: 159.99,
    category: "Home & Garden",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      "https://images.unsplash.com/photo-1541341918087-e5c4f0754a3b?w=800&q=80",
    ],
    stock: 60,
    tags: ["lighting", "smart-home", "led", "floor-lamp"],
  },
  {
    name: "Non-Stick Cookware Set 10-Piece",
    description:
      "Professional-grade non-stick cookware with glass lids. Features even heat distribution, dishwasher safe, oven safe to 400°F, and ergonomic handles. Includes essential pots and pans.",
    price: 199.99,
    comparePrice: 279.99,
    category: "Home & Garden",
    images: [
      "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",
      "https://images.unsplash.com/photo-1584990347449-39b0e4f02587?w=800&q=80",
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    ],
    stock: 45,
    tags: ["cookware", "kitchen", "non-stick", "pots-pans"],
  },
  {
    name: "Memory Foam Mattress Topper Queen",
    description:
      "Premium 3-inch memory foam topper with cooling gel. Features pressure relief, hypoallergenic cover, CertiPUR-US certified foam, and machine washable cover. Enhances any mattress.",
    price: 159.99,
    comparePrice: 219.99,
    category: "Home & Garden",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80",
      "https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=800&q=80",
    ],
    stock: 50,
    tags: ["mattress", "memory-foam", "bedding", "sleep"],
  },
  {
    name: "Artificial Fiddle Leaf Fig Tree 6ft",
    description:
      "Realistic artificial plant with natural-looking leaves. Features sturdy trunk, adjustable branches, UV-resistant materials, and decorative pot. Perfect for home or office decor.",
    price: 189.99,
    comparePrice: 249.99,
    category: "Home & Garden",
    images: [
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80",
      "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80",
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80",
    ],
    stock: 35,
    tags: ["plants", "artificial", "decor", "indoor"],
  },
  {
    name: "Robot Vacuum with Mapping",
    description:
      "Smart robot vacuum with room mapping and app control. Features 2000Pa suction, auto-charging, scheduling, and works on carpets and hard floors. Includes virtual boundaries.",
    price: 349.99,
    comparePrice: 449.99,
    category: "Home & Garden",
    images: [
      "https://images.unsplash.com/photo-1586864387634-9fb4cb230a4a?w=800&q=80",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80",
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    ],
    stock: 55,
    tags: ["vacuum", "robot", "smart-home", "cleaning"],
  },

  // SPORTS & FITNESS (5 products)
  {
    name: "Premium Yoga Mat 6mm with Strap",
    description:
      'Eco-friendly TPE yoga mat with excellent cushioning. Features non-slip texture both sides, moisture-resistant surface, and includes carrying strap. Dimensions: 72" x 24" x 6mm.',
    price: 39.99,
    comparePrice: 59.99,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    ],
    stock: 130,
    tags: ["yoga", "mat", "fitness", "exercise"],
  },
  {
    name: "Adjustable Dumbbell Set 50lbs",
    description:
      "Space-saving adjustable dumbbells with quick-change weight selection. Features 5-50lb range in 5lb increments, compact design, and durable construction. Perfect for home gym.",
    price: 299.99,
    comparePrice: 399.99,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
      "https://images.unsplash.com/photo-1583454156750-89592a5a5a70?w=800&q=80",
    ],
    stock: 40,
    tags: ["dumbbells", "weights", "home-gym", "strength"],
    isFeatured: true,
  },
  {
    name: "Road Bike Carbon Fiber 21-Speed",
    description:
      "Lightweight carbon fiber road bike with Shimano components. Features dual disc brakes, 700c wheels, comfortable saddle, and aerodynamic design. Perfect for commuting and fitness.",
    price: 1299.99,
    comparePrice: 1599.99,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800&q=80",
      "https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800&q=80",
    ],
    stock: 20,
    tags: ["bike", "cycling", "carbon", "road"],
  },
  {
    name: "Smart Fitness Tracker Watch",
    description:
      "Advanced fitness tracker with heart rate monitoring. Features GPS, sleep tracking, 20 sport modes, 7-day battery life, and water resistance. Sync with smartphone app.",
    price: 149.99,
    comparePrice: 199.99,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80",
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=800&q=80",
      "https://images.unsplash.com/photo-1614014097762-d4a3e5c98e65?w=800&q=80",
    ],
    stock: 95,
    tags: ["fitness-tracker", "smartwatch", "health", "gps"],
  },
  {
    name: "Resistance Bands Set with Handles",
    description:
      "Complete resistance band set with 5 levels. Features comfortable handles, door anchor, ankle straps, and carry bag. Perfect for strength training, stretching, and rehabilitation.",
    price: 29.99,
    comparePrice: 49.99,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80",
      "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800&q=80",
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    ],
    stock: 150,
    tags: ["resistance-bands", "fitness", "portable", "training"],
  },

  // BOOKS (5 products)
  {
    name: "Bestseller Fiction Collection 5 Books",
    description:
      "Curated collection of 5 bestselling fiction novels including contemporary, mystery, and thriller genres. Features top-rated authors and award-winning titles. Includes bookmarks and reading guide.",
    price: 59.99,
    comparePrice: 89.99,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80",
      "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&q=80",
    ],
    stock: 180,
    tags: ["books", "fiction", "bestseller", "collection"],
  },
  {
    name: "Complete Python Programming Guide",
    description:
      "Comprehensive guide to Python programming for beginners to advanced. Covers fundamentals, data structures, OOP, web development, and machine learning. Includes practical exercises and projects.",
    price: 49.99,
    comparePrice: 69.99,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    ],
    stock: 120,
    tags: ["programming", "python", "coding", "tech"],
  },
  {
    name: "The Art of Cooking Cookbook",
    description:
      "Professional cookbook with over 300 recipes. Features international cuisine, step-by-step instructions, full-color photos, and cooking techniques. Perfect for home chefs.",
    price: 39.99,
    comparePrice: 54.99,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80",
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80",
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80",
    ],
    stock: 90,
    tags: ["cookbook", "recipes", "cooking", "culinary"],
  },
  {
    name: "Mindfulness and Meditation Guide",
    description:
      "Complete guide to mindfulness practices and meditation techniques. Features daily exercises, breathing techniques, stress reduction methods, and scientific research. Transform your mental well-being.",
    price: 24.99,
    comparePrice: 34.99,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    ],
    stock: 140,
    tags: ["mindfulness", "meditation", "self-help", "wellness"],
  },
  {
    name: "Complete World Atlas Hardcover",
    description:
      "Detailed world atlas with updated maps and geographical information. Features political and physical maps, population data, climate information, and stunning photography. Educational and beautiful.",
    price: 79.99,
    comparePrice: 99.99,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&q=80",
      "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=800&q=80",
      "https://images.unsplash.com/photo-1451417379553-15d8e8f49cde?w=800&q=80",
    ],
    stock: 60,
    tags: ["atlas", "geography", "maps", "reference"],
  },
];

async function seedProducts() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Find or create vendor
    console.log("👤 Finding/Creating vendor user...");
    let vendor = await User.findOne({
      role: "vendor",
      email: "vendor@markethub.com",
    });

    if (!vendor) {
      const hashedPassword = await bcrypt.hash("vendor123", 10);
      vendor = await User.create({
        name: "MarketHub Official Store",
        email: "vendor@markethub.com",
        password: hashedPassword,
        role: "vendor",
        vendorInfo: {
          shopName: "MarketHub Official Store",
          shopDescription:
            "Premium products from trusted brands across all categories",
          isApproved: true,
          applicationStatus: "approved",
        },
      });
      console.log("✅ Created vendor user: vendor@markethub.com");
      console.log("   Password: vendor123\n");
    } else {
      console.log("✅ Found existing vendor:", vendor.email, "\n");
    }

    // Clear existing products
    console.log("🗑️  Clearing existing products...");
    const deleteResult = await Product.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} existing products\n`);

    // Generate products with slugs and vendor
    console.log("📦 Preparing products...");
    const productsToInsert = products.map((product) => ({
      ...product,
      slug: generateSlug(product.name),
      vendor: vendor._id,
      specifications: new Map([
        ["Brand", "Premium"],
        ["Warranty", "1 Year"],
        ["Condition", "New"],
        ["Shipping", "Free Shipping"],
      ]),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert products
    console.log("💾 Inserting products into database...\n");
    const createdProducts = await Product.insertMany(productsToInsert);

    console.log("✅ Successfully added", createdProducts.length, "products!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 PRODUCT SUMMARY BY CATEGORY");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // Group by category
    const categories = {};
    createdProducts.forEach((product) => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });

    // Display summary
    Object.keys(categories)
      .sort()
      .forEach((category) => {
        console.log(`📁 ${category} (${categories[category].length} products)`);
        categories[category].forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.name}`);
          console.log(
            `      Price: £${product.price} | Stock: ${product.stock} | Images: ${product.images.length}`
          );
        });
        console.log("");
      });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n🎉 Database seeded successfully!");
    console.log(
      `\n📸 Total images: ${createdProducts.length * 3} (3 per product)`
    );
    console.log("\n🔐 VENDOR LOGIN CREDENTIALS:");
    console.log("   Email: vendor@markethub.com");
    console.log("   Password: vendor123");
    console.log("\n🌐 Next Steps:");
    console.log("   1. Make sure images.unsplash.com is in next.config.mjs");
    console.log("   2. Visit your site and browse products");
    console.log("   3. All images are real product photos from Unsplash");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR SEEDING DATABASE:");
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(1);
  }
}

// Run the seeder
seedProducts();
