import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaCloudUploadAlt } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function ImageFormatConverter() {
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState("JPEG");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toastRef = useRef(null);

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // 🧩 Toast Helper
  const showToast = (message, type = "info") => {
    const toastEl = toastRef.current;
    if (!toastEl) return;

    const body = toastEl.querySelector(".toast-body");
    const header = toastEl.querySelector(".toast-header strong");
    body.textContent = message;
    header.textContent = "SmartJarwarTools";

    toastEl.classList.remove(
      "text-bg-success",
      "text-bg-danger",
      "text-bg-warning",
      "text-bg-info"
    );

    switch (type) {
      case "success":
        toastEl.classList.add("text-bg-success");
        break;
      case "error":
        toastEl.classList.add("text-bg-danger");
        break;
      case "warning":
        toastEl.classList.add("text-bg-warning");
        break;
      default:
        toastEl.classList.add("text-bg-info");
    }

    const toast = new window.bootstrap.Toast(toastEl);
    toast.show();
  };

  // 📥 Dropzone logic
  const onDrop = (acceptedFiles) => {
    if (!acceptedFiles.length) {
      showToast("No images selected!", "warning");
      return;
    }

    setFiles((prev) => [...prev, ...acceptedFiles]);
    showToast(`${acceptedFiles.length} image(s) added`, "info");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  // 🗑️ Remove file
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    showToast("Image removed", "info");
  };

  // 🚀 Convert & Download
  const handleConvert = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      showToast("Please add at least one image!", "warning");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      let completed = 0;

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("format", format);

        const response = await axios.post(
          "http://127.0.0.1:8000/image-format-converter/",
          formData,
          {
            responseType: "blob",
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (event) => {
              if (event.lengthComputable) {
                const percent = Math.round((event.loaded * 100) / event.total);
                setProgress(percent);
              }
            },
          }
        );

        if (response.status !== 200) {
          showToast("Conversion failed for one or more images!", "error");
          continue;
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${file.name.split(".")[0]}.${format.toLowerCase()}`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();

        completed++;
        setProgress(Math.round((completed / files.length) * 100));
      }

      showToast("Conversion completed successfully!", "success");
      setFiles([]);
    } catch (err) {
      console.error(err);
      showToast("Failed to convert images!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container py-5 ${isDark ? "text-light" : "text-dark"}`}>
      {/* 🔔 Toast */}
      <div
        className="toast align-items-center position-fixed z-1 bottom-0 start-0 m-3 border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref={toastRef}
      >
        <div
          className={`toast-header ${
            isDark ? "bg-dark text-light" : "bg-light text-dark"
          }`}
        >
          <strong className="me-auto">Info</strong>
          <small>Now</small>
          <button
            type="button"
            className={`btn-close ${isDark ? "btn-close-white" : ""} ms-2 mb-1`}
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">Message here</div>
      </div>

      {/* 🧾 Heading */}
      <motion.h2
        className={`text-center fw-bold mb-4 ${
          isDark ? "text-info" : "text-primary"
        }`}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🖼️ Image Format Converter
      </motion.h2>

      {/* 🗂️ Dropzone */}
      <motion.div
        {...getRootProps()}
        className={`border border-2 rounded-4 p-5 text-center mb-4 shadow-sm ${
          isDragActive
            ? isDark
              ? "bg-secondary border-info"
              : "bg-primary bg-opacity-10 border-primary"
            : isDark
            ? "bg-dark border-secondary"
            : "bg-white border-muted"
        }`}
        style={{ cursor: "pointer", transition: "0.3s ease-in-out" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt
          className={`fs-1 mb-3 ${isDark ? "text-info" : "text-primary"}`}
        />
        <p className="fs-5 mb-0">
          {isDragActive
            ? "📂 Drop your images here"
            : "Drag & drop your images"}
        </p>
        <small className={isDark ? "text-secondary" : "text-muted"}>
          or click to browse
        </small>
      </motion.div>

      {/* ⚙️ Format Selector */}
      <div className="text-center mb-4">
        <label className="fw-semibold me-2">Convert to:</label>
        <select
          className={`form-select d-inline-block w-auto ${
            isDark ? "bg-dark text-light border-info" : "border-primary"
          }`}
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="JPEG">JPEG</option>
          <option value="PNG">PNG</option>
          <option value="WEBP">WEBP</option>
          <option value="BMP">BMP</option>
          <option value="GIF">GIF</option>
          <option value="TIFF">TIFF</option>
          <option value="AVIF">AVIF</option>
          <option value="HEIF">HEIF</option>
        </select>
      </div>

      {/* 🚀 Convert Button */}
      <div className="text-center mb-4">
        <button
          className={`btn ${
            isDark ? "btn-info text-white" : "btn-primary"
          } px-4 py-2 fw-semibold`}
          onClick={handleConvert}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Converting...
            </>
          ) : (
            "Convert & Download"
          )}
        </button>
      </div>

      {/* 📊 Progress Bar */}
      {loading && (
        <motion.div
          className={`progress mb-4 ${isDark ? "bg-dark" : "bg-light"}`}
          style={{ height: "24px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className={`progress-bar progress-bar-striped progress-bar-animated ${
              isDark ? "bg-info" : "bg-primary"
            }`}
            role="progressbar"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </motion.div>
      )}

      {/* 🖼️ Preview Section */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="d-flex flex-wrap gap-3 justify-content-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {files.map((file, index) => (
              <motion.div
                key={file.name}
                className={`position-relative border rounded-4 overflow-hidden shadow-sm ${
                  isDark ? "bg-dark border-info" : "bg-white border-light"
                }`}
                style={{ width: "120px", height: "120px" }}
                whileHover={{ scale: 1.05 }}
              >
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                >
                  <FaTrash />
                </button>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
