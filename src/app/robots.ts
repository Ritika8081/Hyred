import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://hyred.io"; // change to your real production domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/unlock"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
