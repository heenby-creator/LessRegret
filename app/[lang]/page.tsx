import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Deck } from "@/components/Deck";
import { getCards } from "@/lib/cards";
import { copy, isLang } from "@/lib/i18n";

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  if (!isLang(params.lang)) return {};
  return {
    title: { absolute: "LessRegret" },
    description: copy[params.lang].homeDescription,
    alternates: {
      canonical: `/${params.lang}`,
      languages: { ko: "/ko", en: "/en" },
    },
  };
}

export default function HomePage({ params }: { params: { lang: string } }) {
  if (!isLang(params.lang)) notFound();
  return <Deck lang={params.lang} cards={getCards()} />;
}
