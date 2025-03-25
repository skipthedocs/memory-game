import type { TCardId, TCard } from "../types";

/*
 * Creates a new set of cards for the game
 * - Generates 8 pairs of emoji cards (16 total)
 * - Shuffles the cards randomly
 * - Returns an object where each card can be accessed by its cardId
 */
export const createCards = () => {
  const baseValues = ["🍎", "🍓", "📌", "🧰", "🧨", "👺", "🎈", "🚨"];
  const shuffledValues = [...baseValues, ...baseValues].sort(
    () => Math.random() - 0.5,
  );

  return shuffledValues.reduce<Record<TCardId, TCard>>(
    (cardsMap, currentValue, index) => {
      const cardId = `card-${index}`;
      cardsMap[cardId] = {
        id: cardId,
        value: currentValue,
        isMatched: false,
      };
      return cardsMap;
    },
    {},
  );
};
