import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import CustomCursor from "@/components/CustomCursor";
import ChatWidget from "@/components/ChatWidget";
import { fetchSettings, str } from "@/lib/settings";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSettings();
  const ga4Id = str(settings.ga4_measurement_id);
  const gtmId = str(settings.gtm_container_id);

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {gtmId && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}
        {ga4Id && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}');`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <Providers>
          <CustomCursor />
          {children}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
