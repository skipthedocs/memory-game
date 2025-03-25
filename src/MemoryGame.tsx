import { Board } from "./components/Board";
import { Card } from "./components/Card";
import { GameFooter } from "./components/GameFooter";
import { GameOver } from "./components/GameOver";
import { useMemoryGame } from "./hooks/useMemoryGame";

/*
 * Main component for the Memory Game
 * - Renders the game board, footer, and game-over message
 * - Uses the useMemoryGame hook to manage game state
 */
export const MemoryGame: React.FC = () => {
  const { gameState, flipCard, startNewGame, isCardFlipped } = useMemoryGame();

  return (
    <div className="w-full min-w-80 min-h-screen bg-red-50 flex flex-col items-center justify-center select-none">
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

      <GameFooter moves={gameState.moves} reset={startNewGame} />

      {gameState.status === "completed" && <GameOver />}
    </div>
  );
};
