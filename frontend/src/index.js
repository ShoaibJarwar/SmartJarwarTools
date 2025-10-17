// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ Import ThemeProvider
import "./index.css"; // ✅ Keep your global styles (theme + loader)

const root = ReactDOM.createRoot(document.getElementById("root"));

// ✅ Wrap App with ThemeProvider
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// ✅ Fade out loader smoothly when React mounts
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.classList.add("fade-out");
    setTimeout(() => loader.remove(), 800); // matches CSS fade duration
  }
});
