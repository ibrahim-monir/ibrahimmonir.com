import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static HTML/CSS/JS (like upokoron's frontend/dist) -- no Node
  // process on the server at all, so the shared cPanel box (which also
  // carries two live e-commerce sites) sees near-zero load from this app.
  // Data (blog/services/testimonials) is pulled from the API at build time;
  // a new post only shows up after the next deploy, same as upokoron.
  output: "export",
  images: {
    // The Image Optimization API needs a Node server -- unavailable in
    // static export, so images are served as-is.
    unoptimized: true,
  },
  // redirects() is not supported by output: "export" (no server to run it
  // on). The same two redirects are done via .htaccess instead --
  // see frontend/public_html.htaccess.
};

export default nextConfig;
