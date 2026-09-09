import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/register", "/forgot-password", "/reset-password", "/portal", "/portal/*"],
    },
    sitemap: "https://ibrahimmonir.com/sitemap.xml",
  };
}
