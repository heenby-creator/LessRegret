import CardDeck from '@/components/CardDeck';
import { cards, toDeckCards } from '@/lib/cards';

export default function HomePage({ params }: { params: { lang: string } }) {
  const isKo = params.lang === 'ko';

  return (
    <div className="flex-1 flex flex-col">
      <section className="max-w-xl mx-auto w-full px-6 pt-7 pb-1">
        <h1 className="mt-2.5 font-serif text-[18px] sm:text-[26px] font-semibold leading-[1.45] text-ink">
          {isKo ? (
            '후회는 미리 보면 조금 작아진다'
          ) : (
            <>
              Regret gets smaller
              <br />
              when you see it coming
            </>
          )}
        </h1>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-inkMuted">
          {isKo
            ? '살아본 사람들이 먼저 후회한 것들. 카드 한 장에 이야기 하나, 오늘 해볼 실천 하나.'
            : 'What people regretted first, so you don’t have to. One story and one small practice per card.'}
        </p>
      </section>

      <CardDeck cards={toDeckCards(cards)} lang={params.lang} />
    </div>
  );
}
