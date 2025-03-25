import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryGame } from "./MemoryGame.tsx";

import "./index.css";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemoryGame />
  </StrictMode>,
);
