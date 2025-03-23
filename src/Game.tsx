import { Board } from "./game/Board";
import { Card } from "./game/Card";
import { GameFooter } from "./game/GameFooter";
import { GameOver } from "./game/GameOver";
import { useMemoryGame } from "./game/useMemoryGame";

/*
 * Main component for the Memory Game
 * - Renders the game board, footer, and game-over message
 * - Uses the useMemoryGame hook to manage game state
 */
export const Game: React.FC = () => {
  const { gameState, flipCard, resetGame, isCardFlipped } = useMemoryGame();

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

      <GameFooter moves={gameState.moves} reset={resetGame} />

      {gameState.status === "completed" && <GameOver />}
    </div>
  );
};
