import type { MetadataRoute } from "next";
import { SITE } from "@/lib/contact";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/basic-sense", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/sparring", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/basic", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/pattern", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/cutting", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/equipment", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/reference", priority: 0.6, changeFrequency: "monthly" as const },
  ];
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
