import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export const GameOver = () => {
  const { width, height } = useWindowSize();

  return <Confetti width={width} height={height} />;
};
