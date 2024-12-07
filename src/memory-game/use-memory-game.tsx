import { useState, useEffect, useRef } from "react";

type TCardId = string;

export type TCard = {
  id: TCardId;
  value: string;
  isMatched: boolean;
};

type TGameState = {
  cards: Record<TCardId, TCard>;
  moves: number;
} & (
  | { status: "ready" }
  | { status: "oneFlipped"; flippedCards: [TCardId] }
  | { status: "checking"; flippedCards: [TCardId, TCardId] }
  | { status: "completed" }
);

export const useMemoryGame = () => {
  const timeoutRef = useRef<number>();

  const createCards = () => {
    const baseValues = ["🍎", "🍓", "📌", "🧰", "🧨", "👺", "🎈", "🚨"];

    const shuffledValues = [...baseValues, ...baseValues].sort(
      () => Math.random() - 0.5
    );

    const cards = shuffledValues.reduce<Record<TCardId, TCard>>(
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

  const getInitialState = (): TGameState => ({
    status: "ready",
    cards: createCards(),
    moves: 0,
  });

  const [gameState, setGameState] = useState<TGameState>(getInitialState);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const areAllCardsMatched = (cards: Record<TCardId, TCard>) =>
    Object.values(cards).every((card) => card.isMatched);

  const handleCardMatch = (firstCardId: TCardId, secondCardId: TCardId) => {
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

  const flipCard = (cardId: TCardId) => {
    const card = gameState.cards[cardId];

    if (card.isMatched) {
      return;
    }

    if (gameState.status === "checking") {
      return;
    }

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

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setGameState({
        ...gameState,
        status: "checking",
        flippedCards: [firstCardId, cardId],
      });

      timeoutRef.current = setTimeout(() => {
        handleCardMatch(firstCardId, cardId);
        timeoutRef.current = undefined;
      }, 500);
    }
  };

  const isCardFlipped = (cardId: TCardId) => {
    if (gameState.cards[cardId].isMatched) {
      return true;
    }

    if (gameState.status === "oneFlipped" || gameState.status === "checking") {
      return gameState.flippedCards.includes(cardId);
    }

    return false;
  };

  const resetGame = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setGameState(getInitialState());
  };

  return {
    gameState,
    flipCard,
    isCardFlipped,
    resetGame,
  };
};
