import { cn } from "../lib/utils";

type GameFooterProps = {
  moves: number;
  reset: () => void;
};

export const GameFooter = ({ moves, reset }: GameFooterProps) => (
  <div className="flex gap-4 p-8 font-system">
    {moves > 0 && (
      <button
        type="button"
        onClick={reset}
        className={cn(
          "text-red-700 underline disabled:opacity-50",
          "hover:text-red-800 hover:no-underline",
          "active:text-red-900",
          "focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-red-50",
          "rounded-sm transition-colors",
        )}
      >
        Start new game
      </button>
    )}
    <span className="text-red-700">Moves: {moves}</span>
  </div>
);
