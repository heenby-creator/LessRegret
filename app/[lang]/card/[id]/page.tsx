import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  CARD_COUNT,
  cards,
  categoryOf,
  getCard,
  neighboursOf,
  practiceOf,
  quoteAttrOf,
  quoteOf,
  regretTypeOf,
  sourceOf,
  storyOf,
  tagsOf,
  titleOf,
} from '@/lib/cards';
import { CATEGORIES, LOCALES, SITE_URL } from '@/lib/categories';

export function generateStaticParams() {
  const params: { lang: string; id: string }[] = [];
  for (const lang of LOCALES) {
    for (const card of cards) params.push({ lang, id: card.id });
  }
  return params;
}

export function generateMetadata({
  params,
}: {
  params: { lang: string; id: string };
}): Metadata {
  const card = getCard(params.id);
  if (!card) return {};
  const isKo = params.lang === 'ko';
  const title = titleOf(card, isKo ? 'ko' : 'en').replace('\n', ' ');
  const description = (isKo ? card.storyKo : card.storyEn).slice(0, 150);

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${params.lang}/card/${card.id}`,
      languages: {
        ko: `${SITE_URL}/ko/card/${card.id}`,
        en: `${SITE_URL}/en/card/${card.id}`,
      },
    },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}/${params.lang}/card/${card.id}`,
      siteName: 'Less Regret',
      locale: isKo ? 'ko_KR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function CardDetailPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const isKo = params.lang === 'ko';
  const card = getCard(params.id);
  if (!card) notFound();

  const { prev, next } = neighboursOf(card);
  const category = CATEGORIES.find((c) => c.slug === card.categorySlug);
  const positionInCategory =
    cards.filter((c) => c.categorySlug === card.categorySlug).findIndex((c) => c.id === card.id) + 1;

  return (
    <article className="max-w-xl mx-auto w-full px-5 pt-6 pb-10">
      <Link
        href={`/${params.lang}`}
        className="inline-flex items-center gap-1.5 text-[11.5px] text-inkMuted hover:text-ink"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {isKo ? '카드 덱으로' : 'Back to the deck'}
      </Link>

      <header className="mt-5">
        <div className="flex items-center justify-between text-[11px]">
          <span
            className="px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${category?.accent ?? '#C2A382'}18`, color: '#4A423A' }}
          >
            {categoryOf(card, isKo ? 'ko' : 'en')}
            <span className="ml-1.5 opacity-60">
              {positionInCategory}/{cards.filter((c) => c.categorySlug === card.categorySlug).length}
            </span>
          </span>
          <span className="font-mono text-inkFaint">
            #{card.id} / {CARD_COUNT}
          </span>
        </div>

        <h1 className="mt-4 font-serif text-[27px] sm:text-[30px] font-semibold leading-[1.4] text-ink whitespace-pre-line">
          {titleOf(card, isKo ? 'ko' : 'en')}
        </h1>

        <div className="mt-3 flex items-center gap-2 text-[10.5px] text-inkFaint">
          <span className="w-6 h-[1.5px]" style={{ backgroundColor: category?.accent ?? '#C2A382' }} />
          <span>{regretTypeOf(card, isKo ? 'ko' : 'en')}</span>
          <span>·</span>
          <span>{isKo ? card.targetAge : 'All ages'}</span>
        </div>
      </header>

      <section className="mt-7">
        <p className="font-serif text-[15px] leading-[1.95] text-ink/85 whitespace-pre-line">
          {storyOf(card, isKo ? 'ko' : 'en')}
        </p>
      </section>

      <blockquote className="mt-7 border-l-2 border-accentGold pl-4 py-1">
        <p className="font-serif text-[14.5px] italic leading-[1.8] text-ink/85">
          {quoteOf(card, isKo ? 'ko' : 'en')}
        </p>
        <cite className="mt-2 block text-[11px] not-italic text-inkFaint">
          — {quoteAttrOf(card, isKo ? 'ko' : 'en')}
        </cite>
      </blockquote>

      <section className="mt-7 rounded-2xl bg-paperMuted/60 border border-borderSoft px-5 py-4">
        <p className="text-[10px] tracking-[0.16em] text-accentGold font-semibold">
          {isKo ? '오늘의 실천' : 'TODAY’S PRACTICE'}
        </p>
        <p className="mt-2 font-serif text-[15px] leading-[1.8] text-ink">
          {practiceOf(card, isKo ? 'ko' : 'en')}
        </p>
      </section>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {tagsOf(card, isKo ? 'ko' : 'en').map((tag) => (
          <span key={tag} className="text-[11px] bg-paperMuted text-inkMuted px-2.5 py-1 rounded-md">
            #{tag}
          </span>
        ))}
      </div>

      <section className="mt-8 pt-5 border-t border-borderSoft">
        <p className="text-[10px] tracking-[0.16em] text-inkFaint font-semibold">
          {isKo ? '출처' : 'SOURCE'}
        </p>
        <p className="mt-1.5 text-[12px] text-inkMuted">{sourceOf(card, isKo ? 'ko' : 'en')}</p>
        <a
          href={card.sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-accentGold hover:underline"
        >
          {isKo ? '원문 보기' : 'Read the original'}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </section>

      <nav className="mt-9 grid grid-cols-2 gap-2.5">
        <Link
          href={`/${params.lang}/card/${prev.id}`}
          className="group rounded-xl border border-borderSoft px-3.5 py-3 hover:bg-paperMuted/60 transition-colors"
        >
          <span className="text-[10px] text-inkFaint flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            {isKo ? '이전 카드' : 'Previous'}
          </span>
          <span className="mt-1 block font-serif text-[12.5px] leading-snug text-ink line-clamp-2">
            {titleOf(prev, isKo ? 'ko' : 'en').replace('\n', ' ')}
          </span>
        </Link>
        <Link
          href={`/${params.lang}/card/${next.id}`}
          className="group rounded-xl border border-borderSoft px-3.5 py-3 text-right hover:bg-paperMuted/60 transition-colors"
        >
          <span className="text-[10px] text-inkFaint flex items-center gap-1 justify-end">
            {isKo ? '다음 카드' : 'Next'}
            <ArrowRight className="w-3 h-3" />
          </span>
          <span className="mt-1 block font-serif text-[12.5px] leading-snug text-ink line-clamp-2">
            {titleOf(next, isKo ? 'ko' : 'en').replace('\n', ' ')}
          </span>
        </Link>
      </nav>
    </article>
  );
}
