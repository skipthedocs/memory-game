import { cn } from "../lib/utils";

export const Board: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div 
      className={cn(
        "grid grid-cols-4 gap-2",
        "mt-2 p-8",
        "w-full max-w-xl",
      )}
    >
      {children}
    </div>
  );
};