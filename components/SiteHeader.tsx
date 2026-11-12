import Link from 'next/link';

interface SiteHeaderProps {
  lang: string;
}

export default function SiteHeader({ lang }: SiteHeaderProps) {
  const isKo = lang === 'ko';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-borderSoft bg-paper/85 backdrop-blur-sm">
      <div className="max-w-xl mx-auto w-full px-4 py-3 flex items-center justify-between">
        <Link href={`/${lang}`} className="group flex items-center gap-2.5" aria-label="Less Regret">
          <span className="w-2 h-2 rounded-full bg-accentGold transition-transform group-hover:scale-125" />
          <span className="flex flex-col leading-none">
            <span className="font-sans text-[19px] font-semibold text-ink">
              <span>Less</span>
              <span className="ml-[0.18em]">Regret</span>
            </span>
            <span className="mt-1 text-[9.5px] tracking-[0.14em] text-inkFaint uppercase">
              {isKo ? '후회가 적은 삶' : 'Less Regret Life'}
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 text-[11.5px] font-medium" aria-label="Language">
          <Link
            href="/ko"
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
            className={`px-2.5 py-1 rounded transition-colors ${
              !isKo ? 'bg-ink text-paper' : 'text-inkMuted hover:text-ink'
            }`}
            aria-current={!isKo ? 'page' : undefined}
          >
            EN
          </Link>
        </nav>
      </div>
    </header>
  );
}
