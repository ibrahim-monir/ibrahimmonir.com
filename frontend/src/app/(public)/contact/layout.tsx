import type { Metadata } from "next";

// page.tsx is a client component and can't export metadata itself.
export const metadata: Metadata = {
  title: "Contact",
  description: "Have a project in mind? Get in touch to discuss WordPress, WooCommerce, Laravel or Next.js development.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
