"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { categoryMeta, copy, regretMeta } from "@/lib/i18n";
import type { Card, Category, Lang } from "@/lib/types";

const SWIPE_THRESHOLD = 72;

export function Deck({ lang, cards }: { lang: Lang; cards: Card[] }) {
  const text = copy[lang];
  const [category, setCategory] = useState<Category | "all">("all");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);

  const filtered = useMemo(
    () => (category === "all" ? cards : cards.filter((card) => card.category === category)),
    [cards, category],
  );
  const safeIndex = Math.min(index, Math.max(filtered.length - 1, 0));
  const card = filtered[safeIndex];
  const tone = card ? categoryMeta[card.category].tone : "cream";
  const dark = tone === "dusk";

  const go = useCallback((step: number) => {
    setIndex((current) => {
      const next = Math.min(Math.max(current + step, 0), filtered.length - 1);
      return next;
    });
    setFlipped(false);
    setDragX(0);
  }, [filtered.length]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT", "A", "BUTTON"].includes(target.tagName)) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setFlipped((value) => !value);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a,button")) return;
    start.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    if (Math.abs(dx) > Math.abs(dy)) setDragX(dx);
  }

  function finishPointer(event: React.PointerEvent<HTMLDivElement>) {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    const distance = Math.hypot(dx, dy);
    start.current = null;
    setDragging(false);

    if ((event.target as HTMLElement).closest("a,button")) {
      setDragX(0);
      return;
    }
    if (distance < 12) {
      setFlipped((value) => !value);
      setDragX(0);
      return;
    }
    if (Math.abs(dx) > Math.abs(dy) && dx <= -SWIPE_THRESHOLD) go(1);
    else if (Math.abs(dx) > Math.abs(dy) && dx >= SWIPE_THRESHOLD) go(-1);
    else setDragX(0);
  }

  if (!card) return null;

  const categories: Array<Category | "all"> = ["all", "marriage", "career", "family", "life"];
  const showBack = flipped;

  const front = (
    <CardSide>
      <div className="flex items-start justify-between gap-3 text-[12px] text-mute">
        <p>{categoryMeta[card.category].label[lang]}</p>
        <p>{text.age(card.age)}</p>
      </div>
      <p className="mt-3 text-[11px] tracking-[0.14em] text-clay">{regretMeta[card.regretType][lang]}</p>
      <h2 className="mt-6 font-serif text-[1.85rem] leading-[1.28] tracking-tight text-ink">{card.hook[lang]}</h2>
      <div className="mt-auto pt-8">
        <p className="text-[10px] uppercase tracking-[0.18em] text-mute">{text.antiLabel}</p>
        <p className="mt-2 text-sm text-ink">{card.antiBifl.map((item) => item[lang]).join(" · ")}</p>
        <p className="mt-5 text-[13px] text-mute">{text.tapHint}</p>
      </div>
    </CardSide>
  );

  const back = (
    <CardSide>
      <p className="text-[11px] uppercase tracking-[0.18em] text-clay">{text.sourceLabel}</p>
      <blockquote className="mt-5 font-serif text-[1.45rem] leading-snug text-ink">{card.quote[lang]}</blockquote>
      <p className="mt-5 text-[13px] leading-relaxed text-mute">{card.source[lang]}</p>
      <div className="mt-auto flex items-end justify-between gap-3 pt-8">
        <div>
          <Link
            href={`/${lang}/card/${card.id}`}
            className="text-sm text-clay underline decoration-clay/40 underline-offset-4"
          >
            {text.read}
          </Link>
          <p className="mt-2 text-[13px] text-mute">{text.backHint}</p>
        </div>
        <span className="text-[12px] text-mute">{text.position(safeIndex + 1, filtered.length)}</span>
      </div>
    </CardSide>
  );

  return (
    <main className={`stage tone-${tone}`}>
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
        <SiteHeader lang={lang} switchHref={lang === "ko" ? "/en" : "/ko"} tone={tone} />
        <p className={`mt-4 max-w-[34rem] text-[13.5px] leading-relaxed ${dark ? "text-[#E7E1D8]" : "text-mute"}`}>
          {text.subtitle}
        </p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((item) => {
            const active = item === category;
            const label = item === "all" ? text.all : categoryMeta[item].label[lang];
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setCategory(item);
                  setIndex(0);
                  setFlipped(false);
                  setDragX(0);
                }}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[13px] ${
                  active
                    ? dark
                      ? "border-transparent bg-[#F6F1E8] text-ink"
                      : "border-transparent bg-ink text-paper"
                    : dark
                      ? "border-white/25 text-[#F6F1E8]"
                      : "border-ink/15 bg-white/45 text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-1 items-center py-4">
          <div
            className="deck-scene relative w-full"
            style={{
              transform: `translate3d(${dragX}px, 0, 0) rotate(${dragX / 30}deg)`,
              transition: dragging ? "none" : "transform 280ms ease",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={finishPointer}
            onPointerCancel={finishPointer}
          >
            <p className="sr-only" aria-live="polite">
              {showBack ? `${card.quote[lang]} ${card.source[lang]}` : card.hook[lang]}
            </p>
            <div className="aspect-[3/4.15] w-full">
              {reduceMotion ? (
                <div className="deck-face relative h-full">{showBack ? back : front}</div>
              ) : (
                <div className={`deck-inner ${showBack ? "is-flipped" : ""}`}>
                  <div className="deck-face">{front}</div>
                  <div className="deck-face deck-back">{back}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className={`mb-3 text-center text-[12px] tracking-[0.16em] ${dark ? "text-[#E7E1D8]" : "text-mute"}`}>
          {text.position(safeIndex + 1, filtered.length)}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <DeckButton dark={dark} disabled={safeIndex === 0} onClick={() => go(-1)}>
            {text.prev}
          </DeckButton>
          <DeckButton dark={dark} onClick={() => setFlipped((value) => !value)}>
            {text.flip}
          </DeckButton>
          <DeckButton dark={dark} disabled={safeIndex === filtered.length - 1} onClick={() => go(1)}>
            {text.next}
          </DeckButton>
        </div>
        {dark ? <p className="mt-3 text-center text-[11px] text-[#D9D0C4]">{text.photoCredit}</p> : null}
      </div>
    </main>
  );
}

function CardSide({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full flex-col px-6 py-7">{children}</div>;
}

function DeckButton({
  children,
  onClick,
  disabled,
  dark,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  dark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-3 py-2 text-sm disabled:opacity-35 ${
        dark ? "border-white/25 text-[#F6F1E8]" : "border-ink/15 bg-white/55 text-ink"
      }`}
    >
      {children}
    </button>
  );
}
