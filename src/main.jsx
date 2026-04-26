import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

function SplashGate() {
  const [phase, setPhase] = useState("show");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fade"), 2000);
    const doneTimer = setTimeout(() => setPhase("done"), 2700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") {
    return <App />;
  }

  return (
    <div className={`splash-screen ${phase === "fade" ? "fade-out" : ""}`}>
      <img src="/IXO ENGINE START.png" alt="IXO Engine Start" />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SplashGate />
  </React.StrictMode>
);
