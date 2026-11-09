"use client";

import { useEffect, useState } from "react";
import { copy } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

type KakaoShare = {
  isInitialized: () => boolean;
  init: (key: string) => void;
  Share: {
    sendDefault: (options: {
      objectType: "feed";
      content: {
        title: string;
        description: string;
        imageUrl: string;
        link: { mobileWebUrl: string; webUrl: string };
      };
    }) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoShare;
  }
}

type ShareBarProps = {
  lang: Lang;
  title: string;
  text: string;
  url: string;
  imageUrl: string;
};

function loadKakao() {
  if (window.Kakao) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Kakao SDK failed"));
    document.head.appendChild(script);
  });
}

export function ShareBar({ lang, title, text, url, imageUrl }: ShareBarProps) {
  const ui = copy[lang];
  const [notice, setNotice] = useState("");
  const [canNative, setCanNative] = useState(false);
  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  useEffect(() => {
    setCanNative(typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setNotice(ui.copied);
    } catch {
      setNotice(ui.shareFail);
    }
  }

  async function shareKakao() {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    try {
      if (key) {
        await loadKakao();
        if (window.Kakao && !window.Kakao.isInitialized()) window.Kakao.init(key);
        window.Kakao?.Share.sendDefault({
          objectType: "feed",
          content: {
            title,
            description: text,
            imageUrl,
            link: { mobileWebUrl: url, webUrl: url },
          },
        });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await copyLink();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice(ui.shareFail);
    }
  }

  async function shareNative() {
    try {
      await navigator.share({ title, text, url });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice(ui.shareFail);
    }
  }

  const buttonClass =
    "rounded-full border border-ink/15 bg-white/70 px-3 py-2 text-[13px] text-ink transition hover:bg-white";

  return (
    <section className="mt-10 border-t border-line pt-6">
      <h2 className="font-serif text-2xl text-ink">{ui.shareHeading}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className={`${buttonClass} bg-[#FEE500] hover:bg-[#FFE566]`} onClick={shareKakao}>
          {ui.kakao}
        </button>
        <a className={buttonClass} href={tweet} target="_blank" rel="noopener noreferrer">
          {ui.x}
        </a>
        <a className={buttonClass} href={facebook} target="_blank" rel="noopener noreferrer">
          {ui.facebook}
        </a>
        <button type="button" className={buttonClass} onClick={copyLink}>
          {ui.copyLink}
        </button>
        {canNative ? (
          <button type="button" className={buttonClass} onClick={shareNative}>
            {ui.shareNative}
          </button>
        ) : null}
      </div>
      <p className="mt-3 min-h-5 text-sm text-mute" role="status">
        {notice}
      </p>
    </section>
  );
}
