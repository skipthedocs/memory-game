export type TCardId = string;

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
 * - idle: no cards are flipped
 * - oneFlipped: exactly one card is flipped
 * - checking: two cards are flipped and being checked for a match
 * - completed: all cards have been matched
 *
 * Common properties:
 * - cards: all cards in the game stored as a Record (object) for quick lookup
 * - moves: number of attempts the player has made
 */
export type TGameState = {
  cards: Record<TCardId, TCard>;
  moves: number;
} & (
  | { status: "idle" }
  | { status: "oneFlipped"; flippedCard: TCardId }
  | { status: "checking"; flippedCards: [TCardId, TCardId] }
  | { status: "completed" }
);

/*
 * Represents all possible actions that can be dispatched in the game
 * - START_NEW_GAME: transitions to "idle" state and shuffles the cards
 * - FLIP_CARD: transitions from "idle" to "oneFlipped" or from "oneFlipped" to "checking"
 * - CHECK_MATCH: transitions from "checking" to "idle" or "completed"
 */
export type TAction =
  | { type: "START_NEW_GAME" }
  | { type: "FLIP_CARD"; payload: { cardId: TCardId } }
  | { type: "CHECK_MATCH" };
