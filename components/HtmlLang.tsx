'use client';

import { useEffect } from 'react';

/** [lang] 세그먼트에 맞춰 <html lang> 을 바꾼다 (루트 레이아웃은 하나뿐이므로). */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'en' ? 'en' : 'ko';
    }
  }, [lang]);
  return null;
}
