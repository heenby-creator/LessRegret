'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  LayoutGrid,
  MessageCircle,
  RotateCcw,
  Rows3,
  Share2,
} from 'lucide-react';
import { CATEGORIES, CATEGORY_BY_SLUG, SITE_URL, type Category } from '@/lib/categories';
import {
  type CardText,
  categoryOf,
  practiceOf,
  quoteAttrOf,
  quoteOf,
  regretTypeOf,
  shortSource,
  storyOf,
  tagsOf,
  titleOf,
} from '@/lib/cards';

const TONE_STYLES: Record<
  Category['tone'],
  { background: string; text: string; muted: string; border: string; pill: string }
> = {
  warm: {
    background: 'linear-gradient(160deg,#FAF1D9 0%,#FDFAF0 56%,#F7E9CE 100%)',
    text: '#221C17',
    muted: '#7A6A5B',
    border: 'rgba(180,150,120,0.28)',
    pill: 'rgba(185,133,107,0.12)',
  },
  ink: {
    background: 'linear-gradient(165deg,#191613 0%,#262019 60%,#12100E 100%)',
    text: '#F7F1E6',
    muted: 'rgba(247,241,230,0.62)',
    border: 'rgba(247,241,230,0.16)',
    pill: 'rgba(247,241,230,0.10)',
  },
  sand: {
    background: 'linear-gradient(160deg,#F4EBD8 0%,#FBF6EC 58%,#EFE3CB 100%)',
    text: '#241F16',
    muted: '#7C6E52',
    border: 'rgba(168,137,79,0.28)',
    pill: 'rgba(168,137,79,0.12)',
  },
  sage: {
    background: 'linear-gradient(160deg,#EEF0E6 0%,#F8F7F1 58%,#E6E9DC 100%)',
    text: '#20241C',
    muted: '#68705C',
    border: 'rgba(126,139,110,0.26)',
    pill: 'rgba(126,139,110,0.12)',
  },
  stone: {
    background: 'linear-gradient(160deg,#EFF0F1 0%,#FAF9F7 58%,#E7E9EA 100%)',
    text: '#1D2022',
    muted: '#62676B',
    border: 'rgba(138,143,148,0.26)',
    pill: 'rgba(138,143,148,0.12)',
  },
  dusk: {
    background: 'linear-gradient(160deg,#EFEAF1 0%,#FAF8FA 58%,#E7DFEC 100%)',
    text: '#221D26',
    muted: '#6B6173',
    border: 'rgba(142,124,155,0.26)',
    pill: 'rgba(142,124,155,0.12)',
  },
};

/**
 * 카테고리별 카드 앞면 배경 사진.
 * 사랑·결혼은 한/영 점묘 부부, 나머지 네 챕터는 색을 달리한 점묘 장면을 쓴다.
 * 돈·자산은 사진 없이 숫자 워터마크 모티프를 유지한다.
 */
const CATEGORY_PHOTO: Record<string, string> = {
  work: '/images/bg-career.jpg',
  family: '/images/bg-family.jpg',
  body: '/images/bg-health.jpg',
  self: '/images/bg-self.jpg',
};

/** 사진에서 인물·사물이 앉은 자리(오른쪽 아래)를 살리도록 잡는 초점. */
const CATEGORY_PHOTO_POSITION: Record<string, string> = {
  love: '72% 88%',
  work: '70% 80%',
  family: '68% 84%',
  body: '66% 84%',
  self: '74% 74%',
};

/** 사진 위에서도 검정 제목이 읽히도록 쓰는 잉크 팔레트. */
const PHOTO_PALETTE = {
  text: '#221C17',
  muted: '#6B6157',
  border: 'rgba(150,132,110,0.26)',
  pill: 'rgba(120,104,88,0.10)',
};

function photoFor(slug: string, isKo: boolean): string | null {
  if (slug === 'love') return `/images/pointillism-couple-${isKo ? 'ko' : 'en'}.jpg`;
  return CATEGORY_PHOTO[slug] ?? null;
}

function paletteFor(slug: string, isKo: boolean) {
  const category = CATEGORY_BY_SLUG[slug];
  const tone = TONE_STYLES[category?.tone ?? 'warm'];
  return photoFor(slug, isKo) ? PHOTO_PALETTE : tone;
}

function frontBackgroundFor(slug: string, isKo: boolean): string {
  const photo = photoFor(slug, isKo);
  const category = CATEGORY_BY_SLUG[slug];
  if (!photo) return TONE_STYLES[category?.tone ?? 'warm'].background;
  return `linear-gradient(178deg, rgba(253,250,240,0.94) 0%, rgba(253,250,240,0.87) 40%, rgba(252,248,240,0.58) 74%, rgba(252,248,240,0.24) 100%), url(${photo})`;
}

interface CardDeckProps {
  cards: CardText[];
  lang: string;
}

type ViewMode = 'deck' | 'grid';

/* ── 카카오톡 공유 (Kakao JS SDK v2) ─────────────────────────────
 * JavaScript 키는 웹에 그대로 노출되는 공개 키다(비밀키 아님).
 * 카카오 디벨로퍼스 > 앱 > 플랫폼 > Web 에 이 사이트 도메인이 등록되어 있어야
 * 실제 공유 창이 열린다.
 */
const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '6db01a6a14725138a28bf18da4c1c44a';
const KAKAO_SDK_SRC = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js';

type KakaoSdk = {
  isInitialized: () => boolean;
  init: (jsKey: string) => void;
  Share?: { sendDefault: (settings: unknown) => void };
};

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

/** SDK 가 준비될 때까지 기다린다. 레이아웃 스크립트가 아직이면 직접 한 번 더 싣는다. */
function ensureKakaoSdk(timeoutMs = 5000): Promise<KakaoSdk | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    const ready = (): KakaoSdk | null =>
      window.Kakao && typeof window.Kakao.init === 'function' && window.Kakao.Share
        ? window.Kakao
        : null;

    const already = ready();
    if (already) {
      resolve(already);
      return;
    }

    if (!document.querySelector('script[src*="kakao_js_sdk"]')) {
      const script = document.createElement('script');
      script.src = KAKAO_SDK_SRC;
      script.async = true;
      script.setAttribute('data-kakao-sdk', 'fallback');
      document.head.appendChild(script);
    }

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const sdk = ready();
      if (sdk) {
        window.clearInterval(timer);
        resolve(sdk);
        return;
      }
      if (Date.now() - startedAt > timeoutMs) {
        window.clearInterval(timer);
        resolve(null);
      }
    }, 120);
  });
}

/** 카톡 설명란·버튼에 들어갈 한 줄 텍스트로 다듬는다. */
function clampText(text: string, max: number): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1).trimEnd()}…`;
}

export default function CardDeck({ cards, lang }: CardDeckProps) {
  const isKo = lang === 'ko';
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [kakaoBusy, setKakaoBusy] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('deck');
  const deckRef = useRef<HTMLDivElement>(null);
  const backScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (backScrollRef.current) {
      backScrollRef.current.scrollTop = 0;
    }
  }, [currentIndex, isFlipped]);

  // SDK 가 준비되는 대로 Kakao.init 까지 끝내 둔다(첫 공유 때 바로 열리도록).
  useEffect(() => {
    let cancelled = false;
    ensureKakaoSdk().then((kakao) => {
      if (!kakao || cancelled) return;
      try {
        if (!kakao.isInitialized()) kakao.init(KAKAO_JS_KEY);
      } catch {
        /* 키·도메인 설정 문제로 init 이 막혀도 링크 공유는 그대로 동작한다 */
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCards = useMemo(
    () => (selectedCat === 'all' ? cards : cards.filter((c) => c.categorySlug === selectedCat)),
    [cards, selectedCat],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      map[cat.slug] = cards.filter((c) => c.categorySlug === cat.slug).length;
    }
    return map;
  }, [cards]);

  const card = filteredCards[currentIndex] || filteredCards[0];

  useEffect(() => {
    setCurrentIndex((index) => (index < filteredCards.length ? index : 0));
  }, [filteredCards.length]);

  const selectCategory = (slug: string) => {
    setSelectedCat(slug);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const nextCard = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  }, [filteredCards.length]);

  const prevCard = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  }, [filteredCards.length]);

  const toggleFlip = useCallback(() => setIsFlipped((flipped) => !flipped), []);

  /** 그리드에서 카드를 고르면 덱으로 넘어가 그 카드의 뒷면을 펼친다. */
  const openInDeck = (index: number) => {
    setCurrentIndex(index);
    setIsFlipped(true);
    setViewMode('deck');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const isControl = Boolean(target && ['BUTTON', 'A', 'SUMMARY'].includes(target.tagName));

      if (event.key.toLowerCase() === 'g' && !event.metaKey && !event.ctrlKey && !event.altKey && !isControl) {
        event.preventDefault();
        setViewMode((mode) => (mode === 'grid' ? 'deck' : 'grid'));
        return;
      }

      if (viewMode === 'grid') return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextCard();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevCard();
      } else if (event.key === 'Escape') {
        setIsFlipped(false);
      } else if (event.key === ' ' || event.key === 'Enter') {
        // 버튼·링크에 포커스가 있으면 그 컨트롤이 키를 가져가야 한다
        if (isControl) return;
        event.preventDefault();
        toggleFlip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextCard, prevCard, toggleFlip, viewMode]);

  if (!card) {
    return (
      <div className="text-center py-24 text-sm text-inkMuted">
        {isKo ? '카드가 없습니다.' : 'No cards available.'}
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.slug === card.categorySlug) || CATEGORIES[0];
  const tone = TONE_STYLES[category.tone];
  const photo = photoFor(category.slug, isKo);
  const palette = paletteFor(category.slug, isKo);

  const frontBackground = frontBackgroundFor(category.slug, isKo);

  // 공유 URL 은 non-www → www 308 리다이렉트를 타지 않는 주소로 만든다.
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin.replace('://lessregret.life', '://www.lessregret.life')}/${lang}/card/${card.id}`
      : `${SITE_URL}/${lang}/card/${card.id}`;

  const handleShare = async (event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    await shareLink();
  };

  /** 카카오톡 피드 카드 한 뭉치로 공유한다. SDK 가 없거나 예외가 나면 링크 공유로 넘긴다. */
  const handleKakaoShare = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (kakaoBusy) return;
    setKakaoBusy(true);

    try {
      const kakao = await ensureKakaoSdk();
      if (!kakao || !kakao.Share) {
        await shareLink();
        return;
      }
      if (!kakao.isInitialized()) kakao.init(KAKAO_JS_KEY);

      const kakaoTitle = clampText((isKo ? card.title : card.titleEn).replace(/\n/g, ' '), 60);
      const kakaoDescription = clampText(quoteOf(card, lang) || storyOf(card, lang), 80);
      const link = { mobileWebUrl: shareUrl, webUrl: shareUrl };

      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: kakaoTitle,
          description: kakaoDescription,
          // non-www → www 308 리다이렉트가 없는 정적 OG 이미지(1200×630 PNG)
          imageUrl: `${SITE_URL}/${lang}/card/${card.id}/opengraph-image/card`,
          link,
        },
        buttons: [
          {
            title: isKo ? '카드 읽기' : 'Read card',
            link,
          },
        ],
      });
    } catch {
      await shareLink();
    } finally {
      setKakaoBusy(false);
    }
  };

  /** 링크 공유 — navigator.share 가 있으면 시스템 공유시트, 없으면 클립보드 복사. */
  const shareLink = async () => {
    const shareTitle = isKo
      ? `후회가 적은 삶 · ${card.title.replace('\n', ' ')}`
      : `Less Regret · ${card.titleEn.replace('\n', ' ')}`;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        // text 를 넘기면 카톡 말풍선에 인용문이 통째로 붙는다. 제목+URL 만 넘겨
        // 수신 측이 OG 카드(제목·설명·썸네일)를 그리게 한다.
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
          return;
        }
      }
    }

    let copiedSuccess = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        copiedSuccess = true;
      } catch {
        copiedSuccess = false;
      }
    }

    if (!copiedSuccess && typeof document !== 'undefined') {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copiedSuccess = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        copiedSuccess = false;
      }
    }

    if (copiedSuccess) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const positionInCategory = currentIndex + 1;

  return (
    <div ref={deckRef} className="w-full max-w-5xl mx-auto px-4 pt-5 pb-10">
      {/* 카테고리 탭 */}
      <div className="max-w-xl mx-auto w-full">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none md:flex-wrap md:overflow-visible">
          <button
            type="button"
            onClick={() => selectCategory('all')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] transition-colors ${
              selectedCat === 'all'
                ? 'bg-ink text-paper font-medium'
                : 'bg-paperMuted text-inkMuted hover:text-ink'
            }`}
          >
            {isKo ? '전체' : 'All'}
            <span className="ml-1 text-[11px] opacity-60">{cards.length}</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => selectCategory(cat.slug)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] transition-colors ${
                selectedCat === cat.slug
                  ? 'bg-ink text-paper font-medium'
                  : 'bg-paperMuted text-inkMuted hover:text-ink'
              }`}
            >
              {isKo ? cat.ko : cat.shortEn}
              <span className="ml-1 text-[11px] opacity-60">{counts[cat.slug]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PC: 보기 전환 + 키보드 안내 */}
      <div className="hidden md:flex max-w-xl mx-auto w-full items-center justify-between gap-3 mb-4 mt-1">
        <p className="text-[10.5px] text-inkFaint">
          {viewMode === 'grid'
            ? isKo
              ? '카드를 누르면 그 카드의 이야기가 펼쳐집니다'
              : 'Click a card to open its story'
            : isKo
            ? '← → 이전·다음 · Space 뒤집기 · G 그리드'
            : '← → prev / next · Space to flip · G for grid'}
        </p>
        <div
          className="flex shrink-0 items-center gap-0.5 rounded-full bg-paperMuted p-0.5"
          role="group"
          aria-label={isKo ? '보기 방식' : 'View mode'}
        >
          <button
            type="button"
            onClick={() => setViewMode('deck')}
            aria-pressed={viewMode === 'deck'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] transition-colors ${
              viewMode === 'deck' ? 'bg-ink text-paper font-medium' : 'text-inkMuted hover:text-ink'
            }`}
          >
            <Rows3 className="w-3.5 h-3.5" />
            {isKo ? '덱 보기' : 'Deck'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] transition-colors ${
              viewMode === 'grid' ? 'bg-ink text-paper font-medium' : 'text-inkMuted hover:text-ink'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            {isKo ? '전체 펼쳐보기' : 'Grid'}
          </button>
        </div>
      </div>

      {/* ── 덱 보기 ── */}
      <div className={viewMode === 'grid' ? 'hidden' : 'block'}>
        <div className="max-w-xl mx-auto w-full">
          <div className="relative">
            {/* PC: 카드 바깥 좌우 화살표 */}
            <button
              type="button"
              onClick={prevCard}
              aria-label={isKo ? '이전 카드' : 'Previous card'}
              className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full border border-borderSoft bg-paper/90 text-inkMuted shadow-sm backdrop-blur-sm hover:text-ink hover:bg-paper hover:-translate-x-0.5 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextCard}
              aria-label={isKo ? '다음 카드' : 'Next card'}
              className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full border border-borderSoft bg-paper/90 text-inkMuted shadow-sm backdrop-blur-sm hover:text-ink hover:bg-paper hover:translate-x-0.5 transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* 2단계 카드 — 앞면은 고정 비율, 뒷면은 본문 높이만큼 자연스럽게 늘어난다.
                3D preserve-3d 레이어 안에 내부 스크롤 박스를 두면 모바일 터치 스크롤이
                먹통이 되므로 뒷면은 3D·고정높이·내부 스크롤을 모두 걷어냈다. */}
            <div className="w-full">
              <div
                className={`relative w-full ${isFlipped ? '' : 'aspect-[420/650] max-h-[660px]'}`}
              >
                {/* ── 앞면: 후킹 + 최소 출처 ── */}
                <div
                  role="button"
                  tabIndex={isFlipped ? -1 : 0}
                  aria-label={isKo ? '카드를 눌러 이야기 보기' : 'Tap to read the story'}
                  aria-hidden={isFlipped}
                  onClick={() => !isFlipped && setIsFlipped(true)}
                  onKeyDown={(event) => {
                    if (!isFlipped && (event.key === 'Enter' || event.key === ' ')) {
                      event.preventDefault();
                      event.stopPropagation();
                      setIsFlipped(true);
                    }
                  }}
                  className={`absolute inset-0 w-full h-full rounded-[22px] overflow-hidden border shadow-[0_18px_50px_-24px_rgba(26,24,22,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accentGold ${
                    isFlipped ? 'hidden' : 'block cursor-pointer'
                  }`}
                  style={{
                    background: frontBackground,
                    backgroundSize: photo ? 'cover' : 'auto',
                    backgroundPosition: photo ? CATEGORY_PHOTO_POSITION[category.slug] ?? 'center' : 'center',
                    backgroundRepeat: 'no-repeat',
                    borderColor: palette.border,
                    color: palette.text,
                  }}
                >
                  {!photo && (
                    <span
                      aria-hidden
                      className="pointer-events-none select-none absolute right-3 bottom-16 font-serif text-[132px] leading-none tracking-tight"
                      style={{ color: tone.text, opacity: 0.05 }}
                    >
                      {card.id}
                    </span>
                  )}

                  <div className="relative z-10 h-full flex flex-col p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <span
                        className="px-3 py-1 rounded-full text-[11px] tracking-wide"
                        style={{ background: palette.pill, color: palette.text }}
                      >
                        {categoryOf(card, lang)}
                      </span>
                      <span className="text-[11px] font-mono opacity-45">#{card.id}</span>
                    </div>

                    <div className="pr-2 mt-12 sm:mt-14">
                      <div
                        className="w-8 h-[2px] mb-5"
                        style={{ backgroundColor: category.accent }}
                        aria-hidden
                      />
                      <h2 className="font-serif text-[24px] sm:text-[27px] leading-[1.42] font-semibold tracking-[-0.01em] whitespace-pre-line">
                        {titleOf(card, lang)}
                      </h2>
                      <p className="mt-5 text-[12px] leading-relaxed" style={{ color: palette.muted }}>
                        {shortSource(card, lang)}
                      </p>
                    </div>

                    <div
                      className="mt-auto -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 sm:px-7 py-4 flex items-center justify-end text-[11.5px]"
                      style={{
                        borderTop: `1px solid ${palette.border}`,
                        color: palette.muted,
                        background: photo ? 'rgba(253,250,240,0.92)' : 'transparent',
                      }}
                    >
                      <span className="inline-flex items-center gap-1" style={{ color: category.accent }}>
                        {isKo ? '펼치기' : 'Open'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── 뒷면: 스토리 + 인용 + 실천
                    본문 높이만큼 늘어나고 스크롤은 브라우저 전체 화면이 맡는다(내부 스크롤 없음). ── */}
                <div
                  className={`rounded-[22px] bg-paper border border-borderSoft shadow-[0_18px_50px_-24px_rgba(26,24,22,0.45)] flex flex-col ${
                    isFlipped
                      ? 'animate-card-in relative w-full min-h-[520px] overflow-visible'
                      : 'hidden'
                  }`}
                  aria-hidden={!isFlipped}
                >
                  <div className="shrink-0 flex items-center justify-between px-6 pt-4 sm:pt-5 pb-3 border-b border-borderSoft/70">
                    <span className="text-[11px] font-mono tracking-wide text-accentGold font-semibold">
                      {isKo ? `이야기 #${card.id}` : `STORY #${card.id}`}
                    </span>
                    <span className="text-[10.5px] px-2 py-0.5 rounded bg-paperMuted text-inkMuted">
                      {regretTypeOf(card, lang)}
                    </span>
                  </div>

                  <div ref={backScrollRef} className="flex-1 px-5 sm:px-6 py-4">
                    <h3 className="font-serif text-[18px] sm:text-[19px] leading-snug font-semibold text-ink mb-3 whitespace-pre-line">
                      {titleOf(card, lang)}
                    </h3>

                    {card.artifactPhoto && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-borderSoft shadow-sm bg-[#faf8f5]">
                        <a
                          href={card.artifactPhoto}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative group overflow-hidden"
                          title={isKo ? '새 창에서 원본 크게 보기' : 'Open original image in new tab'}
                        >
                          <img
                            src={card.artifactPhoto}
                            alt={isKo ? '육필 편지 원본' : 'Original handwritten letter'}
                            className="w-full object-cover max-h-[260px] object-top group-hover:scale-[1.02] transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-3 py-1.5 rounded-full bg-black/75 text-white text-[11px] font-medium backdrop-blur-sm">
                              {isKo ? '원본 편지 크게 보기 ↗' : 'View Full Image ↗'}
                            </span>
                          </div>
                        </a>
                        <div className="px-3.5 py-2 flex items-center justify-between text-[11px] text-inkFaint bg-paperMuted/60 border-t border-borderSoft/60">
                          <span className="font-medium text-ink/75">
                            {isKo
                              ? card.artifactPhotoCaptionKo || '육필 편지 원본'
                              : card.artifactPhotoCaptionEn || 'Original letter'}
                          </span>
                          <span className="text-[10px] text-accentGold font-medium">
                            {isKo ? '터치하여 확대 ↗' : 'Tap to enlarge ↗'}
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="font-serif text-[13.5px] sm:text-[14px] leading-[1.85] text-ink/85 whitespace-pre-line">
                      {storyOf(card, lang)}
                    </p>

                    <blockquote className="mt-4 sm:mt-5 pl-3.5 border-l-2 border-accentGold/70">
                      <p className="font-serif text-[13px] sm:text-[13.5px] leading-[1.75] text-ink/80 italic">
                        {quoteOf(card, lang)}
                      </p>
                      <cite className="mt-2 block text-[11px] not-italic text-inkFaint">
                        — {quoteAttrOf(card, lang)}
                      </cite>
                    </blockquote>

                    <div className="mt-4 sm:mt-5 rounded-xl bg-paperMuted/60 border border-borderSoft px-4 py-3">
                      <p className="text-[10.5px] tracking-wide text-accentGold font-semibold mb-1">
                        {isKo ? '오늘의 실천' : 'TODAY’S PRACTICE'}
                      </p>
                      <p className="text-[12.5px] sm:text-[13px] leading-relaxed text-ink/90">
                        {practiceOf(card, lang)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3.5 pb-2">
                      {tagsOf(card, lang).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10.5px] sm:text-[11px] bg-paperMuted text-inkMuted px-2.5 py-1 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 px-4 sm:px-5 pt-2.5 pb-3 border-t border-borderSoft/70 bg-paper">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setIsFlipped(false)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11.5px] text-inkMuted hover:bg-paperMuted transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          {isKo ? '앞면' : 'Back'}
                        </button>
                        <Link
                          href={`/${lang}/card/${card.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11.5px] text-inkMuted hover:bg-paperMuted transition-colors"
                        >
                          {isKo ? '전체 보기' : 'Full page'}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-1.5">
                        <button
                          type="button"
                          onClick={handleKakaoShare}
                          disabled={kakaoBusy}
                          aria-label={isKo ? '카카오톡으로 공유' : 'Share on KakaoTalk'}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-[7px] rounded-full text-[11.5px] font-semibold bg-[#FEE500] text-[#3C1E1E] hover:bg-[#F7DC00] active:scale-95 disabled:opacity-60 transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {isKo ? '카톡 공유' : 'KakaoTalk'}
                        </button>
                        <button
                          type="button"
                          onClick={handleShare}
                          aria-label={isKo ? '링크 공유' : 'Share link'}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-[7px] rounded-full text-[11.5px] font-medium bg-ink text-paper hover:bg-ink/90 active:scale-95 transition-all"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-accentGold" />
                              {isKo ? '링크 복사됨' : 'Link copied'}
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5" />
                              {isKo ? '링크 공유' : 'Share link'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 이전 / 다음 */}
          <div className="flex items-center justify-between w-full mt-5">
            <button
              type="button"
              onClick={prevCard}
              className="flex items-center gap-1 text-[12px] text-inkMuted hover:text-ink px-2.5 py-2 rounded-lg hover:bg-paperMuted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {isKo ? '이전' : 'Prev'}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-inkMuted">
                {positionInCategory} / {filteredCards.length}
              </span>
              <span className="text-[10px] text-inkFaint">
                {selectedCat === 'all' ? (isKo ? '전체' : 'All') : isKo ? category.ko : category.en}
              </span>
            </div>

            <button
              type="button"
              onClick={nextCard}
              className="flex items-center gap-1 text-[12px] text-inkMuted hover:text-ink px-2.5 py-2 rounded-lg hover:bg-paperMuted transition-colors"
            >
              {isKo ? '다음' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="mt-3 text-center text-[10.5px] text-inkFaint md:hidden">
            {isKo
              ? '카드 앞면을 누르면 이야기가 펼쳐집니다 · 좌우 화살표로 넘길 수 있어요'
              : 'Tap the card to open the story · use the arrow keys to browse'}
          </p>
        </div>
      </div>

      {/* ── 그리드(전체 펼쳐보기) 보기 — PC ── */}
      <div className={viewMode === 'grid' ? 'block' : 'hidden'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredCards.map((item, index) => {
            const itemCategory = CATEGORIES.find((c) => c.slug === item.categorySlug) || CATEGORIES[0];
            const itemPalette = paletteFor(item.categorySlug, isKo);
            const itemPhoto = photoFor(item.categorySlug, isKo);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openInDeck(index)}
                aria-label={
                  isKo
                    ? `${item.id}번 카드 이야기 열기: ${item.title.replace('\n', ' ')}`
                    : `Open card ${item.id}: ${item.titleEn.replace('\n', ' ')}`
                }
                className="group relative text-left rounded-2xl border overflow-hidden p-5 min-h-[188px] flex flex-col shadow-[0_10px_30px_-24px_rgba(26,24,22,0.6)] hover:shadow-[0_18px_40px_-24px_rgba(26,24,22,0.55)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accentGold transition-all duration-200"
                style={{
                  background: frontBackgroundFor(item.categorySlug, isKo),
                  backgroundSize: itemPhoto ? 'cover' : 'auto',
                  backgroundPosition: itemPhoto
                    ? CATEGORY_PHOTO_POSITION[item.categorySlug] ?? 'center'
                    : 'center',
                  backgroundRepeat: 'no-repeat',
                  borderColor: itemPalette.border,
                  color: itemPalette.text,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10.5px] tracking-wide"
                    style={{ background: itemPalette.pill, color: itemPalette.text }}
                  >
                    {categoryOf(item, lang)}
                  </span>
                  <span className="text-[10.5px] font-mono opacity-45">#{item.id}</span>
                </div>

                <h3 className="mt-3.5 font-serif text-[15.5px] leading-[1.42] font-semibold tracking-[-0.01em] whitespace-pre-line line-clamp-3">
                  {titleOf(item, lang)}
                </h3>

                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(253,250,240,0.95) 25%, rgba(253,250,240,0) 100%)',
                  }}
                />
                <div className="relative mt-auto pt-4 flex items-end justify-between gap-2">
                  <span
                    className="text-[10.5px] leading-snug line-clamp-2"
                    style={{ color: itemPalette.muted }}
                  >
                    {shortSource(item, lang)}
                  </span>
                  <span className="shrink-0 inline-flex items-center gap-0.5 text-[10.5px] opacity-70 group-hover:opacity-100 transition-opacity">
                    {isKo ? '읽기' : 'Read'}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-center text-[10.5px] text-inkFaint">
          {isKo
            ? '카드를 누르면 이야기가 펼쳐집니다 · G 키로 덱 보기와 전환'
            : 'Click a card to open its story · press G to switch views'}
        </p>
      </div>
    </div>
  );
}
