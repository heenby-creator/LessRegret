import type { MetadataRoute } from "next";
import { getCards } from "@/lib/cards";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const cards = getCards();
  const langs = ["ko", "en"] as const;

  return [
    ...langs.map((lang) => ({
      url: `${SITE_URL}/${lang}`,
      changeFrequency: "monthly" as const,
      priority: 1,
    })),
    ...langs.flatMap((lang) =>
      cards.map((card) => ({
        url: `${SITE_URL}/${lang}/card/${card.id}`,
        changeFrequency: "yearly" as const,
        priority: 0.8,
      })),
    ),
  ];
}
