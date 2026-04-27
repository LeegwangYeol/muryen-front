import type { MetadataRoute } from "next";
import { SITE } from "@/lib/contact";

const HERO_IMAGE = `${SITE.url}/images/announce/gumiAllone.webp`;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      path: "",
      priority: 1.0,
      changeFrequency: "weekly" as const,
      images: [HERO_IMAGE],
    },
    {
      path: "/about",
      priority: 0.9,
      changeFrequency: "monthly" as const,
      images: [HERO_IMAGE],
    },
    {
      path: "/basic-sense",
      priority: 0.9,
      changeFrequency: "monthly" as const,
      images: [HERO_IMAGE, `${SITE.url}/images/basic.avif`, `${SITE.url}/images/basic.jpeg`],
    },
    {
      path: "/sparring",
      priority: 0.9,
      changeFrequency: "monthly" as const,
      images: [HERO_IMAGE, `${SITE.url}/images/sparring.png`, `${SITE.url}/images/armour.png`],
    },
    {
      path: "/basic",
      priority: 0.8,
      changeFrequency: "monthly" as const,
      images: [`${SITE.url}/images/basic.avif`, `${SITE.url}/images/basic.jpeg`],
    },
    {
      path: "/pattern",
      priority: 0.8,
      changeFrequency: "monthly" as const,
      images: [`${SITE.url}/images/pattern.png`, `${SITE.url}/images/hero.jpeg`],
    },
    {
      path: "/cutting",
      priority: 0.8,
      changeFrequency: "monthly" as const,
      images: [`${SITE.url}/images/cutting.png`],
    },
    {
      path: "/equipment",
      priority: 0.7,
      changeFrequency: "monthly" as const,
      images: [`${SITE.url}/images/armour.png`],
    },
    {
      path: "/reference",
      priority: 0.6,
      changeFrequency: "monthly" as const,
      images: [HERO_IMAGE],
    },
  ];
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    images: r.images,
  }));
}
