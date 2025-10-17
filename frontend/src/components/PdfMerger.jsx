// src/components/PdfMerger.jsx
import React, { useState, useRef, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilePdf, FaTrash, FaCloudUploadAlt } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const toastRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  const isDark = theme === "dark";
  const textColor = isDark ? "text-light" : "text-dark";
  const cardBg = isDark ? "bg-dark border-secondary" : "bg-light border-light";
  const dropzoneBg = isDark ? "bg-dark border-info" : "bg-white border-primary";
  const progressBg = isDark ? "bg-dark" : "bg-light";

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
        header.textContent = "SmartJarwarTools";
        break;
      case "error":
        toastEl.classList.add("text-bg-danger");
        header.textContent = "SmartJarwarTools";
        break;
      case "warning":
        toastEl.classList.add("text-bg-warning");
        header.textContent = "SmartJarwarTools";
        break;
      default:
        toastEl.classList.add("text-bg-info");
        header.textContent = "SmartJarwarTools";
    }

    const toast = new window.bootstrap.Toast(toastEl);
    toast.show();
  };

  // 📥 Dropzone logic
  const onDrop = (acceptedFiles) => {
    if (!acceptedFiles.length) {
      showToast("No PDF files selected!", "warning");
      return;
    }
    const mapped = acceptedFiles.map((file) => ({ file }));
    setFiles((prev) => [...prev, ...mapped]);
    showToast(`${acceptedFiles.length} PDF(s) added`, "info");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [] },
  });

  // 🧹 File Actions
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    showToast("File removed.", "info");
  };

  const handleReset = () => {
    setFiles([]);
    setProgress(0);
    showToast("All files cleared.", "warning");
  };

  // 🔁 Drag reorder
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    setFiles(reorder(files, result.source.index, result.destination.index));
  };

  // 🚀 Merge PDFs
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) {
      showToast("Please select at least one PDF file!", "warning");
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    for (let f of files) formData.append("files", f.file, f.file.name);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://127.0.0.1:8000/merge-pdf/", true);
      xhr.responseType = "blob";

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = new Blob([xhr.response], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Merged.pdf");
          document.body.appendChild(link);
          link.click();
          link.remove();

          showToast("PDF merged successfully!", "success");
          setFiles([]);
          setProgress(0);
        } else {
          showToast("Error merging PDFs.", "error");
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        showToast("Merge failed. Try again!", "error");
        setLoading(false);
      };

      xhr.send(formData);
    } catch (err) {
      showToast("Something went wrong!", "error");
      setLoading(false);
    }
  };

  return (
    <div className={`container py-5 ${textColor}`}>
      {/* 🔔 Toast */}
      <div
        className="toast align-items-center position-fixed z-3 bottom-0 start-0 m-3 border-0"
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

      {/* 🧾 Heading */}
      <motion.h2
        className={`text-center fw-bold mb-4 ${isDark ? "text-info" : "text-primary"}`}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📚 Smart PDF Merger
      </motion.h2>

      {/* 📤 Dropzone */}
      <motion.div
        {...getRootProps()}
        className={`border border-2 rounded-4 p-5 text-center mb-4 shadow-sm ${dropzoneBg}`}
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
            ? "📂 Drop your PDF files here"
            : "Drag & drop PDF files"}
        </p>
        <small className={isDark ? "text-secondary" : "text-muted"}>
          or click to browse (.pdf)
        </small>
      </motion.div>

      {/* 🚀 Merge Button */}
      <div className="text-center mb-4">
        <button
          className={`btn ${
            isDark ? "btn-info text-white" : "btn-primary"
          } px-4 py-2 fw-semibold`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Merging...
            </>
          ) : (
            "Merge PDFs"
          )}
        </button>
        {files.length > 0 && (
          <button
            className={`btn ms-2 ${
              isDark
                ? "btn-outline-danger text-white border-danger"
                : "btn-outline-danger"
            }`}
            onClick={handleReset}
          >
            Clear All
          </button>
        )}
      </div>

      {/* 📊 Progress */}
      {loading && (
        <motion.div
          className={`progress mb-4 ${progressBg}`}
          style={{ height: "24px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-info"
            role="progressbar"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </motion.div>
      )}

      {/* 🗂️ File list */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="pdfs" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="d-flex gap-3 overflow-auto pb-2"
            >
              <AnimatePresence>
                {files.map((f, index) => (
                  <Draggable
                    key={f.file.name + f.file.lastModified}
                    draggableId={f.file.name + f.file.lastModified}
                    index={index}
                  >
                    {(provided) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`border rounded-4 p-3 text-center shadow-sm position-relative ${cardBg}`}
                        style={{
                          width: "160px",
                          ...provided.draggableProps.style,
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                          style={{ borderRadius: "50%" }}
                        >
                          <FaTrash />
                        </button>
                        <FaFilePdf
                          className={`fs-1 mb-2 ${
                            isDark ? "text-danger" : "text-primary"
                          }`}
                        />
                        <div
                          className="small fw-semibold text-truncate"
                          title={f.file.name}
                        >
                          {f.file.name}
                        </div>
                        <small
                          className={isDark ? "text-secondary" : "text-muted"}
                        >
                          {(f.file.size / 1024 / 1024).toFixed(2)} MB
                        </small>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
