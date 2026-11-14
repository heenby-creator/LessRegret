import { ImageResponse } from 'next/og';
import { CARD_COUNT } from '@/lib/cards';
import { OG_COLORS, OG_CONTENT_TYPE, OG_SIZE, loadOgFonts } from '@/lib/og';

/** 홈(언어별) 공유 미리보기 이미지 — 카톡·X·페이스북. */
export const runtime = 'nodejs';
export const alt = 'Less Regret — 후회가 적은 삶';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return [{ lang: 'ko' }, { lang: 'en' }];
}

const COPY = {
  ko: {
    brand: 'Less Regret',
    sub: '후회가 적은 삶',
    title: ['후회는 미리 보면', '조금 작아진다'],
    body: '살아본 사람들이 먼저 후회한 것들. 카드 한 장에 이야기 하나, 오늘 해볼 실천 하나.',
    meta: `${CARD_COUNT}장의 카드 · 6개의 챕터`,
    chapters: 'CARDS · CHAPTERS',
  },
  en: {
    brand: 'Less Regret',
    sub: 'Less Regret Life',
    title: ['Regret gets smaller', 'when you see it coming'],
    body: 'What people regretted first, so you don’t have to. One story and one small practice per card.',
    meta: `${CARD_COUNT} cards · 6 chapters`,
    chapters: 'CARDS · CHAPTERS',
  },
} as const;

export default async function Image({ params }: { params: { lang: string } }) {
  const lang: 'ko' | 'en' = params.lang === 'en' ? 'en' : 'ko';
  const copy = COPY[lang];
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '66px 76px 58px',
          background: `linear-gradient(158deg, #FDFBF7 0%, #FBF6EC 55%, #F4ECDD 100%)`,
          color: OG_COLORS.INK,
          fontFamily: 'Noto Serif KR',
        }}
      >
        {/* 브랜드 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 99,
              background: OG_COLORS.GOLD,
              marginRight: 16,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 27, fontWeight: 600, letterSpacing: '0.06em' }}>{copy.brand}</div>
            <div
              style={{
                fontSize: 13,
                color: OG_COLORS.INK_FAINT,
                letterSpacing: lang === 'ko' ? '0.26em' : '0.2em',
                marginTop: 4,
              }}
            >
              {copy.sub}
            </div>
          </div>
        </div>

        {/* 헤드라인 */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          <div style={{ width: 76, height: 3, background: OG_COLORS.GOLD, marginBottom: 30 }} />
          {copy.title.map((line) => (
            <div
              key={line}
              style={{
                fontSize: lang === 'ko' ? 68 : 62,
                fontWeight: 600,
                lineHeight: 1.34,
                letterSpacing: '-0.01em',
              }}
            >
              {line}
            </div>
          ))}
          <div
            style={{
              marginTop: 26,
              fontSize: lang === 'ko' ? 24 : 23,
              fontWeight: 400,
              color: OG_COLORS.INK_MUTED,
              lineHeight: 1.5,
              maxWidth: 900,
            }}
          >
            {copy.body}
          </div>
        </div>

        {/* 하단 정보 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${OG_COLORS.BORDER}`,
            paddingTop: 22,
          }}
        >
          <div style={{ fontSize: 17, color: OG_COLORS.GOLD, letterSpacing: '0.16em', fontWeight: 600 }}>
            {copy.meta}
          </div>
          <div style={{ fontSize: 17, color: OG_COLORS.INK_FAINT, letterSpacing: '0.06em' }}>
            lessregret.life
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
