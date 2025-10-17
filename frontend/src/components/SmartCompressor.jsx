import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFileAlt,
  FaFileImage,
  FaFileVideo,
  FaTrash,
  FaDownload,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function SmartCompressor() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [settings, setSettings] = useState({
    image_quality: 60,
    video_bitrate: "800k",
    audio_bitrate: "128k",
  });
  const toastRef = useRef(null);

  // 🧾 File icon helper
  const getFileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "webp"].includes(ext))
      return <FaFileImage className={`fs-4 me-2 ${isDark ? "text-info" : "text-primary"}`} />;
    if (["mp4", "mkv", "mov", "avi"].includes(ext))
      return <FaFileVideo className={`fs-4 me-2 ${isDark ? "text-warning" : "text-danger"}`} />;
    return <FaFileAlt className={`fs-4 me-2 ${isDark ? "text-light" : "text-secondary"}`} />;
  };

  // 🧮 File size formatter
  const fmt = (bytes) => (bytes ? (bytes / 1024 / 1024).toFixed(2) + " MB" : "-");

  // 🔔 Bootstrap Toast Helper
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

    header.textContent = "Jarwar Developer";

    const toast = new window.bootstrap.Toast(toastEl);
    toast.show();
  };

  // 🧩 Dropzone logic
  const onDrop = (acceptedFiles) => {
    if (!acceptedFiles.length) {
      showToast("No files selected!", "warning");
      return;
    }
    const mapped = acceptedFiles.map((file) => ({ file }));
    setFiles((prev) => [...prev, ...mapped]);
    showToast(`${acceptedFiles.length} file(s) added`, "info");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  // 🚀 Compressor logic
  const handleCompressor = async () => {
    if (!files.length) return showToast("Select files first.", "warning");

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f.file));
    Object.entries(settings).forEach(([key, value]) => formData.append(key, value));

    try {
      setLoading(true);
      setProgress(0);
      setResults([]);
      showToast("Compression started...", "info");

      const response = await axios.post("http://127.0.0.1:8000/compress-file/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });

      setResults(response.data.results || []);
      setFiles([]);
      setProgress(0);
      showToast("Compression completed successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Compression failed. Please check console.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🧹 File controls
  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    showToast("File removed", "info");
  };

  const handleReset = () => {
    setFiles([]);
    setResults([]);
    setProgress(0);
    showToast("All files cleared", "warning");
  };

  const handleDownloadAndRemove = (i, downloadUrl, fileName) => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setResults((prev) => prev.filter((_, index) => index !== i));
    showToast(`${fileName} downloaded`, "success");
  };

  return (
    <div className={`container py-4 ${isDark ? "text-light" : "text-dark"}`}>
      {/* ✅ Toast (top-right) */}
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

      {/* Heading */}
      <motion.h2
        className={`text-center fw-bold mb-4 ${isDark ? "text-info" : "text-primary"}`}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ⚡ Smart File Compressor
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt className={`fs-1 mb-3 ${isDark ? "text-info" : "text-primary"}`} />
        <p className="fs-5 mb-0">
          {isDragActive ? "📂 Drop your files here" : "Drag & drop your files"}
        </p>
        <small className={isDark ? "text-secondary" : "text-muted"}>or click to browse</small>
      </motion.div>

      {/* Progress bar */}
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

      {/* Files Preview */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className={`card shadow-sm border-0 mb-4 ${isDark ? "bg-dark text-light" : "bg-white"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0">Selected Files</h6>
              <button className="btn btn-sm btn-outline-danger" onClick={handleReset}>
                Clear All
              </button>
            </div>
            <div className="d-flex flex-wrap gap-3 p-3 justify-content-center">
              {files.map((f, i) => (
                <motion.div
                  key={i}
                  className={`border rounded-4 shadow-sm text-center p-3 position-relative ${
                    isDark ? "bg-secondary text-light" : "bg-white"
                  }`}
                  style={{ width: "160px" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <button
                    onClick={() => handleRemoveFile(i)}
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    style={{ borderRadius: "50%" }}
                  >
                    <FaTrash />
                  </button>
                  {getFileIcon(f.file.name)}
                  <div className="small text-truncate mt-2" title={f.file.name}>
                    {f.file.name}
                  </div>
                  <div className="text-muted small">{fmt(f.file.size)}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compression Settings */}
      <motion.div
        className={`card shadow-sm border-0 mb-4 ${isDark ? "bg-dark text-light" : "bg-white"}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="card-header fw-bold">Compression Settings</div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Image Quality (10–95)</label>
              <input
                type="number"
                min="10"
                max="95"
                className="form-control"
                value={settings.image_quality}
                onChange={(e) =>
                  setSettings({ ...settings, image_quality: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Video Bitrate</label>
              <input
                type="text"
                className="form-control"
                value={settings.video_bitrate}
                onChange={(e) =>
                  setSettings({ ...settings, video_bitrate: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Audio Bitrate</label>
              <input
                type="text"
                className="form-control"
                value={settings.audio_bitrate}
                onChange={(e) =>
                  setSettings({ ...settings, audio_bitrate: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Compress Button */}
      <div className="text-center mb-4">
        <button
          className={`btn px-5 py-2 fw-semibold ${isDark ? "btn-info text-white" : "btn-primary"}`}
          onClick={handleCompressor}
          disabled={loading || !files.length}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Compressing...
            </>
          ) : (
            "Start Compression"
          )}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <motion.div
          className={`card shadow-sm border-0 mb-5 ${isDark ? "bg-dark text-light" : "bg-white"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-header fw-bold">Compression Results</div>
          <div className="table-responsive">
            <table className="table table-bordered align-middle mb-0">
              <thead className={isDark ? "table-dark" : "table-light"}>
                <tr>
                  <th>File</th>
                  <th>Original</th>
                  <th>Compressed</th>
                  <th>Saved %</th>
                  <th>Status</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i}>
                    <td>{r.file}</td>
                    <td>{fmt(r.original_size)}</td>
                    <td>{fmt(r.compressed_size)}</td>
                    <td>{r.saved_percent ? `${r.saved_percent}%` : "-"}</td>
                    <td className={r.status.includes("error") ? "text-danger" : "text-success"}>
                      {r.status}
                    </td>
                    <td>
                      {r.download_url && r.status === "success" ? (
                        <button
                          className="btn btn-sm btn-success d-flex align-items-center gap-2"
                          onClick={() =>
                            handleDownloadAndRemove(i, r.download_url, r.file)
                          }
                        >
                          <FaDownload /> Download
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
