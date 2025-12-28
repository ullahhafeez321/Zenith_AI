import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ZenithAi from "./ZenithAi.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ZenithAi />
  </StrictMode>
);
