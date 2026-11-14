import { ImageResponse } from 'next/og';
import { CARD_COUNT, cards, getCard, titleOf } from '@/lib/cards';
import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  categoryLabelAndAccent,
  imageDataUri,
  loadOgFonts,
  titleLines,
} from '@/lib/og';

/**
 * 개별 카드 공유 미리보기 이미지.
 * 육필 편지 같은 artifactPhoto 가 있으면 그 사진을, 없으면 카드 번호 패널을 쓴다.
 */
export const runtime = 'nodejs';

export function generateStaticParams() {
  const params: { lang: string; id: string }[] = [];
  for (const lang of ['ko', 'en']) {
    for (const card of cards) params.push({ lang, id: card.id });
  }
  return params;
}

export function generateImageMetadata({ params }: { params: { id: string } }) {
  const card = getCard(params.id);
  return [
    {
      id: 'card',
      size: OG_SIZE,
      contentType: OG_CONTENT_TYPE,
      alt: card ? `Less Regret — ${card.title.replace('\n', ' ')}` : 'Less Regret',
    },
  ];
}

export default async function Image({ params }: { params: { lang: string; id: string } }) {
  const lang: 'ko' | 'en' = params.lang === 'en' ? 'en' : 'ko';
  const isKo = lang === 'ko';
  const card = getCard(params.id);
  const fonts = await loadOgFonts();

  if (!card) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: OG_COLORS.PAPER,
            color: OG_COLORS.INK,
            fontFamily: 'Noto Serif KR',
            fontSize: 44,
          }}
        >
          {isKo ? '후회가 적은 삶 · Less Regret' : 'Less Regret'}
        </div>
      ),
      { ...OG_SIZE, fonts },
    );
  }

  const { label, accent } = categoryLabelAndAccent(card, lang);
  const lines = titleLines(titleOf(card, lang), 3);
  const source = isKo ? card.sourceShortKo : card.sourceShortEn;
  const regretType = isKo ? card.regretTypeKo : card.regretTypeEn;
  const photo = card.artifactPhoto ? await imageDataUri(card.artifactPhoto) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '52px 66px 42px',
          background: 'linear-gradient(160deg, #FDFBF7 0%, #FBF7EE 60%, #F5EEE2 100%)',
          color: OG_COLORS.INK,
          fontFamily: 'Noto Serif KR',
        }}
      >
        {/* 상단 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 99,
                background: OG_COLORS.GOLD,
                marginRight: 13,
              }}
            />
            <div style={{ fontSize: 23, fontWeight: 600, letterSpacing: '0.06em' }}>Less Regret</div>
          </div>
          <div style={{ fontSize: 16, color: OG_COLORS.INK_FAINT, letterSpacing: '0.08em' }}>
            {`#${card.id} / ${CARD_COUNT}`}
          </div>
        </div>

        {/* 본문 */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'stretch', marginTop: 22 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              paddingRight: 46,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 3, height: 20, background: accent, marginRight: 11 }} />
              <div style={{ fontSize: 18, color: OG_COLORS.INK_MUTED, letterSpacing: '0.12em' }}>
                {label}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
              {lines.map((line) => (
                <div
                  key={line}
                  style={{
                    fontSize: isKo ? 41 : 38,
                    fontWeight: 600,
                    lineHeight: 1.36,
                    letterSpacing: '-0.008em',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            <div style={{ width: 54, height: 2, background: OG_COLORS.GOLD, marginTop: 24 }} />
            <div style={{ fontSize: 18, color: OG_COLORS.INK_FAINT, marginTop: 13, lineHeight: 1.45 }}>
              {source}
            </div>
          </div>

          {/* 오른쪽 비주얼 */}
          <div
            style={{
              width: 340,
              display: 'flex',
              borderRadius: 16,
              overflow: 'hidden',
              border: `1px solid ${OG_COLORS.BORDER}`,
              background: '#FBF7EF',
              boxShadow: '0 18px 44px -26px rgba(26,24,22,0.55)',
            }}
          >
            {photo ? (
              <img
                src={photo}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '24px 22px 22px',
                  background: 'linear-gradient(165deg, #F7F1E4 0%, #FCF9F2 55%, #F2E9D8 100%)',
                }}
              >
                <div style={{ width: 34, height: 2, background: accent }} />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 186,
                    fontWeight: 600,
                    lineHeight: 1,
                    color: OG_COLORS.INK,
                    opacity: 0.13,
                  }}
                >
                  {card.id}
                </div>
                <div style={{ fontSize: 15, color: OG_COLORS.INK_FAINT, letterSpacing: '0.1em' }}>
                  {regretType}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${OG_COLORS.BORDER}`,
            paddingTop: 16,
            marginTop: 18,
          }}
        >
          <div style={{ fontSize: 16, color: OG_COLORS.INK_FAINT, letterSpacing: '0.04em' }}>
            {`lessregret.life/${lang}/card/${card.id}`}
          </div>
          <div style={{ fontSize: 16, color: OG_COLORS.GOLD, letterSpacing: '0.14em', fontWeight: 600 }}>
            {isKo ? '후회가 적은 삶' : 'LESS REGRET LIFE'}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
