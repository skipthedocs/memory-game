import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import type { TCard } from "./useMemoryGame";

type TCardProps = {
  cardDetails: TCard;
  isFlipped: boolean;
  isDisabled: boolean;
  onClick: () => void;
};

export const Card = ({
  cardDetails,
  isFlipped,
  isDisabled,
  onClick,
}: TCardProps) => {
  const [randomTilt, setRandomTilt] = useState(0);

  useEffect(() => {
    const tilt =
      isFlipped === true && cardDetails.isMatched === false
        ? Math.random() < 0.5
          ? Math.random() * 4 - 6
          : Math.random() * 4 + 2
        : 0;

    setRandomTilt(tilt);
  }, [isFlipped, cardDetails.isMatched]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isFlipped || isDisabled}
      tabIndex={isFlipped || isDisabled ? -1 : 0}
      className={cn(
        "w-full aspect-square relative [perspective:1000px] cursor-pointer",
        "text-red-700 underline font-system",
        "hover:text-red-800 hover:no-underline",
        "active:text-red-900",
        "focus:outline-hidden focus:ring-4 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-red-50",
        "rounded-xs transition-colors",
      )}
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        animate={{
          rotateY: isFlipped ? 180 : 0,
          rotateZ: isFlipped ? randomTilt : 0,
        }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        {/* Front of card */}
        <div
          className={cn(
            "w-full h-full absolute inset-0 rounded-lg border-2 shadow-xs overflow-hidden border-red-50",
            isDisabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
        >
          <div className="w-full h-full bg-red-100 flex justify-center items-center">
            <span className="text-4xl">❓</span>
          </div>
        </div>

        {/* Back of card */}
        <div className="w-full h-full absolute inset-0 rounded-lg border-2 overflow-hidden bg-white border-gray-100 flex items-center justify-center shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <span className="text-4xl">{cardDetails.value}</span>
        </div>
      </motion.div>
    </button>
  );
};
