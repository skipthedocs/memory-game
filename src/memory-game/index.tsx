import React from "react";
import { Card, useMemoryGame } from "./use-memory-game";

export const MemoryGame: React.FC = () => {
  const { gameState, flipCard, resetGame, isCardFlipped } = useMemoryGame();

  const renderCard = (card: Card) => {
    const isFlipped = isCardFlipped(card.id);
    const isDisabled = gameState.status === "checking" || card.isMatched;

    const cursor = gameState.status === "checking" ? "not-allowed" : "pointer";

    return (
      <button
        key={card.id}
        onClick={() => flipCard(card.id)}
        disabled={isDisabled}
        style={{
          width: "50px",
          height: "50px",
          cursor,
        }}
      >
        {isFlipped ? card.value : null}
      </button>
    );
  };

  return (
    <div>
      <div>
        <button onClick={resetGame}>Reset Game</button>
        <span>{`Moves: ${gameState.moves}`}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 50px)",
          gap: "8px",
          marginTop: "8px",
        }}
      >
        {Object.values(gameState.cards).map(renderCard)}
      </div>

      {gameState.status === "completed" && (
        <div>
          Congratulations! You completed the game in {gameState.moves} moves!
        </div>
      )}
    </div>
  );
};
