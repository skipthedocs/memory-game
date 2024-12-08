import React from "react";
import { useMemoryGame } from "./MemoryGame/useMemoryGame";
import { Card } from "./MemoryGame/Card";
import { Board } from "./MemoryGame/Board";
import { GameOver } from "./MemoryGame/GameOver";
import { GameFooter } from "./MemoryGame/GameFooter";

export const MemoryGame: React.FC = () => {
  const { gameState, flipCard, resetGame, isCardFlipped } = useMemoryGame();

  return (
    <div className="w-full min-h-[100vh] bg-red-50 flex justify-center items-center flex-col select-none">
      <Board>
        {Object.values(gameState.cards).map((cardDetails) => {
          const isFlipped = isCardFlipped(cardDetails.id);
          const isDisabled =
            gameState.status === "checking" || cardDetails.isMatched;

          return (
            <Card
              key={cardDetails.id}
              cardDetails={cardDetails}
              isFlipped={isFlipped}
              isDisabled={isDisabled}
              onClick={() => flipCard(cardDetails.id)}
            />
          );
        })}
      </Board>

      <GameFooter moves={gameState.moves} reset={resetGame} />

      {gameState.status === "completed" && <GameOver />}
    </div>
  );
};
