import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import {
  FaFilePdf,
  FaTrash,
  FaDownload,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function PdfSplitter() { 
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark"; 

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const toastRef = useRef(null);

  // 🧾 Toast helper
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

  // 🧩 Dropzone logic
  const onDrop = (acceptedFiles) => {
    if (!acceptedFiles.length)
      return showToast("No files selected!", "warning");
    setFiles((prev) => [...prev, ...acceptedFiles]);
    showToast(`${acceptedFiles.length} file(s) added`, "info");
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleSplit = async () => {
    if (!files.length) return showToast("Select a PDF first!", "warning");

    const formData = new FormData();
    formData.append("file", files[0]);

    try {
      setLoading(true);
      setImages([]);
      showToast("Processing PDF...", "info");

      const response = await axios.post(
        "http://127.0.0.1:8000/pdf-to-images/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setImages(response.data.images);
      setFiles([]); // <-- Remove the selected PDF file after splitting
      showToast("PDF split into images successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to split PDF.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (imgData, idx) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imgData}`;
    link.download = `page_${idx + 1}.png`;
    link.click();

    setImages((prevImages) => prevImages.filter((_, i) => i !== idx));
    showToast(`Page ${idx + 1} downloaded`, "success");
  };

  const handleRemoveFile = () => {
    setFiles([]);
    setImages([]);
    showToast("File removed", "info");
  };

  return (
    <div className={`container py-4 ${isDark ? "text-light" : "text-dark"}`}>
      {/* ✅ Toast */}
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

      {/* Heading */}
      <motion.h2
        className={`text-center fw-bold mb-4 ${
          isDark ? "text-info" : "text-primary"
        }`}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📄 PDF to Images
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
          {isDragActive ? "📂 Drop your PDF here" : "Drag & drop a PDF"}
        </p>
        <small className={isDark ? "text-secondary" : "text-muted"}>
          or click to browse
        </small>
      </motion.div>

      {/* Selected file preview */}
      {files.length > 0 && (
        <motion.div
          className={`card mb-4 ${isDark ? "bg-dark text-light" : "bg-white"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-body d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <FaFilePdf className="fs-3 text-danger" />
              <span className="fw-semibold">{files[0].name}</span>
            </div>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={handleRemoveFile}
            >
              <FaTrash />
            </button>
          </div>
        </motion.div>
      )}

      {/* Split Button */}
      <div className="text-center mb-4">
        <button
          className={`btn px-5 py-2 fw-semibold ${
            isDark ? "btn-info text-white" : "btn-primary"
          }`}
          onClick={handleSplit}
          disabled={loading || !files.length}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Splitting...
            </>
          ) : (
            "Split PDF"
          )}
        </button>
      </div>

      {/* Images preview */}
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            className="position-relative"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={`data:image/png;base64,${img}`}
              alt={`Page ${idx + 1}`}
              className="img-thumbnail"
              style={{ maxHeight: "300px" }}
            />
            <button
              className="btn btn-sm btn-success position-absolute"
              style={{ top: "5px", right: "5px" }}
              onClick={() => handleDownload(img, idx)}
            >
              <FaDownload />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
