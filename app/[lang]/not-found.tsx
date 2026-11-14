import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] tracking-[0.2em] text-accentGold font-semibold">404</p>
      <h1 className="mt-3 font-serif text-[24px] font-semibold text-ink">카드를 찾을 수 없습니다</h1>
      <p className="mt-2 text-[12.5px] text-inkMuted">
        This page does not exist. The deck has 67 cards, numbered 01–67.
      </p>
      <div className="mt-6 flex items-center gap-2.5 text-[12px]">
        <Link href="/ko" className="px-3.5 py-2 rounded-full bg-ink text-paper">
          한국어 카드 덱
        </Link>
        <Link href="/en" className="px-3.5 py-2 rounded-full bg-paperMuted text-ink">
          English deck
        </Link>
      </div>
    </main>
  );
}
