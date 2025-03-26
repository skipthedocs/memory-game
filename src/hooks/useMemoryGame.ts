import { useEffect, useReducer } from "react";
import type { TAction, TCardId, TGameState } from "../types";
import { createCards } from "../utils/createCards";
import { useTimeout } from "./useTimeout";

const gameReducer = (state: TGameState, action: TAction): TGameState => {
  /*
   * Handles starting a new game by resetting the state
   * - Generates a new set of cards
   * - Resets the number of moves to zero
   */
  if (action.type === "START_NEW_GAME") {
    return {
      status: "idle",
      cards: createCards(),
      moves: 0,
    };
  }

  /*
   * Handles flipping a card
   * - Prevents flipping a card if it's already matched or the game is in "checking" state
   * - Handles transitions between "idle", "oneFlipped", and "checking" states
   */
  if (action.type === "FLIP_CARD") {
    const cardId = action.payload.cardId;
    const card = state.cards[cardId];

    // Ignore if the card is already matched or the game is checking
    if (card.isMatched || state.status === "checking") {
      return state;
    }

    // Ignore if the same card is flipped again in "oneFlipped" state
    if (state.status === "oneFlipped" && state.flippedCard === cardId) {
      return state;
    }

    // Transition from "idle" to "oneFlipped"
    if (state.status === "idle") {
      return {
        ...state,
        status: "oneFlipped",
        flippedCard: cardId,
      };
    }

    // Transition from "oneFlipped" to "checking"
    if (state.status === "oneFlipped") {
      const flippedCardId = state.cards[state.flippedCard].id;

      return {
        ...state,
        status: "checking",
        flippedCards: [flippedCardId, cardId],
      };
    }

    throw new Error("Unexpected game state transition");
  }

  /*
   * Handles checking if two flipped cards match
   * - If they match, marks them as matched
   * - If all cards are matched, transitions to "completed" state
   * - Otherwise, transitions back to "idle" state
   */
  if (action.type === "CHECK_MATCH") {
    if (state.status === "checking") {
      const [firstCardId, secondCardId] = state.flippedCards;
      const newCards = { ...state.cards };

      if (newCards[firstCardId].value === newCards[secondCardId].value) {
        newCards[firstCardId].isMatched = true;
        newCards[secondCardId].isMatched = true;
      }

      const isCompleted = Object.values(newCards).every(
        (card) => card.isMatched,
      );

      return {
        status: isCompleted ? "completed" : "idle",
        cards: newCards,
        moves: state.moves + 1,
      };
    }

    throw new Error("Unexpected game state transition");
  }

  throw new Error("Unknown action type");
};

export const useMemoryGame = () => {
  const { set, clear } = useTimeout();

  const [gameState, dispatch] = useReducer(gameReducer, {
    status: "idle",
    cards: createCards(),
    moves: 0,
  });

  /*
   * Side effect:
   * - Monitors the "checking" state of the game
   * - Schedules a delayed dispatch to check if the two flipped cards match
   * - Uses a timeout of 800ms to allow the player to see the flipped cards
   */
  useEffect(() => {
    if (gameState.status === "checking") {
      set(() => {
        dispatch({ type: "CHECK_MATCH" });
      }, 800);
    }
  }, [gameState.status, set]);

  const flipCard = (cardId: TCardId) => {
    dispatch({ type: "FLIP_CARD", payload: { cardId } });
  };

  const isCardFlipped = (cardId: TCardId) => {
    const card = gameState.cards[cardId];

    const isMatched = card.isMatched;
    const isOneFlipped =
      gameState.status === "oneFlipped" && gameState.flippedCard === cardId;
    const isChecked =
      gameState.status === "checking" &&
      gameState.flippedCards.includes(cardId);

    return isMatched || isOneFlipped || isChecked;
  };

  const startNewGame = () => {
    clear();
    dispatch({ type: "START_NEW_GAME" });
  };

  return {
    gameState,
    flipCard,
    isCardFlipped,
    startNewGame,
  };
};
