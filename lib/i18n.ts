import type { Category, Lang, RegretType, Tone } from "@/lib/types";

export function isLang(value: string): value is Lang {
  return value === "ko" || value === "en";
}

export const categoryMeta: Record<
  Category,
  { label: { ko: string; en: string }; tone: Tone }
> = {
  marriage: {
    label: { ko: "부부·결혼", en: "Marriage" },
    tone: "cream",
  },
  career: {
    label: { ko: "커리어·일", en: "Career" },
    tone: "dusk",
  },
  family: {
    label: { ko: "가족·양육", en: "Family" },
    tone: "blush",
  },
  life: {
    label: { ko: "삶·노년", en: "A good life" },
    tone: "sage",
  },
};

export const regretMeta: Record<RegretType, { ko: string; en: string }> = {
  foundation: { ko: "기반의 후회", en: "Foundation regret" },
  boldness: { ko: "용기의 후회", en: "Boldness regret" },
  moral: { ko: "도리의 후회", en: "Moral regret" },
  connection: { ko: "관계의 후회", en: "Connection regret" },
};

export const copy = {
  ko: {
    subtitle: "오래 산 사람들의 후회에서, 아직 고를 수 있는 것을 고릅니다.",
    all: "전체",
    flip: "뒤집기",
    prev: "이전",
    next: "다음",
    tapHint: "탭하면 출처가 돌아옵니다",
    backHint: "다시 탭하면 화두로",
    read: "배경과 실천 읽기",
    sourceLabel: "출처",
    antiLabel: "Anti-BIFL",
    antiGloss: "평생 소유물처럼 붙들기 쉬운 선택입니다.",
    essayHeading: "이 문장이 놓인 자리",
    tipsHeading: "이번 주에 해볼 일",
    shareHeading: "나누기",
    kakao: "카카오톡",
    facebook: "페이스북",
    x: "X",
    copyLink: "링크 복사",
    copied: "링크를 복사했습니다.",
    shareNative: "공유",
    shareFail: "공유하지 못했습니다. 링크를 복사해 주세요.",
    age: (age: number) => `${age}세 무렵`,
    position: (index: number, total: number) => `${index} / ${total}`,
    prevCard: "이전 화두",
    nextCard: "다음 화두",
    deck: "카드로",
    photoCredit: "배경 사진 · Unsplash",
    homeDescription:
      "오래 산 사람들의 후회에서 고른 57장의 카드. 권장 연령, 네 가지 후회 유형, 평생 붙들기 쉬운 선택을 페이퍼 덱으로 읽습니다.",
  },
  en: {
    subtitle: "From the regrets of long lives, the choices still open to you.",
    all: "All",
    flip: "Flip",
    prev: "Prev",
    next: "Next",
    tapHint: "Tap for the source",
    backHint: "Tap again for the hook",
    read: "Read the context",
    sourceLabel: "Source",
    antiLabel: "Anti-BIFL",
    antiGloss: "A choice that is easy to treat as if it were bought for life.",
    essayHeading: "Where this line sits",
    tipsHeading: "Try this week",
    shareHeading: "Share",
    kakao: "KakaoTalk",
    facebook: "Facebook",
    x: "X",
    copyLink: "Copy link",
    copied: "Link copied.",
    shareNative: "Share",
    shareFail: "Could not share. Copy the link instead.",
    age: (age: number) => `Around ${age}`,
    position: (index: number, total: number) => `${index} / ${total}`,
    prevCard: "Previous",
    nextCard: "Next",
    deck: "Deck",
    photoCredit: "Background photo · Unsplash",
    homeDescription:
      "Fifty-seven cards drawn from the regrets of long lives, with a recommended age, one of four regret types, and the choices people treat as permanent.",
  },
} as const;
