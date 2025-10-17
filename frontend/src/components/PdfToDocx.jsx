import React, { useState, useRef, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt, FaFilePdf, FaTrash } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function PdfToDocx() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toastRef = useRef(null);

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // 🔔 Toast helper
  const showToast = (message, type = "info") => {
    const toastEl = toastRef.current;
    if (!toastEl) return;

    const body = toastEl.querySelector(".toast-body");
    const header = toastEl.querySelector(".toast-header strong");
    body.textContent = message;

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

  // 📦 Dropzone
  const onDrop = (acceptedFiles) => {
    if (!acceptedFiles.length) {
      showToast("No PDF selected!", "warning");
      return;
    }
    const mapped = acceptedFiles.map((file) => ({ file }));
    setFiles((prev) => [...prev, ...mapped]);
    showToast(`${acceptedFiles.length} PDF file(s) added`, "info");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  // 🧹 File removal
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    showToast("File removed.", "info");
  };

  const clearAll = () => {
    setFiles([]);
    setProgress(0);
    showToast("All files cleared.", "warning");
  };

  // 🚀 Convert PDF → DOCX
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) {
      showToast("Please select a PDF file.", "warning");
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("pdf_file", files[0].file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://127.0.0.1:8000/pdf-to-docx/", true);
      xhr.responseType = "blob";

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = new Blob([xhr.response], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          const url = window.URL.createObjectURL(blob);
          const filename = files[0].file.name.replace(/\.pdf$/i, "") + ".docx";

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          showToast(`${filename} downloaded successfully!`, "success");
          clearAll();
        } else {
          showToast("Error generating DOCX.", "error");
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        showToast("Upload failed. Please try again.", "error");
        setLoading(false);
      };

      xhr.send(formData);
    } catch (err) {
      showToast("Something went wrong!", "error");
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
        className={`text-center fw-bold mb-4 ${isDark ? "text-info" : "text-primary"}`}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📄 PDF to DOCX Converter
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
            : "bg-light border-muted"
        }`}
        style={{ cursor: "pointer", transition: "0.3s ease-in-out" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt className={`fs-1 mb-3 ${isDark ? "text-info" : "text-primary"}`} />
        <p className="fs-5 mb-0">
          {isDragActive ? "📂 Drop your PDF here" : "Drag & drop your PDF file"}
        </p>
        <small className={isDark ? "text-secondary" : "text-muted"}>
          or click to browse
        </small>
      </motion.div>

      {/* Selected File */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className={`card mt-3 shadow-sm ${isDark ? "bg-dark text-light" : "bg-white"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-bold">Selected File</span>
              <button className="btn btn-sm btn-outline-danger" onClick={clearAll}>
                Clear All
              </button>
            </div>
            <div className="p-3 d-flex flex-wrap justify-content-center gap-3">
              {files.map((f, i) => (
                <motion.div
                  key={i}
                  className={`border rounded-4 p-3 text-center shadow-sm ${
                    isDark ? "bg-secondary border-info" : "bg-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <FaFilePdf size={40} className="text-danger mb-2" />
                  <div
                    className="fw-semibold small text-truncate"
                    title={f.file.name}
                    style={{ maxWidth: "180px" }}
                  >
                    {f.file.name}
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={() => removeFile(i)}
                  >
                    <FaTrash />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {loading && (
        <motion.div
          className={`progress my-4 ${isDark ? "bg-dark" : "bg-light"}`}
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

      {/* Convert Button */}
      <div className="text-center mt-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading || files.length === 0}
          className={`btn px-5 py-2 fw-semibold ${
            isDark ? "btn-info text-white" : "btn-primary"
          }`}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Converting...
            </>
          ) : (
            "Convert to DOCX"
          )}
        </motion.button>
      </div>
    </div>
  );
}
