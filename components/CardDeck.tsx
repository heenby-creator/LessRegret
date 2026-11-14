'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, RotateCcw, Share2 } from 'lucide-react';
import { CATEGORIES, type Category } from '@/lib/categories';
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

interface CardDeckProps {
  cards: CardText[];
  lang: string;
}

export default function CardDeck({ cards, lang }: CardDeckProps) {
  const isKo = lang === 'ko';
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);
  const backScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (backScrollRef.current) {
      backScrollRef.current.scrollTop = 0;
    }
  }, [currentIndex, isFlipped]);

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

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
      if (event.key === 'ArrowRight') nextCard();
      if (event.key === 'ArrowLeft') prevCard();
      if (event.key === 'Escape') setIsFlipped(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nextCard, prevCard]);

  if (!card) {
    return (
      <div className="text-center py-24 text-sm text-inkMuted">
        {isKo ? '카드가 없습니다.' : 'No cards available.'}
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.slug === card.categorySlug) || CATEGORIES[0];
  const tone = TONE_STYLES[category.tone];
  const isCouple = category.slug === 'love';
  const isCareer = category.slug === 'work';

  const frontBackground = isCareer
    ? `linear-gradient(180deg, rgba(18,16,14,0.78) 0%, rgba(18,16,14,0.45) 42%, rgba(18,16,14,0.92) 100%), url(/images/photo-career.jpg)`
    : isCouple
    ? `linear-gradient(175deg, rgba(253,250,240,0.97) 0%, rgba(253,250,240,0.87) 44%, rgba(250,241,217,0.42) 100%), url(/images/pointillism-couple-${isKo ? 'ko' : 'en'}.jpg)`
    : tone.background;

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${lang}/card/${card.id}`
      : `https://lessregret.life/${lang}/card/${card.id}`;

  const handleShare = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const shareTitle = isKo
      ? `후회가 적은 삶 · ${card.title.replace('\n', ' ')}`
      : `Less Regret · ${card.titleEn.replace('\n', ' ')}`;
    const shareText = isKo ? quoteOf(card, lang) : quoteOf(card, lang);

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
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
    <div ref={deckRef} className="w-full max-w-xl mx-auto px-4 pt-5 pb-10">
      {/* 카테고리 탭 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
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

      {/* 2단계 플립 카드 */}
      <div className="perspective-1000 w-full">
        <div
          className={`relative w-full aspect-[420/650] max-h-[660px] transform-style-3d transition-transform duration-500 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
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
                setIsFlipped(true);
              }
            }}
            className={`absolute inset-0 w-full h-full rounded-[22px] backface-hidden overflow-hidden border shadow-[0_18px_50px_-24px_rgba(26,24,22,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accentGold transition-all duration-300 ${
              isFlipped
                ? 'pointer-events-none select-none invisible opacity-0 z-0'
                : 'pointer-events-auto visible opacity-100 z-10 cursor-pointer'
            }`}
            style={{
              background: frontBackground,
              backgroundSize: isCareer || isCouple ? 'cover' : 'auto',
              backgroundPosition: isCouple ? '72% 88%' : 'center',
              backgroundRepeat: 'no-repeat',
              borderColor: tone.border,
              color: tone.text,
            }}
          >
            {isCareer && <div className="absolute inset-0 bg-black/10" aria-hidden />}

            {!isCouple && !isCareer && (
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
                  style={{ background: tone.pill, color: tone.text }}
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
                <p className="mt-5 text-[12px] leading-relaxed" style={{ color: tone.muted }}>
                  {shortSource(card, lang)}
                </p>
              </div>

              <div
                className="mt-auto -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 px-6 sm:px-7 py-4 flex items-center justify-between text-[11.5px]"
                style={{
                  borderTop: `1px solid ${tone.border}`,
                  color: tone.muted,
                  background: isCouple ? 'rgba(253,250,240,0.9)' : 'transparent',
                }}
              >
                <span>{isKo ? '눌러서 이야기 읽기' : 'Tap to read the story'}</span>
                <span className="inline-flex items-center gap-1" style={{ color: category.accent }}>
                  {isKo ? '펼치기' : 'Open'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* ── 뒷면: 스토리 + 인용 + 실천 ── */}
          <div
            className={`absolute inset-0 w-full h-full rounded-[22px] backface-hidden rotate-y-180 bg-paper border border-borderSoft shadow-[0_18px_50px_-24px_rgba(26,24,22,0.45)] overflow-hidden flex flex-col transition-all duration-300 ${
              isFlipped
                ? 'pointer-events-auto visible opacity-100 z-10'
                : 'pointer-events-none select-none invisible opacity-0 z-0'
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

            <div
              ref={backScrollRef}
              className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-4 touch-pan-y"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
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
                      {isKo ? (card.artifactPhotoCaptionKo || '육필 편지 원본') : (card.artifactPhotoCaptionEn || 'Original letter')}
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
                <p className="text-[12.5px] sm:text-[13px] leading-relaxed text-ink/90">{practiceOf(card, lang)}</p>
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

            <div className="shrink-0 px-5 py-3 border-t border-borderSoft/70 flex items-center justify-between gap-2 bg-paper">
              <div className="flex items-center gap-1.5">
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

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11.5px] font-medium bg-ink text-paper hover:bg-ink/90 active:scale-95 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-accentGold" />
                    {isKo ? '링크 복사됨' : 'Link copied'}
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    {isKo ? '공유하기' : 'Share'}
                  </>
                )}
              </button>
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

      <p className="mt-3 text-center text-[10.5px] text-inkFaint">
        {isKo
          ? '카드 앞면을 누르면 이야기가 펼쳐집니다 · 좌우 화살표로 넘길 수 있어요'
          : 'Tap the card to open the story · use the arrow keys to browse'}
      </p>
    </div>
  );
}
