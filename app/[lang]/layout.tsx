import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../globals.css';
import SiteHeader from '@/components/SiteHeader';
import { SITE_URL } from '@/lib/categories';

/**
 * 이 레이아웃이 사이트의 루트 레이아웃(<html>/<body>)이다.
 * `[lang]` 세그먼트마다 문서가 따로 만들어지므로 `<html lang>` 이
 * 서버 HTML 에 처음부터 실린다. (예전에는 클라이언트에서 사후 변경했다)
 */
export function generateStaticParams() {
  return [{ lang: 'ko' }, { lang: 'en' }];
}

export const viewport: Viewport = {
  themeColor: '#FDFBF7',
  width: 'device-width',
  initialScale: 1,
};

const META = {
  ko: {
    title: '후회가 적은 삶 — 67장의 카드',
    description:
      '살아본 사람들이 먼저 후회한 67가지. 한 장씩 넘기며 오늘 할 수 있는 작은 실천을 만나보세요.',
    ogDescription: '67장의 카드로 만나는, 후회를 줄이는 가장 구체적인 방법.',
  },
  en: {
    title: 'Less Regret — 67 cards',
    description:
      'Sixty-seven regrets people named at the end. Flip one card at a time and leave with one small thing to do today.',
    ogDescription: 'Sixty-seven cards on the regrets people name last — and the one small thing to do today.',
  },
} as const;

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang = params.lang === 'en' ? 'en' : 'ko';
  const isKo = lang === 'ko';
  const meta = META[lang];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: meta.title,
      template: '%s · Less Regret',
    },
    description: meta.description,
    keywords: isKo
      ? ['후회', '후회가 적은 삶', 'LessRegret', '인생 조언', '노년', '코넬 레거시 프로젝트', '다니엘 핑크', '후회 연구']
      : ['regret', 'Less Regret', 'life advice', 'Daniel Pink', 'Cornell Legacy Project', 'regret research'],
    openGraph: {
      type: 'website',
      siteName: 'Less Regret',
      locale: isKo ? 'ko_KR' : 'en_US',
      alternateLocale: [isKo ? 'en_US' : 'ko_KR'],
      url: `${SITE_URL}/${lang}`,
      title: meta.title,
      description: meta.ogDescription,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.ogDescription,
    },
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: { ko: `${SITE_URL}/ko`, en: `${SITE_URL}/en` },
    },
    robots: { index: true, follow: true },
  };
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang = params.lang === 'en' ? 'en' : 'ko';
  const isKo = lang === 'ko';

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600&family=Noto+Serif+KR:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* 카카오톡 공유 — 공식 Kakao JS SDK v2. 공개용 JavaScript 키라 문서에 그대로 둔다. */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-paper text-ink min-h-screen antialiased selection:bg-accentGold/30">
        <div className="flex flex-col min-h-screen">
          <SiteHeader lang={lang} />
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
      </body>
    </html>
  );
}
