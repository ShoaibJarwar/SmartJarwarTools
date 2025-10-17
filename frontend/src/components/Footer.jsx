import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Footer() {
  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";

  return (
    <footer
      className={`text-center py-4 small border-top mt-5 transition-all ${
        isDark
          ? "bg-dark text-light border-secondary"
          : "bg-light text-dark border-muted"
      }`}
    >
      © {new Date().getFullYear()}{" "}
      <span
        className={`fw-semibold ${
          isDark ? "text-info" : "text-primary"
        } hover-opacity-75`}
      >
        SmartJarwarTools
      </span>{" "}
      — All Rights Reserved
    </footer>
  );
}
