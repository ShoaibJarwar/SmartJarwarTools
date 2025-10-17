import React, { useState, useRef, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaSyncAlt, FaExchangeAlt, FaCloudUploadAlt } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function ImageToPdf() {
  const [files, setFiles] = useState([]);
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
      showToast("No images selected!", "warning");
      return;
    }

    const mapped = acceptedFiles.map((file) => ({
      file,
      rotation: 0,
      flipped: false,
    }));

    setFiles((prev) => [...prev, ...mapped]);
    showToast(`${acceptedFiles.length} image(s) added`, "info");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  // 🔁 Image manipulation
  const rotateImage = (index) =>
    setFiles((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, rotation: (f.rotation + 90) % 360 } : f
      )
    );

  const flipImage = (index) =>
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, flipped: !f.flipped } : f))
    );

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    showToast("Image removed", "info");
  };

  // 🔄 Reordering
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

  // 🧠 Compress + transform
  const compressImage = (file, rotation = 0, flipped = false) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          let width = img.width;
          let height = img.height;
          const maxDim = 1000;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height *= maxDim / width;
              width = maxDim;
            } else {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          if (rotation % 180 !== 0) {
            canvas.width = height;
            canvas.height = width;
          } else {
            canvas.width = width;
            canvas.height = height;
          }

          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.scale(flipped ? -1 : 1, 1);
          ctx.drawImage(img, -width / 2, -height / 2, width, height);
          ctx.restore();

          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              resolve(new File([blob], file.name, { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.7
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

  // 🚀 Convert to PDF
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) {
      showToast("Please select at least one image!", "warning");
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    for (let f of files) {
      const compressed = await compressImage(f.file, f.rotation, f.flipped);
      formData.append("images", compressed, f.file.name);
    }

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://127.0.0.1:8000/images-to-pdf/", true);
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
          link.setAttribute("download", "Converted.pdf");
          document.body.appendChild(link);
          link.click();
          link.remove();

          showToast("PDF generated successfully!", "success");
          setFiles([]);
          setProgress(0);
        } else {
          showToast("Error generating PDF", "error");
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        showToast("Upload failed. Please try again.", "error");
        setLoading(false);
      };

      xhr.send(formData);
    } catch {
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
        🖼️ Image → PDF Converter
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
        <FaCloudUploadAlt className={`fs-1 mb-3 ${isDark ? "text-info" : "text-primary"}`} />
        <p className="fs-5 mb-0">
          {isDragActive ? "📂 Drop your images here" : "Drag & drop your images"}
        </p>
        <small className={isDark ? "text-secondary" : "text-muted"}>
          or click to browse
        </small>
      </motion.div>

      {/* 🚀 Convert Button */}
      <div className="text-center mb-4">
        <button
          className={`btn ${isDark ? "btn-info text-white" : "btn-primary"} px-4 py-2 fw-semibold`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Converting...
            </>
          ) : (
            "Convert to PDF"
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

      {/* 🖼️ Thumbnails */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
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
                        className={`position-relative border rounded-4 overflow-hidden shadow-sm ${
                          isDark ? "bg-dark border-info" : "bg-white border-light"
                        }`}
                        style={{
                          width: "120px",
                          height: "120px",
                          ...provided.draggableProps.style,
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                        >
                          <FaTrash />
                        </button>
                        <button
                          type="button"
                          onClick={() => rotateImage(index)}
                          className={`btn btn-sm ${
                            isDark ? "btn-info" : "btn-dark"
                          } position-absolute bottom-0 start-0 m-1`}
                        >
                          <FaSyncAlt />
                        </button>
                        <button
                          type="button"
                          onClick={() => flipImage(index)}
                          className={`btn btn-sm ${
                            isDark ? "btn-info" : "btn-dark"
                          } position-absolute bottom-0 end-0 m-1`}
                        >
                          <FaExchangeAlt />
                        </button>
                        <img
                          src={URL.createObjectURL(f.file)}
                          alt={f.file.name}
                          className="w-100 h-100"
                          style={{
                            objectFit: "cover",
                            transform: `rotate(${f.rotation}deg) scaleX(${
                              f.flipped ? -1 : 1
                            })`,
                          }}
                        />
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
