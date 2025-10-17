// src/components/ThemeToggle.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-outline-secondary d-flex align-items-center gap-2"
    >
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
}
