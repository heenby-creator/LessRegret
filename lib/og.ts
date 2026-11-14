import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CATEGORY_BY_SLUG, SITE_URL } from './categories';
import type { Card } from './cards';

/**
 * OG 이미지(ImageResponse/satori) 렌더링에 쓰는 공용 자원.
 * 서버 런타임에서만 import 한다 (node:fs 사용).
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const PAPER = '#FDFBF7';
const INK = '#1A1816';
const INK_MUTED = '#6E665C';
const INK_FAINT = '#A3998D';
const GOLD = '#C2A382';
const BORDER = '#E8E2D8';

export const OG_COLORS = { PAPER, INK, INK_MUTED, INK_FAINT, GOLD, BORDER };

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600;
  style: 'normal';
};

/** 폰트는 저장소에 넣어 둔 한글 서브셋(KS X 1001)을 우선 쓰고, 없으면 원본을 받아 온다. */
const FONT_FALLBACK: Record<400 | 600, string> = {
  400: 'https://fonts.gstatic.com/s/notoserifkr/v32/3JnoSDn90Gmq2mr3blnHaTZXbOtLJDvui3JOncjmeM52.ttf',
  600: 'https://fonts.gstatic.com/s/notoserifkr/v32/3JnoSDn90Gmq2mr3blnHaTZXbOtLJDvui3JOncg4f852.ttf',
};

let fontCache: Promise<OgFont[]> | null = null;

async function loadWeight(weight: 400 | 600): Promise<ArrayBuffer> {
  try {
    const buffer = await readFile(join(process.cwd(), 'assets', 'og-fonts', `noto-serif-kr-${weight}.ttf`));
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
  } catch {
    const response = await fetch(FONT_FALLBACK[weight]);
    if (!response.ok) throw new Error(`OG font fetch failed: ${response.status}`);
    return response.arrayBuffer();
  }
}

export function loadOgFonts(): Promise<OgFont[]> {
  if (!fontCache) {
    fontCache = (async () => {
      const [regular, semibold] = await Promise.all([loadWeight(400), loadWeight(600)]);
      return [
        { name: 'Noto Serif KR', data: regular, weight: 400, style: 'normal' as const },
        { name: 'Noto Serif KR', data: semibold, weight: 600, style: 'normal' as const },
      ];
    })();
  }
  return fontCache;
}

/**
 * 공개 이미지 파일을 data URI 로 읽는다.
 * 서버 번들에 파일이 함께 실려 있으면 디스크에서, 아니면(배포 환경) 사이트 URL 로 받아 온다.
 */
export async function imageDataUri(publicPath: string): Promise<string | null> {
  const clean = publicPath.replace(/^\//, '');
  const ext = clean.split('.').pop()?.toLowerCase() ?? 'jpg';
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

  try {
    const buffer = await readFile(join(process.cwd(), 'public', clean));
    return `data:${mime};base64,${buffer.toString('base64')}`;
  } catch {
    // 번들에 없는 배포 환경 — 같은 사이트의 공개 URL 에서 읽는다.
  }

  try {
    const response = await fetch(absoluteUrl(publicPath));
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${mime};base64,${buffer.toString('base64')}`;
  } catch {
    return null;
  }
}

/** 카드 제목을 OG 용 줄 단위로 나눈다 (데이터의 줄바꿈 유지). */
export function titleLines(title: string, maxLines = 3): string[] {
  return title
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, maxLines);
}

export function categoryLabelAndAccent(card: Card, lang: string) {
  const category = CATEGORY_BY_SLUG[card.categorySlug];
  return {
    label: category ? (lang === 'ko' ? category.ko : category.en) : card.category,
    accent: category?.accent ?? GOLD,
  };
}

export function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`;
}
