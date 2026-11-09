import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareBar } from "@/components/ShareBar";
import { SiteHeader } from "@/components/SiteHeader";
import { getCard, getCards, getNeighbors } from "@/lib/cards";
import { categoryMeta, copy, isLang, regretMeta } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

type Props = { params: { lang: string; id: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCards().map((card) => ({ id: card.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  if (!isLang(params.lang)) return {};
  const card = getCard(params.id);
  if (!card) return {};

  const lang = params.lang;
  const title = card.title[lang];
  const description = card.hook[lang];
  const path = `/${lang}/card/${card.id}`;

  return {
    title,
    description,
    keywords: [
      categoryMeta[card.category].label[lang],
      regretMeta[card.regretType][lang],
      ...card.antiBifl.map((item) => item[lang]),
    ],
    alternates: {
      canonical: path,
      languages: {
        ko: `/ko/card/${card.id}`,
        en: `/en/card/${card.id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      locale: lang === "ko" ? "ko_KR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function CardPage({ params }: Props) {
  if (!isLang(params.lang)) notFound();
  const card = getCard(params.id);
  if (!card) notFound();

  const lang = params.lang;
  const text = copy[lang];
  const tone = categoryMeta[card.category].tone;
  const other = lang === "ko" ? "en" : "ko";
  const { prev, next } = getNeighbors(card.id);
  const url = `${SITE_URL}/${lang}/card/${card.id}`;
  const paragraphs = card.essay[lang].split("\n\n").filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: card.title[lang],
    description: card.hook[lang],
    inLanguage: lang,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "LessRegret", url: SITE_URL },
    publisher: { "@type": "Organization", name: "LessRegret", url: SITE_URL },
    keywords: card.antiBifl.map((item) => item[lang]).join(", "),
  };

  return (
    <main className={`stage tone-${tone}`}>
      <div className="relative z-10 mx-auto min-h-dvh w-full max-w-2xl px-4 pb-16 pt-[max(1rem,env(safe-area-inset-top))]">
        <SiteHeader lang={lang} switchHref={`/${other}/card/${card.id}`} tone={tone} />
        <article className="paper-panel mt-6 rounded-[1.6rem] px-5 py-7 sm:px-9 sm:py-10">
          <p className="text-[12px] tracking-[0.14em] text-clay">
            {categoryMeta[card.category].label[lang]} · {regretMeta[card.regretType][lang]}
          </p>
          <h1 className="mt-3 font-serif text-[2.05rem] leading-tight tracking-tight text-ink sm:text-4xl">
            {card.title[lang]}
          </h1>
          <p className="mt-3 text-sm text-mute">{text.age(card.age)}</p>
          <p className="mt-8 font-serif text-xl leading-snug text-ink">{card.hook[lang]}</p>

          <p className="mt-8 text-[11px] uppercase tracking-[0.16em] text-mute">{text.antiLabel}</p>
          <p className="mt-2 text-sm leading-relaxed text-mute">{text.antiGloss}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {card.antiBifl.map((item) => (
              <li key={item.en} className="rounded-full bg-[#F6EFE6] px-3 py-1 text-[13px] text-ink">
                {item[lang]}
              </li>
            ))}
          </ul>

          <blockquote className="mt-8 border-t border-line pt-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mute">{text.sourceLabel}</p>
            <p className="mt-3 font-serif text-[1.55rem] leading-snug text-ink">{card.quote[lang]}</p>
            <footer className="mt-4 text-sm leading-relaxed text-mute">{card.source[lang]}</footer>
          </blockquote>

          <h2 className="mt-10 font-serif text-[1.7rem] text-ink">{text.essayHeading}</h2>
          <div className="mt-4 space-y-4 text-[16px] leading-8 text-ink/90">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <h2 className="mt-10 font-serif text-[1.7rem] text-ink">{text.tipsHeading}</h2>
          <ol className="mt-4 space-y-3">
            {card.tips[lang].map((tip, index) => (
              <li key={tip} className="flex gap-3 text-[16px] leading-7">
                <span className="font-serif text-clay">{String(index + 1).padStart(2, "0")}</span>
                <span>{tip}</span>
              </li>
            ))}
          </ol>

          <ShareBar
            lang={lang}
            title={card.title[lang]}
            text={card.hook[lang]}
            url={url}
            imageUrl={`${url}/opengraph-image`}
          />

          <nav className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-6">
            {prev ? (
              <Link href={`/${lang}/card/${prev.id}`} className="text-sm text-mute">
                {text.prevCard}
                <span className="mt-1 block font-serif text-base text-ink">{prev.title[lang]}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/${lang}/card/${next.id}`} className="text-right text-sm text-mute">
                {text.nextCard}
                <span className="mt-1 block font-serif text-base text-ink">{next.title[lang]}</span>
              </Link>
            ) : null}
          </nav>
          <p className="mt-8">
            <Link href={`/${lang}`} className="text-sm text-clay underline decoration-clay/40 underline-offset-4">
              {text.deck}
            </Link>
          </p>
        </article>
        {tone === "dusk" ? (
          <p className="mt-4 text-center text-[11px] text-[#D9D0C4]">{text.photoCredit}</p>
        ) : null}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
