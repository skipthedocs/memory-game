import { useEffect, useRef, useState } from "react";

type TCardId = string;

/*
 * Represents a single card in the memory game
 * - id: unique identifier for the card
 * - value: the emoji displayed on the card (e.g., 🍎, 🍓)
 * - isMatched: indicates if the card has been successfully matched with its pair
 */
export type TCard = {
  id: TCardId;
  value: string;
  isMatched: boolean;
};

/*
 * Represents the complete state of the game using a discriminated union type
 * The game can be in one of four states:
 * - ready: no cards are flipped
 * - oneFlipped: exactly one card is flipped
 * - checking: two cards are flipped and being checked for a match
 * - completed: all cards have been matched
 *
 * Common properties:
 * - cards: all cards in the game stored as a Record (object) for quick lookup
 * - moves: number of attempts the player has made
 */
type TGameState = {
  cards: Record<TCardId, TCard>;
  moves: number;
} & (
  | { status: "ready" }
  | { status: "oneFlipped"; flippedCard: TCardId }
  | { status: "checking"; flippedCards: [TCardId, TCardId] }
  | { status: "completed" }
);

export const useMemoryGame = () => {
  /*
   * Stores the timeout ID used when checking if two cards match
   * Using useRef ensures the timeout can be cleared even if the component re-renders
   */
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /*
   * Creates a new set of cards for the game
   * - Generates 8 pairs of emoji cards (16 total)
   * - Shuffles the cards randomly
   * - Returns an object where each card can be accessed by its cardId
   */
  const createCards = () => {
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

  const [gameState, setGameState] = useState<TGameState>(() => ({
    status: "ready",
    cards: createCards(),
    moves: 0,
  }));

  /*
   * Cleanup effect that removes any pending timeouts when the component unmounts
   * This is important to prevent memory leaks and ensure timeouts don't fire
   * after the component is no longer in use, which could cause errors
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /*
   * Handles the logic when two cards have been flipped
   * - Checks if the cards match based on their values
   * - Updates the matched status of cards if they match
   * - Checks if all cards are matched to determine if game is completed
   * - Increments the moves counter
   */
  const handleCardMatch = (firstCardId: TCardId, secondCardId: TCardId) => {
    setGameState((prevState) => {
      const updatedCards = { ...prevState.cards };

      if (
        updatedCards[firstCardId].value === updatedCards[secondCardId].value
      ) {
        updatedCards[firstCardId].isMatched = true;
        updatedCards[secondCardId].isMatched = true;
      }

      const isCompleted = Object.values(updatedCards).every(
        (card) => card.isMatched,
      );

      return {
        status: isCompleted ? "completed" : "ready",
        cards: updatedCards,
        moves: prevState.moves + 1,
      };
    });
  };

  /*
   * Main card flipping logic
   * - Handles different game states (ready, oneFlipped, checking)
   * - Prevents flipping matched cards or same card twice
   * - Sets up checking timeout when second card is flipped
   * - Updates game state based on player actions
   */
  const flipCard = (cardId: TCardId) => {
    const card = gameState.cards[cardId];

    if (card.isMatched || gameState.status === "checking") {
      return;
    }

    if (gameState.status === "oneFlipped" && gameState.flippedCard === cardId) {
      return;
    }

    if (gameState.status === "ready") {
      setGameState({
        ...gameState,
        status: "oneFlipped",
        flippedCard: cardId,
      });
      return;
    }

    if (gameState.status === "oneFlipped") {
      const firstCardId = gameState.flippedCard;

      setGameState({
        ...gameState,
        status: "checking",
        flippedCards: [firstCardId, cardId],
      });

      timeoutRef.current = setTimeout(() => {
        handleCardMatch(firstCardId, cardId);
        timeoutRef.current = null;
      }, 500);
    }
  };

  const isCardFlipped = (cardId: TCardId) => {
    const card = gameState.cards[cardId];
    if (card.isMatched) {
      return true;
    }

    if (gameState.status === "oneFlipped" && gameState.flippedCard === cardId) {
      return true;
    }

    if (
      gameState.status === "checking" &&
      gameState.flippedCards.includes(cardId)
    ) {
      return true;
    }

    return false;
  };

  const resetGame = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setGameState({
      status: "ready",
      cards: createCards(),
      moves: 0,
    });
  };

  return {
    gameState,
    flipCard,
    isCardFlipped,
    resetGame,
  };
};
