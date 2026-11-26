import rawCards from '@/data/cards.json';
import { CATEGORY_BY_SLUG, CATEGORIES, type CategorySlug } from './categories';

export interface Card {
  id: string;
  category: string;
  categoryEn: string;
  categorySlug: CategorySlug;
  regretType: 'connection' | 'boldness' | 'moral' | 'foundation';
  regretTypeKo: string;
  regretTypeEn: string;
  title: string;
  titleEn: string;
  storyKo: string;
  storyEn: string;
  quoteKo: string;
  quoteEn: string;
  quoteAttrKo: string;
  quoteAttrEn: string;
  source: string;
  sourceEn: string;
  sourceShortKo: string;
  sourceShortEn: string;
  sourceUrl: string;
  oneLiner: string;
  oneLinerEn: string;
  actionTagsKo: string[];
  actionTagsEn: string[];
  targetAge: string;
  artifactPhoto?: string;
  artifactPhotoCaptionKo?: string;
  artifactPhotoCaptionEn?: string;
}

/** 카드 ID는 숫자만 쓴다 ("01", "02", …). 카드가 100장을 넘으면 세 자리("100")도 허용한다. */
export const CARD_ID_PATTERN = /^\d{2,3}$/;

/** 화면에 그리는 데 필요한 텍스트만 모은 타입 (클라이언트로 넘기는 payload). */
export type CardText = Pick<
  Card,
  | 'id'
  | 'category'
  | 'categoryEn'
  | 'categorySlug'
  | 'regretTypeKo'
  | 'regretTypeEn'
  | 'title'
  | 'titleEn'
  | 'storyKo'
  | 'storyEn'
  | 'quoteKo'
  | 'quoteEn'
  | 'quoteAttrKo'
  | 'quoteAttrEn'
  | 'sourceShortKo'
  | 'sourceShortEn'
  | 'oneLiner'
  | 'oneLinerEn'
  | 'actionTagsKo'
  | 'actionTagsEn'
  | 'artifactPhoto'
  | 'artifactPhotoCaptionKo'
  | 'artifactPhotoCaptionEn'
>;

export const cards = rawCards as Card[];

/** 카드 덱(클라이언트 컴포넌트)에 넘길 최소 데이터. */
export function toDeckCards(list: Card[] = cards): CardText[] {
  return list.map((card) => ({
    id: card.id,
    category: card.category,
    categoryEn: card.categoryEn,
    categorySlug: card.categorySlug,
    regretTypeKo: card.regretTypeKo,
    regretTypeEn: card.regretTypeEn,
    title: card.title,
    titleEn: card.titleEn,
    storyKo: card.storyKo,
    storyEn: card.storyEn,
    quoteKo: card.quoteKo,
    quoteEn: card.quoteEn,
    quoteAttrKo: card.quoteAttrKo,
    quoteAttrEn: card.quoteAttrEn,
    sourceShortKo: card.sourceShortKo,
    sourceShortEn: card.sourceShortEn,
    oneLiner: card.oneLiner,
    oneLinerEn: card.oneLinerEn,
    actionTagsKo: card.actionTagsKo,
    actionTagsEn: card.actionTagsEn,
    artifactPhoto: card.artifactPhoto,
    artifactPhotoCaptionKo: card.artifactPhotoCaptionKo,
    artifactPhotoCaptionEn: card.artifactPhotoCaptionEn,
  }));
}

export const CARD_COUNT = cards.length;

const EN_ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** 영문 메타데이터에 쓰는 카드 수 표기 (1~99는 영단어, 그 밖은 숫자). */
export function countInEnglish(n: number): string {
  if (n >= 0 && n < 20) return EN_ONES[n];
  if (n >= 20 && n < 100) return `${EN_TENS[Math.floor(n / 10)]}${n % 10 ? `-${EN_ONES[n % 10]}` : ''}`;
  return String(n);
}

/** 카드 번호의 마지막 값 ("01"~"89"). */
export const CARD_LAST_ID = String(CARD_COUNT).padStart(2, '0');

export function getCard(id: string): Card | undefined {
  return cards.find((card) => card.id === id);
}

export function getCardsByCategory(slug: string): Card[] {
  return cards.filter((card) => card.categorySlug === slug);
}

export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of CATEGORIES) counts[cat.slug] = 0;
  for (const card of cards) counts[card.categorySlug] = (counts[card.categorySlug] || 0) + 1;
  return counts;
}

/** 카드 앞면에 쓰는 짧은 출처. 긴 URL 은 화면에 노출하지 않는다. */
export function shortSource(card: CardText, lang: string): string {
  return lang === 'ko' ? card.sourceShortKo : card.sourceShortEn;
}

export function categoryOf(card: CardText, lang: string): string {
  return lang === 'ko' ? card.category : card.categoryEn;
}

export function titleOf(card: CardText, lang: string): string {
  return lang === 'ko' ? card.title : card.titleEn;
}

export function storyOf(card: CardText, lang: string): string {
  return lang === 'ko' ? card.storyKo : card.storyEn;
}

export function quoteOf(card: CardText, lang: string): string {
  return lang === 'ko' ? card.quoteKo : card.quoteEn;
}

export function quoteAttrOf(card: CardText, lang: string): string {
  return lang === 'ko' ? card.quoteAttrKo : card.quoteAttrEn;
}

export function sourceOf(card: Card, lang: string): string {
  return lang === 'ko' ? card.source : card.sourceEn;
}

export function practiceOf(card: CardText, lang: string): string {
  return lang === 'ko' ? card.oneLiner : card.oneLinerEn;
}

export function tagsOf(card: CardText, lang: string): string[] {
  return lang === 'ko' ? card.actionTagsKo : card.actionTagsEn;
}

export function regretTypeOf(card: CardText, lang: string): string {
  return lang === 'ko' ? card.regretTypeKo : card.regretTypeEn;
}

/** 이전/다음 카드 (같은 카테고리 안에서 순환) */
export function neighboursOf(card: Card): { prev: Card; next: Card } {
  const list = getCardsByCategory(card.categorySlug);
  const index = list.findIndex((c) => c.id === card.id);
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  return { prev, next };
}

/**
 * 빌드·배포 전 데이터 무결성 검사.
 * 문제가 있으면 문자열 배열을 돌려주고, 없으면 빈 배열을 돌려준다.
 */
export function validateCards(list: Card[] = cards): string[] {
  const problems: string[] = [];
  if (list.length < 1) problems.push('카드가 한 장도 없다');

  const ids = new Set<string>();
  const titles = new Set<string>();
  const titlesEn = new Set<string>();
  const englishFields: (keyof Card)[] = [
    'categoryEn',
    'titleEn',
    'storyEn',
    'quoteEn',
    'quoteAttrEn',
    'sourceEn',
    'sourceShortEn',
    'oneLinerEn',
  ];

  for (const card of list) {
    const label = card.id || '(id 없음)';
    if (!CARD_ID_PATTERN.test(card.id)) problems.push(`${label}: ID 형식 오류`);
    if (ids.has(card.id)) problems.push(`${label}: ID 중복`);
    ids.add(card.id);

    if (!CATEGORY_BY_SLUG[card.categorySlug]) problems.push(`${label}: 알 수 없는 카테고리`);
    if (!card.title?.trim()) problems.push(`${label}: 한글 제목 없음`);
    if (!card.titleEn?.trim()) problems.push(`${label}: 영문 제목 없음`);
    if (!card.storyKo?.trim()) problems.push(`${label}: 한글 스토리 없음`);
    if (!card.storyEn?.trim()) problems.push(`${label}: 영문 스토리 없음`);
    if (!card.quoteKo?.trim()) problems.push(`${label}: 한글 인용 없음`);
    if (!card.quoteEn?.trim()) problems.push(`${label}: 영문 인용 없음`);
    if (!card.oneLiner?.trim()) problems.push(`${label}: 한글 실천문 없음`);
    if (!card.oneLinerEn?.trim()) problems.push(`${label}: 영문 실천문 없음`);
    if (!card.actionTagsKo?.length) problems.push(`${label}: 한글 해시태그 없음`);
    if (!card.actionTagsEn?.length) problems.push(`${label}: 영문 해시태그 없음`);
    if (!card.sourceShortKo?.trim() || !card.sourceShortEn?.trim())
      problems.push(`${label}: 짧은 출처 없음`);
    if (!/^https:\/\//.test(card.sourceUrl)) problems.push(`${label}: 출처 URL 형식 오류`);

    for (const field of englishFields) {
      const value = card[field];
      if (typeof value === 'string' && /[가-힣]/.test(value)) {
        problems.push(`${label}: 영문 필드에 한글 (${field})`);
      }
    }

    if (titles.has(card.title)) problems.push(`${label}: 한글 제목 중복`);
    if (titlesEn.has(card.titleEn)) problems.push(`${label}: 영문 제목 중복`);
    titles.add(card.title);
    titlesEn.add(card.titleEn);
  }

  // 번호는 01부터 카드 수까지 빈틈없이 이어져야 한다 (02, 03 … 순서로 추가).
  const lastId = String(list.length).padStart(2, '0');
  const missing: string[] = [];
  for (let i = 1; i <= list.length; i += 1) {
    const expectedId = String(i).padStart(2, '0');
    if (!ids.has(expectedId)) missing.push(expectedId);
  }
  if (missing.length) {
    problems.push(
      `카드 번호가 01부터 ${lastId}까지 이어지지 않는다 (빠진 번호: ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ' 외' : ''})`,
    );
  }

  return problems;
}
