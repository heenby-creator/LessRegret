import raw from "@/data/cards.json";
import { CATEGORIES, REGRET_TYPES, type Card } from "@/lib/types";

const cards = raw as Card[];

const categorySet = new Set<string>(CATEGORIES);
const regretSet = new Set<string>(REGRET_TYPES);

function assertDataset(list: Card[]) {
  if (list.length !== 57) {
    throw new Error(`LessRegret expected 57 cards, received ${list.length}.`);
  }

  const ids = new Set<string>();
  for (const card of list) {
    if (!/^([0-5][0-9])$/.test(card.id) || ids.has(card.id)) {
      throw new Error(`Invalid card id: ${card.id}`);
    }
    ids.add(card.id);
    if (!categorySet.has(card.category) || !regretSet.has(card.regretType)) {
      throw new Error(`Invalid taxonomy on card ${card.id}`);
    }
    if (card.age < 18 || card.age > 80) {
      throw new Error(`Unexpected age on card ${card.id}`);
    }
    if (card.antiBifl.length < 1 || card.tips.ko.length < 2 || card.tips.en.length < 2) {
      throw new Error(`Incomplete card ${card.id}`);
    }
    const strings = [card.hook, card.quote, card.source, card.title, card.essay];
    if (strings.some((item) => !item.ko.trim() || !item.en.trim())) {
      throw new Error(`Empty copy on card ${card.id}`);
    }
  }
}

assertDataset(cards);

export function getCards(): Card[] {
  return cards;
}

export function getCard(id: string): Card | undefined {
  return cards.find((card) => card.id === id);
}

export function getNeighbors(id: string): { prev?: Card; next?: Card } {
  const index = cards.findIndex((card) => card.id === id);
  if (index < 0) return {};
  return {
    prev: cards[index - 1],
    next: cards[index + 1],
  };
}
