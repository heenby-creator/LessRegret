import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SetHtmlLang } from "@/components/SetHtmlLang";
import { copy, isLang } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: "ko" }, { lang: "en" }];
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  if (!isLang(params.lang)) return {};
  const description = copy[params.lang].homeDescription;
  return {
    description,
    alternates: {
      canonical: `/${params.lang}`,
      languages: { ko: "/ko", en: "/en", "x-default": "/en" },
    },
    openGraph: {
      siteName: "LessRegret",
      locale: params.lang === "ko" ? "ko_KR" : "en_US",
      type: "website",
      description,
    },
  };
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLang(params.lang)) notFound();

  return (
    <>
      <SetHtmlLang lang={params.lang} />
      {children}
    </>
  );
}
