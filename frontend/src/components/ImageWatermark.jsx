import React, { useState, useRef, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FaImage, FaCloudUploadAlt, FaDownload, FaTrash } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function ImageWatermark() {
  const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
  const [watermarked, setWatermarked] = useState(null);
  const [text, setText] = useState("SmartJarwarTools");
  const [position, setPosition] = useState("bottom-right");
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(0.4);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toastRef = useRef(null);

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // Toast helper
  const showToast = (message, type = "info") => {
    const toastEl = toastRef.current;
    if (!toastEl) return;

    const body = toastEl.querySelector(".toast-body");
    const header = toastEl.querySelector(".toast-header strong");
    body.textContent = message;
    header.textContent = "Jarwar Developer";

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

  // Dropzone
  const onDrop = (acceptedFiles) => {
    if (!acceptedFiles.length)
      return showToast("No image selected!", "warning");
    const selected = acceptedFiles[0];
    setFile(selected);
    // setPreview(URL.createObjectURL(selected));
    setWatermarked(null);
    showToast("Image uploaded successfully!", "info");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    // setPreview(null);
    setWatermarked(null);
    showToast("Image removed.", "info");
  };

  const handleDownload = (imgUrl) => {
    const link = document.createElement("a");
    link.href = imgUrl; // Blob URL
    link.download = "watermarked.jpg";
    link.click();
    showToast("Image downloaded", "success");
  };

  // Submit watermark
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return showToast("Upload an image first!", "warning");

    try {
      setLoading(true);
      setProgress(0);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("watermark_text", text);
      formData.append("position", position);
      formData.append("font_size", fontSize);
      formData.append("color", color);
      formData.append("opacity", opacity);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://127.0.0.1:8000/watermark/", true);
      xhr.responseType = "blob";

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable)
          setProgress(Math.round((e.loaded * 100) / e.total));
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = new Blob([xhr.response], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          setWatermarked(url);
          showToast("Watermark applied successfully!", "success");
        } else {
          showToast("Failed to apply watermark.", "error");
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        showToast("Network error. Try again.", "error");
        setLoading(false);
      };

      xhr.send(formData);
    } catch (err) {
      showToast("Something went wrong!", "error");
      setLoading(false);
    }
  };

  return (
    <div className={`container py-4 ${isDark ? "text-light" : "text-dark"}`}>
      {/* Toast */}
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
            className={`btn-close ${isDark ? "btn-close-white" : ""}`}
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">Message here</div>
      </div>

      {/* Title */}
      <motion.h2
        className={`text-center fw-bold mb-4 ${
          isDark ? "text-info" : "text-primary"
        }`}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        💧 Image Watermark Tool
      </motion.h2>

      {/* Dropzone */}
      <motion.div
        {...getRootProps()}
        className={`border border-2 rounded-4 p-5 text-center mb-4 shadow-sm ${
          isDragActive
            ? isDark
              ? "bg-secondary border-info"
              : "bg-primary bg-opacity-10 border-primary"
            : isDark
            ? "bg-dark border-secondary"
            : "bg-light"
        }`}
        style={{ cursor: "pointer", transition: "0.3s ease-in-out" }}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt
          className={`fs-1 mb-3 ${isDark ? "text-info" : "text-primary"}`}
        />
        <p className="fs-5 mb-0">
          {isDragActive ? "📂 Drop your image here" : "Drag & drop an image"}
        </p>
        <small className={isDark ? "text-secondary" : "text-muted"}>
          or click to browse (.jpg, .png)
        </small>
      </motion.div>

      {/* Uploaded file card */}
      {file && (
        <motion.div
          className={`card mb-4 ${isDark ? "bg-dark text-light" : "bg-white"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-body d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <FaImage
                className={`fs-3 ${isDark ? "text-info" : "text-primary"}`}
              />
              <span className="fw-semibold">{file.name}</span>
            </div>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={removeFile}
            >
              <FaTrash />
            </button>
          </div>
        </motion.div>
      )}

      {/* Watermark settings form */}
      {file && (
        <motion.form
          onSubmit={handleSubmit}
          className={`p-4 rounded-4 shadow-lg border ${
            isDark ? "bg-dark border-secondary" : "bg-light border-light"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Watermark Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Position</label>
              <select
                className="form-select"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="center">Center</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="diagonal">Diagonal</option>
              </select>
            </div>
          </div>

          <div className="row mt-3 g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Font Size</label>
              <input
                type="number"
                min="10"
                max="200"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="form-control form-control-color"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Opacity <small>({opacity})</small>
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="form-range"
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className={`btn px-5 py-2 fw-semibold ${
                isDark ? "btn-info text-white" : "btn-primary"
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Processing...
                </>
              ) : (
                "Apply Watermark"
              )}
            </button>
          </div>

          {loading && (
            <div className="progress mt-4" style={{ height: "20px" }}>
              <div
                className={`progress-bar progress-bar-striped progress-bar-animated ${
                  isDark ? "bg-primary" : "bg-info"
                }`}
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          )}
        </motion.form>
      )}

      {/* Preview / Result */}
      <div className="mt-5 text-center">
        <AnimatePresence mode="wait">
          {watermarked && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h5 className="fw-bold mb-3">Watermarked Image</h5>

              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <motion.div
                  className="position-relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={watermarked}
                    alt="Result"
                    className="img-fluid rounded thumbnail shadow-lg border"
                    style={{ maxHeight: "450px" }}
                  />
                  <button
                    className="btn btn-sm btn-success position-absolute"
                    style={{ top: "5px", right: "5px" }}
                    onClick={() => handleDownload(watermarked)}
                    aria-label="Download watermarked image"
                  >
                    <FaDownload />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
