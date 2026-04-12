"use client";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("./PDFViewer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center h-150 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <div className="w-12 h-12 border-4 border-pmc-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold">Preparando visualizador...</p>
      </div>
    ),
  },
);

interface DOMViewerWrapperProps {
  fileUrl: string;
}

export default function DOMViewerWrapper({ fileUrl }: DOMViewerWrapperProps) {
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(fileUrl)}`;
  return <PDFViewer fileUrl={proxyUrl} />;
}
