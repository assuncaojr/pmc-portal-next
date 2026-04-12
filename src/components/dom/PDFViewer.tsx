"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  Maximize,
} from "lucide-react";

// Configure worker safely
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface PDFViewerProps {
  fileUrl: string;
}

export function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 rounded-3xl overflow-hidden shadow-inner border border-gray-200">
      {/* Control Bar */}
      <div className="w-full bg-pmc-dark text-white p-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prev) => prev - 1)}
            className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm">
            Página {pageNumber} de {numPages}
          </span>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((prev) => prev + 1)}
            className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="w-full h-[800px] overflow-auto flex justify-center p-8 bg-gray-200/50">
        <div className="shadow-2xl">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                <div className="w-12 h-12 border-4 border-pmc-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-pmc-dark font-bold animate-pulse">
                  Carregando Diário Oficial...
                </p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderAnnotationLayer={false}
              renderTextLayer={true}
              className="rounded shadow-lg"
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
