import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import HtmlLang from '@/components/HtmlLang';
import { SITE_URL } from '@/lib/categories';

export function generateStaticParams() {
  return [{ lang: 'ko' }, { lang: 'en' }];
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const isKo = params.lang === 'ko';
  return {
    title: isKo ? '후회가 적은 삶 — 67장의 카드' : 'Less Regret — 67 cards',
    description: isKo
      ? '살아본 사람들이 먼저 후회한 67가지. 한 장씩 넘기며 오늘 할 수 있는 작은 실천을 만나보세요.'
      : 'Sixty-seven regrets people named at the end. Flip one card at a time and leave with one small thing to do today.',
    alternates: {
      canonical: `${SITE_URL}/${params.lang}`,
      languages: { ko: `${SITE_URL}/ko`, en: `${SITE_URL}/en` },
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
  const isKo = params.lang === 'ko';

  return (
    <div className="flex flex-col min-h-screen">
      <HtmlLang lang={params.lang} />
      <SiteHeader lang={params.lang} />
      <main className="flex-1 flex flex-col">{children}</main>
      <footer className="border-t border-borderSoft mt-4">
        <div className="max-w-xl mx-auto w-full px-4 py-6 text-center">
          <p className="font-serif text-[12px] text-inkMuted">
            {isKo ? 'Less Regret · 후회가 적은 삶' : 'Less Regret · Less Regret Life'}
          </p>
          <p className="mt-1.5 text-[10.5px] leading-relaxed text-inkFaint">
            {isKo
              ? '코넬대 레거시 프로젝트 · 다니엘 핑크 세계 후회 설문 · 하버드 성인발달연구 · 국가문해교육센터 시화전'
              : 'Cornell Legacy Project · Daniel Pink’s World Regret Survey · Harvard Study of Adult Development · National Literacy Poetry Exhibition'}
          </p>
        </div>
      </footer>
    </div>
  );
}
