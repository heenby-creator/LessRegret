#!/usr/bin/env node
/**
 * data/cards.json 무결성 검사.
 * 실행: npm run check:cards
 * 57장 · ID 두 자리 숫자 · 한/영 필드 분리 · 빈 인용 없음 을 보증한다.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = join(here, '..', 'data', 'cards.json');
const cards = JSON.parse(readFileSync(dataPath, 'utf8'));

const CATEGORIES = {
  '사랑·결혼': { en: 'Marriage & Love', slug: 'love' },
  '일·커리어': { en: 'Work & Career', slug: 'work' },
  '돈·자산': { en: 'Money & Wealth', slug: 'money' },
  '가족·친구': { en: 'Family & Friends', slug: 'family' },
  '몸·마음': { en: 'Body & Mind', slug: 'body' },
  '나·시간': { en: 'Self & Time', slug: 'self' },
};

const REQUIRED = [
  'id', 'category', 'categoryEn', 'categorySlug', 'title', 'titleEn',
  'storyKo', 'storyEn', 'quoteKo', 'quoteEn', 'quoteAttrKo', 'quoteAttrEn',
  'source', 'sourceEn', 'sourceShortKo', 'sourceShortEn', 'sourceUrl',
  'oneLiner', 'oneLinerEn', 'actionTagsKo', 'actionTagsEn',
];
const EN_FIELDS = ['categoryEn', 'titleEn', 'storyEn', 'quoteEn', 'quoteAttrEn', 'sourceEn', 'sourceShortEn', 'oneLinerEn'];
const HANGUL = /[가-힣]/;

const problems = [];
if (cards.length !== 57) problems.push(`카드 수 ${cards.length} (57장이어야 함)`);

const ids = new Set();
const titles = new Set();
const titlesEn = new Set();

for (const card of cards) {
  const id = card.id ?? '(없음)';
  if (!/^\d{2}$/.test(id)) problems.push(`${id}: ID는 두 자리 숫자여야 함`);
  if (ids.has(id)) problems.push(`${id}: ID 중복`);
  ids.add(id);

  for (const key of REQUIRED) {
    const value = card[key];
    const empty =
      value === undefined || value === null ||
      (typeof value === 'string' && !value.trim()) ||
      (Array.isArray(value) && value.length === 0);
    if (empty) problems.push(`${id}: 빈 필드 ${key}`);
  }

  const cat = CATEGORIES[card.category];
  if (!cat) problems.push(`${id}: 알 수 없는 카테고리 ${card.category}`);
  else if (card.categoryEn !== cat.en || card.categorySlug !== cat.slug)
    problems.push(`${id}: 카테고리 영문/슬러그 불일치`);

  for (const field of EN_FIELDS) {
    if (typeof card[field] === 'string' && HANGUL.test(card[field]))
      problems.push(`${id}: 영문 필드에 한글 (${field})`);
  }
  for (const tag of card.actionTagsEn ?? []) {
    if (HANGUL.test(tag)) problems.push(`${id}: 영문 태그에 한글 (${tag})`);
  }

  if (titles.has(card.title)) problems.push(`${id}: 한글 제목 중복`);
  if (titlesEn.has(card.titleEn)) problems.push(`${id}: 영문 제목 중복`);
  titles.add(card.title);
  titlesEn.add(card.titleEn);

  if (!/^https:\/\//.test(card.sourceUrl ?? '')) problems.push(`${id}: 출처 URL 형식 오류`);
}

if (problems.length) {
  console.error(`❌ 카드 검증 실패 (${problems.length}건)`);
  for (const p of problems) console.error('  -', p);
  process.exit(1);
}

const counts = {};
for (const card of cards) counts[card.category] = (counts[card.category] ?? 0) + 1;
console.log(`✅ 카드 ${cards.length}장 · ID 01–57 · 한/영 필드 분리 검증 통과`);
console.log('   ' + Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(' · '));
