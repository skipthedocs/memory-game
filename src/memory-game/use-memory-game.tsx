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
  | { status: "ready" }
  | { status: "oneFlipped"; flippedCards: [CardId] }
  | { status: "checking"; flippedCards: [CardId, CardId] }
  | { status: "completed" }
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
      moves: moves + 1,
    });
  };

  const flipCard = (cardId: CardId) => {
    const card = gameState.cards[cardId];

    if (card.isMatched) {
      return;
    };

    if (gameState.status === "checking") {
      return;
    };

    if (gameState.status === "oneFlipped") {
      if (gameState.flippedCards.includes(cardId)) {
        return;
      }
    }

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

  const isCardFlipped = (cardId: CardId) => {
    if (gameState.cards[cardId].isMatched) {
      return true
    };

    if (gameState.status === "oneFlipped" || gameState.status === "checking") {
      return gameState.flippedCards.includes(cardId);
    }
    
    return false;
  };

  return {
    gameState,
    flipCard,
    isCardFlipped,
    resetGame: () => setGameState(getInitialState()),
  };
};
