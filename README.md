# Less Regret — 후회가 적은 삶

57장의 카드로 만나는 인생 후회 데이터. 카드 앞면은 후킹, 뒷면은 스토리·인용·오늘의 실천.
한국어(`/ko`)와 영어(`/en`)를 완전히 분리해 렌더링한다.

## 스택

- Next.js 14 (App Router) · TypeScript · Tailwind CSS
- 정적 생성(SSG): 카드 57장 × 2개 언어 = 114개 카드 페이지

## 시작하기

```bash
npm install
npm run dev      # http://localhost:3000 → /ko 또는 /en 으로 이동
npm run build    # 카드 데이터 검증(prebuild) + 정적 페이지 121개 생성
npm start
```

## 구조

```
app/
  layout.tsx                 루트 레이아웃 (폰트, 메타데이터, metadataBase)
  [lang]/layout.tsx          언어별 헤더·푸터·metadata
  [lang]/page.tsx            카드 덱 (히어로 + CardDeck)
  [lang]/card/[id]/page.tsx  카드 상세 (스토리·인용·출처·이전/다음)
  sitemap.ts                 ko/en + 카드 114개 = 116 URL
  robots.ts
components/
  CardDeck.tsx               6대 카테고리 탭 · 2단계 플립 · 공유 버튼
  SiteHeader.tsx             Less Regret 로고(0.18em 간격) + 언어 전환
  HtmlLang.tsx               <html lang> 동기화
lib/
  categories.ts              6대 카테고리 정의 (slug·한/영·톤)
  cards.ts                   카드 타입·조회 헬퍼·데이터 검증
data/
  cards.json                 57장 카드 원본 (id "01"~"57")
scripts/
  check-cards.mjs            빌드 전 데이터 검증 (npm run check:cards)
public/images/               점묘(부부) · 사진(커리어) 배경
```

## 카드 데이터 규칙

- `id`: 두 자리 숫자 `"01"`~`"57"` (`^\d{2}$`)
- `categorySlug`: `love` · `work` · `money` · `family` · `body` · `self`
- `title` / `titleEn`: 두 줄 후킹 (`\n` 한 번). 교훈조 금지, 결핍·불안·갈등을 건드리는 문장
- `storyKo` / `storyEn`: 나이·상황·대화·후회의 디테일이 있는 미니 서사
- `quoteKo` / `quoteEn`: 57장 전부 채움 (빈 인용 없음)
- `oneLiner` / `oneLinerEn`: 오늘 바로 하는 실천 한 문장
- `actionTagsKo` / `actionTagsEn`: 3개씩, 영문판은 100% 영어
- `sourceShortKo` / `sourceShortEn`: 카드 앞면에 보이는 짧은 출처 (URL 노출 없음)
- `source` / `sourceEn` · `sourceUrl`: 뒷면·상세 페이지의 전체 출처와 원문 링크

`npm run check:cards` 가 위 규칙을 검사하며, `npm run build` 전에 자동 실행된다.

## 6대 카테고리

| slug | 한국어 | English | 장수 |
|---|---|---|---|
| love | 사랑·결혼 | Marriage & Love | 12 |
| work | 일·커리어 | Work & Career | 8 |
| money | 돈·자산 | Money & Wealth | 8 |
| family | 가족·친구 | Family & Friends | 12 |
| body | 몸·마음 | Body & Mind | 8 |
| self | 나·시간 | Self & Time | 9 |

## 배포 시 주의 (기존 저장소에서 올릴 때)

이전 버전의 아래 파일이 남아 있으면 빌드가 실패한다. **업로드 전에 삭제**한다.

- `lib/cards.ts`, `lib/i18n.ts`, `lib/site.ts`, `lib/types.ts` (옛 카드 검증 코드 — `A1` 같은 ID를 오류로 판정)
- `app/sitemap.ts`, `app/robots.ts` (옛 `lib/cards.ts` 를 불러다 씀) → 이번 버전 것으로 교체
- `app/page.tsx`, `app/not-found.tsx` (옛 화면) → 이번 버전 것으로 교체
- `app/[lang]/card/[id]/opengraph-image.tsx` (옛 공유 이미지 — `lib/cards.ts` 의존)
- `components/Deck.tsx`, `components/ShareBar.tsx`, `components/SetHtmlLang.tsx` (옛 카드 화면)
- 최상위 `cards.json` (새 버전은 `data/cards.json` 만 사용)

도메인: `NEXT_PUBLIC_SITE_URL` 환경변수로 canonical 주소를 바꿀 수 있다 (기본값 `https://lessregret.life`).
