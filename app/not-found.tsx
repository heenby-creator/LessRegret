import Link from "next/link";

export default function NotFound() {
  return (
    <main className="stage tone-cream">
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
        <p className="font-serif text-4xl text-ink">LessRegret</p>
        <h1 className="mt-6 font-serif text-2xl text-ink">이 페이지는 덱에 없습니다.</h1>
        <p className="mt-2 text-mute">This page is not in the deck.</p>
        <Link href="/ko" className="mt-8 text-sm text-clay underline underline-offset-4">
          카드로 돌아가기
        </Link>
      </div>
    </main>
  );
}
