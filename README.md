<!-- ========================================================= -->
<!-- SMARTJARWARTOOLS - README FILE -->
<!-- Author: Shoaib Akhter -->
<!-- ========================================================= -->

<div align="center">

# ⚙️ SmartJarwarTools

### 🧠 A Modern Full-Stack Web Tools Suite — Smart, Fast, and Elegant

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Bootstrap](https://img.shields.io/badge/Bootstrap-6f42c1?style=for-the-badge&logo=bootstrap&logoColor=white)
![Django REST](https://img.shields.io/badge/Django%20REST-092E20?style=for-the-badge&logo=django&logoColor=white)
![Framer Motion](https://img.shields.io/badge/FramerMotion-121212?style=for-the-badge&logo=framer&logoColor=E91E63)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

---

## 🧰 Overview

**SmartJarwarTools** is a full-stack web application offering a variety of smart file utilities — compress, merge, convert, and watermark your files seamlessly.  

It combines a modern **React + Bootstrap** frontend with a powerful **Django REST Framework** backend for processing, storage, and API management.  

> 💡 The goal: A single, fast, and beautiful hub for everyday file operations.

---

## 🌐 Live Demo

🔗 **Live Website:** [https://your-live-site-link.com](https://your-live-site-link.com)  
📡 **Backend API:** [https://your-api-endpoint.com/api/](https://your-api-endpoint.com/api/)

---

## ⚙️ Tech Stack

| Layer | Technologies |
|--------|---------------|
| **Frontend** | React, React Router, Bootstrap 5, Framer Motion |
| **Backend** | Django, Django REST Framework |
| **HTTP / API** | Axios, Fetch |
| **Database** | SQLite / PostgreSQL |
| **File Handling** | Django File Uploads + DRF Serializers |
| **State Management** | React Context API (for Theme + App state) |
| **Icons** | React Icons (Font Awesome) |
| **Deployment** | Vercel (Frontend) + Render / Railway / DigitalOcean (Backend) |

---

## 🚦 Project Routes (Frontend)

| Route | Component | Description |
|-------|------------|-------------|
| `/` | `Home.jsx` | Landing page introducing all tools |
| `/about` | `About.jsx` | About section with project overview |
| `/contact` | `Contact.jsx` | Contact form with WhatsApp widget |
| `/images-to-pdf` | `ImageToPdf.jsx` | Convert images (JPG/PNG) into a single PDF |
| `/docx-to-pdf` | `DocxToPdf.jsx` | Convert Word documents into PDF |
| `/pdf-to-docx` | `PdfToDocx.jsx` | Convert PDFs into editable Word files |
| `/merge-pdf` | `PdfMerger.jsx` | Merge multiple PDF files into one |
| `/compress-file` | `SmartCompressor.jsx` | Compress PDF or image files |
| `/pdf-to-images` | `PdfSplitter.jsx` | Convert or split PDF pages into images |
| `/image-format-converter` | `ImageFormatConverter.jsx` | Convert images between formats (JPG, PNG, WEBP, etc.) |
| `/watermark` | `ImageWatermark.jsx` | Add text/image watermark for branding or protection |

---

## 🧩 Key Features

### 🎨 Frontend Highlights
- Fully **theme-adaptive** (Dark / Light mode)  
- Built with **Bootstrap 5** components for responsiveness  
- **Framer Motion** animations for smooth transitions  
- Beautiful **gradient backgrounds** and **neon UI effects**  
- Accessible and mobile-friendly design  
- **WhatsApp floating widget** for instant contact  

### 🖥️ Backend Highlights
- Built using **Django REST Framework (DRF)**  
- **RESTful APIs** for file conversion and management  
- **File upload & streaming** support for large files  
- **DRF Serializers** for structured data exchange  
- **CORS-enabled** for React frontend communication  
- Modular app structure for easy scalability  

---

## 🔗 Example API Endpoints (Backend)

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/api/compress/` | `POST` | Compress file (PDF/Image) |
| `/api/merge-pdf/` | `POST` | Merge multiple PDF files |
| `/api/pdf-to-images/` | `POST` | Convert PDF pages into images |
| `/api/watermark/` | `POST` | Add watermark to image |
| `/api/convert/docx-to-pdf/` | `POST` | Convert DOCX to PDF |
| `/api/convert/pdf-to-docx/` | `POST` | Convert PDF to DOCX |
| `/api/images-to-pdf/` | `POST` | Combine multiple images into a single PDF |

---

## 🖼️ Screenshots

> Replace these with actual images hosted in your GitHub repo (`/Images/` folder).

| 💡 Light Mode | 🌙 Dark Mode |
|:-------------:|:------------:|
| ![Light Mode Screenshot](https://raw.githubusercontent.com/your-username/smartjarwartools/main/screenshots/light-mode.png) | ![Dark Mode Screenshot](https://raw.githubusercontent.com/your-username/smartjarwartools/main/screenshots/dark-mode.png) |

| 🧰 Tools Dropdown | 📨 Contact Page |
|:-----------------:|:----------------:|
| ![Tools Dropdown Screenshot](https://raw.githubusercontent.com/your-username/smartjarwartools/main/screenshots/tools-dropdown.png) | ![Contact Page Screenshot](https://raw.githubusercontent.com/your-username/smartjarwartools/main/screenshots/contact-page.png) |

| ⚙️ PDF Tools | 🖼️ Image Tools |
|:-------------:|:--------------:|
| ![PDF Tools Screenshot](https://raw.githubusercontent.com/your-username/smartjarwartools/main/screenshots/pdf-tools.png) | ![Image Tools Screenshot](https://raw.githubusercontent.com/your-username/smartjarwartools/main/screenshots/image-tools.png) |

---

## 📁 Folder Structure

