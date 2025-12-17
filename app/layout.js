import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MarketHub - Multi-Vendor Ecommerce Platform",
  description:
    "A modern multi-vendor marketplace connecting buyers with multiple sellers",
  keywords: ["ecommerce", "marketplace", "multi-vendor", "online shopping"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
