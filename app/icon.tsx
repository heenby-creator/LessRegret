import { ImageResponse } from 'next/og';
import { loadOgFonts } from '@/lib/og';

/** 브라우저 탭·북마크 파비콘. */
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default async function Icon() {
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
          borderRadius: 14,
          color: '#C2A382',
          fontFamily: 'Noto Serif KR',
          fontSize: 44,
          fontWeight: 600,
          paddingBottom: 4,
        }}
      >
        L
      </div>
    ),
    { ...size, fonts },
  );
}
