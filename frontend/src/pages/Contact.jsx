import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function Contact() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setSuccess(null);

    try {
      await axios.post("http://127.0.0.1:8000/contact/", formData);
      setStatus("Message sent successfully!");
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Failed to send message. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`min-vh-100 d-flex align-items-center justify-content-center px-3 py-5 ${
        isDark ? "text-light" : "text-dark"
      }`}
      style={{
        background: isDark
          ? "linear-gradient(135deg, #0f0f1a, #1b1b2f, #000)"
          : "linear-gradient(135deg, #e8f0ff, #ffffff, #e5edff)",
        backgroundSize: "300% 300%",
        animation: "gradientShift 12s ease infinite",
        transition: "all 0.5s ease",
      }}
    >
      <motion.div
        className="container p-4 rounded-4 shadow-lg"
        style={{
          maxWidth: "850px",
          background: isDark
            ? "linear-gradient(145deg, rgba(20,25,45,0.8), rgba(15,20,40,0.7))"
            : "linear-gradient(145deg, #ffffff, #f7faff)",
          border: isDark
            ? "1px solid rgba(0,255,255,0.3)"
            : "1px solid rgba(0,0,0,0.05)",
          boxShadow: isDark
            ? "0 0 30px rgba(0,255,255,0.15)"
            : "0 0 20px rgba(0,0,0,0.08)",
          backdropFilter: "blur(15px)",
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-center fw-bold mb-4"
          style={{
            color: isDark ? "#00ffff" : "#0077ff",
            textShadow: isDark ? "0 0 8px #00ffff" : "0 0 4px #0077ff",
            letterSpacing: "1px",
          }}
        >
          Contact Us
        </motion.h2>

        <div className="row g-4">
          {/* Contact Info */}
          <motion.div
            className="col-md-5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="p-4 rounded-4 h-100"
              style={{
                background: isDark
                  ? "linear-gradient(160deg, #0f172a, #1e293b)"
                  : "linear-gradient(160deg, #ffffff, #f3f6ff)",
                border: isDark
                  ? "1px solid rgba(0,255,255,0.2)"
                  : "1px solid rgba(0,0,0,0.05)",
                boxShadow: isDark
                  ? "0 0 20px rgba(0,255,255,0.1)"
                  : "0 0 10px rgba(0,0,0,0.05)",
              }}
            >
              <h5 className="fw-semibold mb-3">Reach Out</h5>
              <p className="mb-3">
                We’d love to hear from you! Whether it’s feedback, questions, or
                collaboration ideas—let’s connect.
              </p>
              <p>
                <FaEnvelope className="me-2 text-info" />{" "}
                mshoaibjarwar1256@gmail.com
              </p>
              <p>
                <FaPhone className="me-2 text-info" /> +92 303 7224163
              </p>
              <p>
                <FaMapMarkerAlt className="me-2 text-info" /> DG Khan, Pakistan
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="col-md-7"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className="p-4 rounded-4"
              style={{
                background: isDark
                  ? "rgba(15, 25, 45, 0.75)"
                  : "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                border: isDark
                  ? "1px solid rgba(0,255,255,0.2)"
                  : "1px solid rgba(0,0,0,0.05)",
              }}
            >
              {/* --- Name --- */}
              <div className="mb-3">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control rounded-3 py-3 px-3 ${
                    isDark
                      ? "bg-dark text-light border-info"
                      : "bg-white text-dark border-primary"
                  }`}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name..."
                />
              </div>

              {/* --- Email --- */}
              <div className="mb-3">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control rounded-3 py-3 px-3 ${
                    isDark
                      ? "bg-dark text-light border-info"
                      : "bg-white text-dark border-primary"
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email..."
                />
              </div>

              {/* --- Message --- */}
              <div className="mb-3">
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className={`form-control rounded-3 py-3 px-3 ${
                    isDark
                      ? "bg-dark text-light border-info"
                      : "bg-white text-dark border-primary"
                  }`}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Enter your message..."
                  style={{ resize: "none" }}
                ></textarea>
              </div>

              {/* --- Submit Button --- */}
              <motion.button
                type="submit"
                className={`btn w-100 fw-semibold mt-2 py-2 ${
                  isDark ? "btn-outline-info border-2" : "btn-primary"
                }`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: isDark
                    ? "0 0 12px #00ffff"
                    : "0 0 10px rgba(0,123,255,0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <FaPaperPlane className="me-2" /> Send Message
                  </>
                )}
              </motion.button>

              {/* --- Status Message --- */}
              {status && (
                <motion.div
                  className="mt-4 text-center fw-semibold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {success ? (
                    <span style={{ color: "#00ffff" }}>
                      <FaCheckCircle className="me-2" /> {status}
                    </span>
                  ) : (
                    <span style={{ color: "#ff4b4b" }}>
                      <FaTimesCircle className="me-2" /> {status}
                    </span>
                  )}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </motion.div>

      {/* --- Styles --- */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Custom placeholder colors */
        #message::placeholder,
        #email::placeholder,
        #name::placeholder {
          color: ${isDark ? "rgba(150, 250, 255, 0.6)" : "rgba(0, 0, 0, 0.5)"};
          transition: color 0.3s ease;
        }

        #message:focus::placeholder,
        #email:focus::placeholder,
        #name:focus::placeholder {
          color: ${isDark ? "rgba(0, 255, 255, 0.8)" : "rgba(0, 123, 255, 0.8)"};
        }
      `}</style>
    </section>
  );
}