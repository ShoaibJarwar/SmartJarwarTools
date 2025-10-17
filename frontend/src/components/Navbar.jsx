// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaFilePdf,
  FaCompressAlt,
  FaExchangeAlt,
  FaTools,
  FaFileImage,
  FaWater,
} from "react-icons/fa";

export default function Navbar() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const tools = [
    { path: "/images-to-pdf", label: "Images → PDF", icon: <FaFileImage className="text-warning" /> },
    { path: "/docx-to-pdf", label: "Docx → PDF", icon: <FaFilePdf className="text-danger" /> },
    { path: "/pdf-to-docx", label: "PDF → Docx", icon: <FaExchangeAlt className="text-warning" /> },
    { path: "/merge-pdf", label: "Merge PDFs", icon: <FaFilePdf className="text-danger" /> },
    { path: "/compress-file", label: "Compressor", icon: <FaCompressAlt className="text-success" /> },
    { path: "/pdf-to-images", label: "PDF Splitter", icon: <FaFileImage className="text-warning" /> },
    { path: "/image-format-converter", label: "Format Converter", icon: <FaTools className="text-info" /> },
    { path: "/watermark", label: "Watermark", icon: <FaWater className="text-primary" /> },
  ];

  return (
    <motion.nav
      className="navbar navbar-expand-lg sticky-top py-2"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(15,15,25,0.95), rgba(25,30,45,0.95))"
          : "linear-gradient(135deg, rgba(245,248,255,0.9), rgba(230,240,255,0.9))",
        backdropFilter: "blur(12px)",
        borderBottom: isDark
          ? "1px solid rgba(0,255,255,0.2)"
          : "1px solid rgba(0,0,0,0.05)",
        boxShadow: isDark
          ? "0 0 18px rgba(0,255,255,0.1)"
          : "0 2px 12px rgba(0,0,0,0.05)",
        transition: "all 0.5s ease",
      }}
    >
      <div className="container d-flex align-items-center justify-content-between">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <motion.img
            src="./logo512.png"
            alt="logo"
            height="34"
            width="120"
            className="rounded-3"
            whileHover={{ scale: 1.05 }}
          />
        </Link>

        {/* Theme Toggle */}
        <div className="d-flex align-items-center gap-3">
          <ThemeToggle />
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {[
              { path: "/", label: "Home" },
              { path: "/about", label: "About" },
              { path: "/contact", label: "Contact" },
            ].map((link) => (
              <li className="nav-item" key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 fw-semibold rounded-3 ${
                      isActive
                        ? isDark
                          ? "text-info bg-opacity-25 bg-info-subtle"
                          : "text-primary bg-primary-subtle"
                        : isDark
                        ? "text-light"
                        : "text-secondary"
                    }`
                  }
                  style={{
                    transition: "all 0.3s ease",
                    textShadow: isDark ? "0 0 6px rgba(0,255,255,0.2)" : "none",
                  }}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {/* Tools Dropdown */}
            <li className="nav-item dropdown position-relative tools-dropdown">
              <span
                className={`nav-link dropdown-toggle px-3 py-2 rounded-3 fw-semibold ${
                  isDark ? "text-light" : "text-secondary"
                }`}
                role="button"
              >
                Tools
              </span>
              <div
                className="dropdown-menu shadow-lg rounded-4 p-2 mt-2 border-0"
                style={{
                  minWidth: "260px",
                  background: isDark
                    ? "rgba(20,30,50,0.95)"
                    : "rgba(255,255,255,0.95)",
                  border: isDark
                    ? "1px solid rgba(0,255,255,0.15)"
                    : "1px solid rgba(0,0,0,0.05)",
                  boxShadow: isDark
                    ? "0 0 25px rgba(0,255,255,0.1)"
                    : "0 0 15px rgba(0,0,0,0.05)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                }}
              >
                {tools.map((tool) => (
                  <NavLink
                    key={tool.path}
                    to={tool.path}
                    className={({ isActive }) =>
                      `dropdown-item d-flex align-items-center gap-2 py-2 px-3 rounded-3 fw-medium ${
                        isActive
                          ? "bg-info-subtle text-info"
                          : isDark
                          ? "text-light"
                          : "text-secondary"
                      }`
                    }
                    style={{
                      transition: "all 0.3s ease",
                    }}
                  >
                    <span
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "8px",
                        background: isDark
                          ? "rgba(0,255,255,0.08)"
                          : "rgba(0,0,255,0.06)",
                      }}
                    >
                      {tool.icon}
                    </span>
                    {tool.label}
                  </NavLink>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Hover Dropdown & Animation */}
      <style>{`
        .tools-dropdown:hover .dropdown-menu {
          display: block;
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .tools-dropdown .dropdown-menu {
          display: none;
          opacity: 0;
          visibility: hidden;
          transform: translateY(12px);
          transition: all 0.35s ease;
          position: absolute;
          right: 0;
          z-index: 1000;
        }

        .dropdown-item:hover {
          transform: translateX(6px);
          background: ${
            isDark
              ? "rgba(0,255,255,0.08) !important"
              : "rgba(0,123,255,0.08) !important"
          };
          color: ${isDark ? "#00ffff !important" : "#0077ff !important"};
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.nav>
  );
}
