import { useRef, useCallback, useEffect } from "react";

export const useTimeout = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const set = useCallback((callback: () => void, delay: number) => {
    clear();
    timeoutRef.current = setTimeout(callback, delay);
  }, []);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => clear, [clear]);

  return { set, clear };
};
