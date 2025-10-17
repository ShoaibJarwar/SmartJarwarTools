// src/pages/About.jsx
import React, { useContext } from "react";
import { motion } from "framer-motion";
import {
  FaTools,
  FaCode,
  FaReact,
  FaPython,
  FaRocket,
  FaBrain,
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function About() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const features = [
    {
      icon: <FaTools size={36} />,
      title: "All-in-One Toolkit",
      desc: "Access a growing suite of productivity tools for converting, compressing, and managing your digital files effortlessly.",
    },
    {
      icon: <FaCode size={36} />,
      title: "Built for Developers",
      desc: "Engineered with scalability, performance, and clean code principles — optimized for both developers and end users.",
    },
    {
      icon: <FaReact size={36} />,
      title: "Modern UI/UX",
      desc: "Crafted using React, Framer Motion, and responsive design for a seamless and interactive user experience.",
    },
    {
      icon: <FaPython size={36} />,
      title: "Powered by AI & APIs",
      desc: "Backed by Python and Django REST Framework for fast, intelligent, and reliable backend automation.",
    },
  ];

  const bgGradient = isDark
    ? "linear-gradient(135deg, #0a0f1e 0%, #111827 50%, #1e293b 100%)"
    : "linear-gradient(135deg, #e0f7fa 0%, #f8fafc 50%, #ffffff 100%)";

  return (
    <motion.div
      className={`min-vh-100 py-5 ${isDark ? "text-light" : "text-dark"}`}
      style={{
        background: bgGradient,
        position: "relative",
        overflow: "hidden",
        transition: "background 0.5s ease, color 0.3s ease",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Neon Glow Background Orbs */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: isDark
            ? "radial-gradient(circle at 20% 30%, rgba(56,189,248,0.1), transparent 70%), radial-gradient(circle at 80% 60%, rgba(99,102,241,0.12), transparent 70%)"
            : "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.08), transparent 70%), radial-gradient(circle at 80% 60%, rgba(56,189,248,0.08), transparent 70%)",
          zIndex: 0,
          transition: "background 0.5s ease",
        }}
      />

      <div className="container position-relative" style={{ zIndex: 2 }}>
        {/* Header */}
        <div className="text-center mb-5">
          <motion.h1
            className={`fw-bold mb-3 ${
              isDark ? "text-info" : "text-primary"
            }`}
            style={{
              textShadow: isDark
                ? "0 0 10px rgba(56,189,248,0.6)"
                : "0 0 5px rgba(14,165,233,0.3)",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            About SmartJarwarTools
          </motion.h1>
          <p
            className={`lead mx-auto ${
              isDark ? "text-secondary" : "text-muted"
            }`}
            style={{ maxWidth: "720px" }}
          >
            <strong>SmartJarwarTools</strong> is your modern productivity
            companion — a suite of intelligent tools built to make file
            management effortless, visually appealing, and lightning fast.
          </p>
        </div>

        {/* Features Section */}
        <div className="row g-4 text-center justify-content-center">
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="col-sm-6 col-lg-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`card h-100 border-0 rounded-4 shadow-lg ${
                  isDark ? "bg-dark text-light" : "bg-white text-dark"
                }`}
                style={{
                  background: isDark
                    ? "rgba(17, 24, 39, 0.85)"
                    : "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  boxShadow: isDark
                    ? "0 0 20px rgba(56,189,248,0.2)"
                    : "0 0 15px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="card-body d-flex flex-column align-items-center justify-content-center p-4">
                  <motion.div
                    whileHover={{
                      scale: 1.2,
                      rotate: 8,
                      filter: isDark
                        ? "drop-shadow(0 0 8px #38bdf8)"
                        : "drop-shadow(0 0 6px #0ea5e9)",
                    }}
                    className="mb-3"
                    style={{
                      color: isDark ? "#38bdf8" : "#0ea5e9",
                    }}
                  >
                    {item.icon}
                  </motion.div>
                  <h5 className="fw-semibold mb-2">{item.title}</h5>
                  <p
                    className={`text-center ${
                      isDark ? "text-secondary" : "text-muted"
                    }`}
                    style={{ fontSize: "0.95rem" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mission Section */}
        <motion.div
          className="text-center mt-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center mb-3 p-3 rounded-circle"
            style={{
              background: isDark
                ? "rgba(56,189,248,0.1)"
                : "rgba(14,165,233,0.1)",
              boxShadow: isDark
                ? "0 0 20px rgba(56,189,248,0.3)"
                : "0 0 15px rgba(14,165,233,0.3)",
              transition: "all 0.3s ease",
            }}
          >
            <FaRocket size={28} color={isDark ? "#38bdf8" : "#0ea5e9"} />
          </div>
          <h3
            className={`fw-bold mb-3 ${
              isDark ? "text-info" : "text-primary"
            }`}
            style={{
              textShadow: isDark
                ? "0 0 8px rgba(56,189,248,0.4)"
                : "0 0 5px rgba(14,165,233,0.2)",
            }}
          >
            Our Mission
          </h3>
          <p
            className={`lead mx-auto ${
              isDark ? "text-secondary" : "text-muted"
            }`}
            style={{ maxWidth: "720px" }}
          >
            To empower users and developers with smart, efficient, and visually
            stunning digital tools that enhance creativity and save time —
            powered by innovation and passion.
          </p>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          className="text-center mt-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center mb-3 p-3 rounded-circle"
            style={{
              background: isDark
                ? "rgba(56,189,248,0.1)"
                : "rgba(14,165,233,0.1)",
              boxShadow: isDark
                ? "0 0 20px rgba(56,189,248,0.3)"
                : "0 0 15px rgba(14,165,233,0.3)",
              transition: "all 0.3s ease",
            }}
          >
            <FaBrain size={28} color={isDark ? "#38bdf8" : "#0ea5e9"} />
          </div>
          <h3
            className={`fw-bold mb-3 ${
              isDark ? "text-info" : "text-primary"
            }`}
          >
            The Vision
          </h3>
          <p
            className={`lead mx-auto ${
              isDark ? "text-secondary" : "text-muted"
            }`}
            style={{ maxWidth: "720px" }}
          >
            Our vision is to create a unified ecosystem of AI-powered tools that
            help users achieve more with less effort — blending automation,
            performance, and design excellence.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
