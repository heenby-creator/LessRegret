/**
 * Google Analytics 4 (gtag.js) 헬퍼.
 *
 * 측정 ID 는 환경변수로 바꿀 수 있지만, 비워 두면 LessRegret 의 GA4 속성
 * (G-SE97ZKG31K)으로 간다. 스크립트 자체는 app/[lang]/layout.tsx 가
 * next/script(strategy="afterInteractive") 로 모든 페이지에 싣는다.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-SE97ZKG31K';

/** 이 사이트가 실제로 보내는 맞춤 이벤트와 각 이벤트의 파라미터 모양. */
export interface AnalyticsEventMap {
  /** 카드 펼치기(덱 앞면 클릭·키보드, 그리드에서 열기) */
  card_expand: { card_id: string; category: string; lang: string };
  /** 카톡 공유 버튼 */
  share_kakao: { card_id: string; lang: string };
  /** 링크 공유 버튼(시스템 공유시트/클립보드) */
  share_link: { card_id: string; lang: string };
  /** 카테고리 필터 탭 (전체 포함) */
  filter_category: { category: string; lang: string };
  /** 한/영 언어 전환 */
  switch_language: { to_lang: string };
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/**
 * GA4 로 맞춤 이벤트를 보낸다.
 * - 서버(SSR/SSG)에서는 아무 것도 하지 않는다.
 * - gtag 스크립트가 아직/차단되어 없으면 조용히 넘어간다(실패해도 화면 동작은 그대로).
 */
export function trackEvent<N extends AnalyticsEventName>(
  name: N,
  params: AnalyticsEventMap[N]
): void {
  if (typeof window === 'undefined') return;
  const gtag = window.gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', name, params);
}
