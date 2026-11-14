import { ImageResponse } from 'next/og';
import { loadOgFonts } from '@/lib/og';

/** iOS 홈 화면 아이콘 — 파비콘과 같은 서체의 'L' 마크. */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function AppleIcon() {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1A1816',
          color: '#C2A382',
          fontFamily: 'Noto Serif KR',
          fontSize: 118,
          fontWeight: 600,
          paddingBottom: 12,
        }}
      >
        L
      </div>
    ),
    { ...size, fonts },
  );
}
