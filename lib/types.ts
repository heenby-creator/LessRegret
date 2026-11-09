export const CATEGORIES = ["marriage", "career", "family", "life"] as const;
export const REGRET_TYPES = ["foundation", "boldness", "moral", "connection"] as const;
export const LANGS = ["ko", "en"] as const;

export type Category = (typeof CATEGORIES)[number];
export type RegretType = (typeof REGRET_TYPES)[number];
export type Lang = (typeof LANGS)[number];
export type Tone = "cream" | "dusk" | "blush" | "sage";

export type Localized = { ko: string; en: string };

export type Card = {
  id: string;
  category: Category;
  regretType: RegretType;
  age: number;
  antiBifl: Localized[];
  hook: Localized;
  quote: Localized;
  source: Localized;
  title: Localized;
  essay: Localized;
  tips: { ko: string[]; en: string[] };
};
