import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/agent", "/customer", "/dashboard", "/tickets", "/api"]
    },
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
