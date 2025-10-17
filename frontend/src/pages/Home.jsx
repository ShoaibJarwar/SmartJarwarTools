import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaCompressAlt,
  FaLayerGroup,
  FaWater,
} from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";

export default function Home() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const tools = [
    {
      title: "Image to PDF",
      desc: "Convert JPG, PNG, and other images into high-quality PDFs instantly.",
      icon: (
        <FaFileImage
          size={36}
          className={`me-2 ${isDark ? "text-danger" : "text-danger"}`}
        />
      ),
      path: "/images-to-pdf",
      color: "border-danger",
    },
    {
      title: "Docx to PDF",
      desc: "Turn DOC and DOCX files into easy-to-share PDF documents.",
      icon: (
        <FaFileWord
          size={36}
          className={`me-2 ${isDark ? "text-primary" : "text-primary"}`}
        />
      ),
      path: "/docx-to-pdf",
      color: "border-primary",
    },
    {
      title: "PDF to Docx",
      desc: "Easily convert your PDF files into editable Word documents.",
      icon: (
        <FaFilePdf
          size={36}
          className={`me-2 ${isDark ? "text-warning" : "text-warning"}`}
        />
      ),
      path: "/pdf-to-docx",
      color: "border-warning",
    },
    {
      title: "Merge PDF",
      desc: "Combine multiple PDF files into one organized document.",
      icon: (
        <FaLayerGroup
          size={36}
          className={`me-2 ${isDark ? "text-success" : "text-success"}`}
        />
      ),
      path: "/merge-pdf",
      color: "border-success",
    },
    {
      title: "Smart Compressor",
      desc: "Reduce file size while maintaining excellent quality.",
      icon: (
        <FaCompressAlt
          size={36}
          className={`me-2 ${isDark ? "text-info" : "text-info"}`}
        />
      ),
      path: "/compress-file",
      color: "border-info",
    },
    {
      title: "PDF Splitter",
      desc: "Split your PDF into individual images for easy download.",
      icon: (
        <FaFilePdf
          size={36}
          className={`me-2 ${isDark ? "text-info" : "text-primary"}`}
        />
      ),
      path: "/pdf-to-images", 
      color: "border-primary",
    },
    {
      title: "Image Format Converter",
      desc: "Convert format of any image format to other.",
      icon: (
        <FaFileImage
          size={36}
          className={`me-2 ${isDark ? "text-info" : "text-primary"}`}
        />
      ),
      path: "/image-format-converter", 
      color: "border-primary",
    },
    {
      title: "Image Watermark",
      desc: "Add watermark to your Image in a single click.",
      icon: (
        <FaWater
          size={36}
          className={`me-2 ${isDark ? "text-info" : "text-primary"}`}
        />
      ),
      path: "/watermark", 
      color: "border-primary",
    },
  ];

  return (
    <div className={`container py-5 ${isDark ? "text-light" : "text-dark"}`}>
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className={`fw-bold ${isDark ? "text-info" : "text-primary"}`}>
          All-in-One PDF & File Tools
        </h2>
        <p className={isDark ? "text-secondary" : "text-muted"}>
          Convert, Merge, and Compress your files instantly — all in one place.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="row g-4">
        {tools.map((tool, index) => (
          <div className="col-sm-6 col-lg-4" key={index}>
            <Link to={tool.path} className="text-decoration-none">
              <div
                className={`card h-100 border-2 ${
                  tool.color
                } shadow-sm p-4 rounded-4 hover-shadow ${
                  isDark ? "bg-dark text-light" : "bg-white text-dark"
                }`}
              >
                <div className="d-flex align-items-center mb-3">
                  {tool.icon}
                  <h5 className="fw-semibold mb-0">{tool.title}</h5>
                </div>
                <p
                  className={
                    isDark
                      ? "text-secondary small mb-0"
                      : "text-muted small mb-0"
                  }
                >
                  {tool.desc}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
