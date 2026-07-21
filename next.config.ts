import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Published sites used to live under /site/<slug>; they're at the root
      // now. Without this an old link resolves to the /[slug] route with
      // slug="site", showing a bogus "Site not found" instead of the site.
      { source: "/site/:slug", destination: "/:slug", permanent: true },
      { source: "/site/:slug/:path*", destination: "/:slug/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
