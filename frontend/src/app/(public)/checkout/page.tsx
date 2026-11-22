import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Order a package and pay the advance by bKash, Nagad or bank transfer.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="py-16 md:py-20">
      <div className="container">
        {/* useSearchParams() needs a Suspense boundary in a static export. */}
        <Suspense fallback={null}>
          <CheckoutClient />
        </Suspense>
      </div>
    </div>
  );
}
