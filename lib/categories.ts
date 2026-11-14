export type CategorySlug = 'love' | 'work' | 'money' | 'family' | 'body' | 'self';

export interface Category {
  slug: CategorySlug;
  ko: string;
  en: string;
  /** 카드 앞면 상단에 쓰는 짧은 영문 라벨 */
  shortEn: string;
  /** 카드 배경 톤 */
  tone: 'warm' | 'ink' | 'sand' | 'sage' | 'stone' | 'dusk';
  accent: string;
}

/** 6대 카테고리 — 데이터의 categorySlug 와 1:1로 맞춘다. */
export const CATEGORIES: Category[] = [
  { slug: 'love', ko: '사랑·결혼', en: 'Marriage & Love', shortEn: 'Love', tone: 'warm', accent: '#B9856B' },
  { slug: 'work', ko: '일·커리어', en: 'Work & Career', shortEn: 'Work', tone: 'ink', accent: '#C2A382' },
  { slug: 'money', ko: '돈·자산', en: 'Money & Wealth', shortEn: 'Money', tone: 'sand', accent: '#A8894F' },
  { slug: 'family', ko: '가족·친구', en: 'Family & Friends', shortEn: 'Family', tone: 'sage', accent: '#7E8B6E' },
  { slug: 'body', ko: '몸·마음', en: 'Body & Mind', shortEn: 'Body', tone: 'stone', accent: '#8A8F94' },
  { slug: 'self', ko: '나·시간', en: 'Self & Time', shortEn: 'Self', tone: 'dusk', accent: '#8E7C9B' },
];

export const CATEGORY_BY_SLUG: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);

export function categoryLabel(slug: string, lang: string): string {
  const cat = CATEGORY_BY_SLUG[slug];
  if (!cat) return slug;
  return lang === 'ko' ? cat.ko : cat.en;
}

export const LOCALES = ['ko', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

const RAW_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lessregret.life').trim();

/**
 * 사이트의 canonical 절대 주소.
 *
 * Vercel 은 non-www(lessregret.life) → www(www.lessregret.life) 로 308 리다이렉트를 건다.
 * 카톡·X·페이스북 스크래퍼는 og:image **이미지 URL 의 리다이렉트**를 따라가지 못해
 * 썸네일을 통째로 빠뜨리므로, canonical·og:url·og:image·sitemap 은 리다이렉트를 타지 않는
 * www 호스트로 통일한다. (화면에 찍히거나 이미지 안에 그려지는 브랜드 텍스트
 * `lessregret.life` 는 표기용이므로 그대로 둔다)
 */
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, '').replace(
  /^(https?:\/\/)lessregret\.life/,
  '$1www.lessregret.life'
);
