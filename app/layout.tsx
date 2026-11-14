import type { Metadata } from 'next';
import './globals.css';
import { SITE_URL } from '@/lib/categories';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Less Regret — 후회가 적은 삶',
    template: '%s · Less Regret',
  },
  description:
    '인생의 후회 67가지를 한 장의 카드로. 코넬대 레거시 프로젝트, 다니엘 핑크의 세계 후회 설문, 하버드 성인발달연구, 국가문해교육센터 전국 성인문해교육 시화전이 들려주는 이야기와 오늘 바로 해볼 수 있는 작은 실천.',
  keywords: [
    '후회',
    '후회가 적은 삶',
    'LessRegret',
    '인생 조언',
    '노년',
    '코넬 레거시 프로젝트',
    '다니엘 핑크',
    '후회 연구',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Less Regret',
    locale: 'ko_KR',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    title: 'Less Regret — 후회가 적은 삶',
    description: '67장의 카드로 만나는, 후회를 줄이는 가장 구체적인 방법.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Less Regret — 후회가 적은 삶',
    description: '67장의 카드로 만나는, 후회를 줄이는 가장 구체적인 방법.',
  },
  alternates: {
    canonical: '/',
    languages: {
      ko: '/ko',
      en: '/en',
    },
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600&family=Noto+Serif+KR:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#FDFBF7" />
      </head>
      <body className="bg-paper text-ink min-h-screen antialiased selection:bg-accentGold/30">
        {children}
      </body>
    </html>
  );
}
