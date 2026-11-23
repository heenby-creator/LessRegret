'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

/**
 * 헤더의 KO / EN 전환. 실제로 언어가 바뀔 때만 GA4 `switch_language` 를 보낸다.
 * 헤더 본문은 서버 컴포넌트로 남기고 이 조각만 클라이언트로 둔다.
 */
export default function LanguageSwitch({ lang }: { lang: string }) {
  const isKo = lang === 'ko';

  return (
    <nav className="flex items-center gap-1.5 text-[11.5px] font-medium" aria-label="Language">
      <Link
        href="/ko"
        onClick={() => {
          if (!isKo) trackEvent('switch_language', { to_lang: 'ko' });
        }}
        className={`px-2.5 py-1 rounded transition-colors ${
          isKo ? 'bg-ink text-paper' : 'text-inkMuted hover:text-ink'
        }`}
        aria-current={isKo ? 'page' : undefined}
      >
        KO
      </Link>
      <span className="text-borderSoft">/</span>
      <Link
        href="/en"
        onClick={() => {
          if (isKo) trackEvent('switch_language', { to_lang: 'en' });
        }}
        className={`px-2.5 py-1 rounded transition-colors ${
          !isKo ? 'bg-ink text-paper' : 'text-inkMuted hover:text-ink'
        }`}
        aria-current={!isKo ? 'page' : undefined}
      >
        EN
      </Link>
    </nav>
  );
}
