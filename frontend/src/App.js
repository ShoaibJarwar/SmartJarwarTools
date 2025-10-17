import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

const PdfToDocx = lazy(() => import("./components/PdfToDocx"));
const DocxToPdf = lazy(() => import("./components/DocxToPdf"));
const ImageToPdf = lazy(() => import("./components/ImageToPdf"));
const PdfMerger = lazy(() => import("./components/PdfMerger"));
const SmartCompressor = lazy(() => import("./components/SmartCompressor"));
const PdfSplitter = lazy(() => import("./components/PdfSplitter"));
const ImageFormatConverter = lazy(() => import("./components/ImageFormatConverter"));
const ImageWatermark = lazy(() => import("./components/ImageWatermark"));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-gray-200 transition-colors duration-500">
        <Navbar />
        <main className="container mx-auto px-4 py-auto">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-[70vh] text-gray-400 animate-pulse">
                Loading SmartJarwarTools...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/images-to-pdf" element={<ImageToPdf />} />
              <Route path="/docx-to-pdf" element={<DocxToPdf />} />
              <Route path="/pdf-to-docx" element={<PdfToDocx />} />
              <Route path="/merge-pdf" element={<PdfMerger />} />
              <Route path="/compress-file" element={<SmartCompressor />} />
              <Route path="/pdf-to-images" element={<PdfSplitter />} />
              <Route path="/image-format-converter" element={<ImageFormatConverter />} />
              <Route path="/watermark" element={<ImageWatermark />} />
              <Route
                path="*"
                element={
                  <div className="text-center text-gray-400 mt-20 text-lg">
                    ⚠️ Page Not Found
                  </div>
                }
              />
            </Routes>
          </Suspense>
        </main>
        <Footer /> 
      </div>
    </Router>
  );
}
