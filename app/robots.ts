import type { MetadataRoute } from "next";
import { SITE } from "@/lib/contact";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/daily",
          "/api",
          "/test",
          "/test2",
          "/login",
          "/location",
          "/know-how",
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
