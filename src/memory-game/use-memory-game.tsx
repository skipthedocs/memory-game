import { useState } from "react";

type CardId = string;

export type Card = {
  id: CardId;
  value: string;
  isMatched: boolean;
};

type GameState = {
  cards: Record<CardId, Card>;
  moves: number;
} & (
  | { status: "ready"; flippedCards: [] }
  | { status: "oneFlipped"; flippedCards: [CardId] }
  | { status: "checking"; flippedCards: [CardId, CardId] }
  | { status: "completed"; flippedCards: [] }
);

export const useMemoryGame = () => {
  const createCards = () => {
    const baseValues = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍑", "🥝", "🍍"];

    const shuffledValues = [...baseValues, ...baseValues].sort(
      () => Math.random() - 0.5
    );

    const cards = shuffledValues.reduce<Record<CardId, Card>>(
      (cardsMap, currentValue, index) => {
        const cardId = `card-${index}`;

        cardsMap[cardId] = {
          id: cardId,
          value: currentValue,
          isMatched: false,
        };

        return cardsMap;
      },
      {}
    );

    return cards;
  };

  const getInitialState = (): GameState => ({
    status: "ready",
    cards: createCards(),
    flippedCards: [],
    moves: 0,
  });

  const [gameState, setGameState] = useState<GameState>(getInitialState);

  const areAllCardsMatched = (cards: Record<CardId, Card>) =>
    Object.values(cards).every((card) => card.isMatched);

  const handleCardMatch = (firstCardId: CardId, secondCardId: CardId) => {
    const { cards, moves } = gameState;
    const firstCard = cards[firstCardId];
    const secondCard = cards[secondCardId];

    const updatedCards = { ...cards };

    if (firstCard.value === secondCard.value) {
      updatedCards[firstCardId].isMatched = true;
      updatedCards[secondCardId].isMatched = true;
    }

    setGameState({
      status: areAllCardsMatched(updatedCards) ? "completed" : "ready",
      cards: updatedCards,
      flippedCards: [],
      moves: moves + 1,
    });
  };

  const flipCard = (cardId: CardId) => {
    const card = gameState.cards[cardId];

    if (card.isMatched) return;
    if (gameState.flippedCards.some((id) => id === cardId)) return;
    if (gameState.status === "checking") return;

    if (gameState.status === "ready") {
      setGameState({
        ...gameState,
        status: "oneFlipped",
        flippedCards: [cardId],
      });
    }

    if (gameState.status === "oneFlipped") {
      const [firstCardId] = gameState.flippedCards;

      setGameState({
        ...gameState,
        status: "checking",
        flippedCards: [firstCardId, cardId],
        moves: gameState.moves + 1,
      });

      setTimeout(() => handleCardMatch(firstCardId, cardId), 1000);
    }
  };

  return {
    gameState,
    flipCard,
    resetGame: () => setGameState(getInitialState()),
    isCardFlipped: (cardId: CardId) =>
      gameState.flippedCards.some((id) => id === cardId) ||
      gameState.cards[cardId].isMatched,
  };
};
