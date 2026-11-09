import Link from "next/link";
import type { Lang, Tone } from "@/lib/types";

type SiteHeaderProps = {
  lang: Lang;
  switchHref: string;
  tone: Tone;
};

export function SiteHeader({ lang, switchHref, tone }: SiteHeaderProps) {
  const dark = tone === "dusk";

  return (
    <header className="flex items-start justify-between gap-4">
      <Link href={`/${lang}`} className="group block min-w-0">
        <span
          className={`block font-serif text-[1.7rem] leading-none tracking-tight ${
            dark ? "text-[#F6F1E8]" : "text-ink"
          }`}
        >
          Less
          <span className={dark ? "text-sand" : "text-clay"}>Regret</span>
        </span>
        <span
          className={`mt-1 block text-[10px] uppercase tracking-[0.22em] ${
            dark ? "text-[#D9D0C4]" : "text-mute"
          }`}
        >
          lessregret.life
        </span>
      </Link>
      <Link
        href={switchHref}
        hrefLang={lang === "ko" ? "en" : "ko"}
        className={`rounded-full border px-3 py-1 text-[11px] tracking-[0.16em] ${
          dark
            ? "border-white/25 text-[#F6F1E8] hover:bg-white/10"
            : "border-ink/15 text-ink hover:bg-white/50"
        }`}
      >
        {lang === "ko" ? "EN" : "KO"}
      </Link>
    </header>
  );
}
