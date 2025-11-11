import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const rootEl = document.getElementById("root")!;

createRoot(rootEl).render(<App />);
