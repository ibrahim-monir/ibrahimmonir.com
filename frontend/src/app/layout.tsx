import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import CustomCursor from "@/components/CustomCursor";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Ibrahim Monir — Full-Stack Developer", template: "%s | Ibrahim Monir" },
  description: "Full-stack developer specializing in Laravel, Next.js, and modern web solutions. Building premium products and custom systems.",
  metadataBase: new URL("https://ibrahimmonir.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ibrahimmonir.com",
    siteName: "Ibrahim Monir",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", creator: "@ibrahimmonir" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <CustomCursor />
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
