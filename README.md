# Less Regret — 후회가 적은 삶

67장의 카드로 만나는 인생 후회 데이터. 카드 앞면은 후킹, 뒷면은 스토리·인용·오늘의 실천.
한국어(`/ko`)와 영어(`/en`)를 완전히 분리해 렌더링한다.

## 스택

- Next.js 14 (App Router) · TypeScript · Tailwind CSS
- 정적 생성(SSG): 카드 67장 × 2개 언어 = 134개 카드 페이지

## 시작하기

```bash
npm install
npm run dev      # http://localhost:3000 → /ko 또는 /en 으로 이동
npm run build    # 카드 데이터 검증(prebuild) + 정적 페이지 생성
npm start
```

## 구조

```
app/
  [lang]/layout.tsx          루트 레이아웃 — <html lang> 서버 렌더링 · 헤더·푸터·메타데이터
  [lang]/page.tsx            카드 덱 (히어로 + CardDeck)
  [lang]/card/[id]/page.tsx  카드 상세 (스토리·인용·출처·이전/다음)
  [lang]/opengraph-image.tsx          홈 공유 이미지 (1200×630)
  [lang]/card/[id]/opengraph-image.tsx 카드 공유 이미지 (사진이 있는 카드는 사진 포함)
  [lang]/not-found.tsx       404
  icon.tsx · apple-icon.tsx · favicon.ico   파비콘
  sitemap.ts                 ko/en + 카드 134개 = 136 URL
  robots.ts
components/
  CardDeck.tsx               6대 카테고리 탭 · 2단계 플립 · 공유 버튼 · PC 덱/그리드 보기
  SiteHeader.tsx             Less Regret 로고(0.18em 간격) + 언어 전환
lib/
  categories.ts              6대 카테고리 정의 (slug·한/영·톤)
  cards.ts                   카드 타입·조회 헬퍼·데이터 검증
  og.ts                      OG 이미지용 폰트 로더·색·헬퍼
assets/og-fonts/             OG 이미지용 Noto Serif KR 서브셋 (400·600)
data/
  cards.json                 67장 카드 원본 (id "01"~"67")
scripts/
  check-cards.mjs            빌드 전 데이터 검증 (npm run check:cards)
public/images/               챕터별 점묘 배경(bg-career·family·health·self, 부부) + 육필 편지 원본
```

## OG 이미지 · 파비콘

- `ImageResponse`(next/og, nodejs 런타임)로 1200×630 PNG를 만든다. 카드 이미지는 `generateImageMetadata` 로 카드별 alt 를 붙인다.
- 한글이 깨지지 않도록 `assets/og-fonts/` 의 서브셋 폰트(KS X 1001 2,350자 + 라틴)를 쓴다. 폰트가 번들에 없으면 Google Fonts 원본을 받아 오고, 카드 사진이 번들에 없으면 공개 URL 에서 읽는다.
- 새 카드를 추가해도 폰트 서브셋 범위(일상 한글) 안이면 그대로 렌더된다. 아주 드문 글자가 필요하면 `pyftsubset` 으로 서브셋을 다시 만들 것.
- OG 이미지는 `/[lang]/opengraph-image`, `/[lang]/card/[id]/opengraph-image` 로 서비스되고, 카톡·X·페이스북 미리보기는 이 URL 의 `og:image` 를 쓴다.

## 카드 데이터 규칙

- `id`: 두 자리 숫자 `"01"`~`"67"` (`^\d{2}$`)
- `categorySlug`: `love` · `work` · `money` · `family` · `body` · `self`
- `title` / `titleEn`: 두 줄 후킹 (`\n` 한 번). 교훈조 금지, 결핍·불안·갈등을 건드리는 문장
- `storyKo` / `storyEn`: 나이·상황·대화·후회의 디테일이 있는 미니 서사
- `quoteKo` / `quoteEn`: 67장 전부 채움 (빈 인용 없음)
- `oneLiner` / `oneLinerEn`: 오늘 바로 하는 실천 한 문장
- `actionTagsKo` / `actionTagsEn`: 3개씩, 영문판은 100% 영어
- `sourceShortKo` / `sourceShortEn`: 카드 앞면에 보이는 짧은 출처 (URL 노출 없음)
- `source` / `sourceEn` · `sourceUrl`: 뒷면·상세 페이지의 전체 출처와 원문 링크

`npm run check:cards` 가 위 규칙을 검사하며, `npm run build` 전에 자동 실행된다.

## 6대 카테고리

| slug | 한국어 | English | 장수 |
|---|---|---|---|
| love | 사랑·결혼 | Marriage & Love | 16 |
| work | 일·커리어 | Work & Career | 8 |
| money | 돈·자산 | Money & Wealth | 8 |
| family | 가족·친구 | Family & Friends | 15 |
| body | 몸·마음 | Body & Mind | 8 |
| self | 나·시간 | Self & Time | 12 |

58번 이후 카드는 공공누리(KOGL) 제1유형 전국 성인문해교육 시화전 수상작을 국가문해교육센터 출처 표기와 함께 수록한 것이다(59~67번 9장은 2026-11 추가).

## 배포 시 주의 (기존 저장소에서 올릴 때)

이전 버전의 아래 파일이 남아 있으면 빌드가 실패한다. **업로드 전에 삭제**한다.

- `lib/cards.ts`, `lib/i18n.ts`, `lib/site.ts`, `lib/types.ts` (옛 카드 검증 코드 — `A1` 같은 ID를 오류로 판정)
- `app/sitemap.ts`, `app/robots.ts` (옛 `lib/cards.ts` 를 불러다 씀) → 이번 버전 것으로 교체
- `app/page.tsx`, `app/not-found.tsx`, **`app/layout.tsx`** (옛 화면·옛 루트 레이아웃) → 이번 버전에는 없다. `<html>` 은 `app/[lang]/layout.tsx` 가 그린다
- `app/[lang]/card/[id]/opengraph-image.tsx` (옛 공유 이미지 — `lib/cards.ts` 의존)
- `components/Deck.tsx`, `components/ShareBar.tsx`, `components/SetHtmlLang.tsx`, **`components/HtmlLang.tsx`** (옛 카드 화면)
- 최상위 `cards.json` (새 버전은 `data/cards.json` 만 사용)

도메인: `NEXT_PUBLIC_SITE_URL` 환경변수로 canonical 주소를 바꿀 수 있다 (기본값 `https://lessregret.life`).
