"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
  videoType: "youtube" | "vimeo" | "native" | "iframe";
  articleUrl: string;
}

export function VideoModal({
  isOpen,
  onClose,
  title,
  videoUrl,
  videoType,
  articleUrl,
}: VideoModalProps) {
  // Bloquear scroll do body quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fechar o modal com a tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop/Overlay escuro translúcido com desfoque */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-pmc-dark/80 backdrop-blur-sm"
          />

          {/* Container do Modal com visual Cinema */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
          >
            {/* Botão Fechar flutuante */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2.5 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full transition-all cursor-pointer shadow-lg backdrop-blur-sm"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Reprodutor de Vídeo Responsivo 16:9 */}
            <div className="relative aspect-video w-full bg-black">
              {videoType === "youtube" || videoType === "vimeo" || videoType === "iframe" ? (
                <iframe
                  src={videoUrl}
                  title={title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : videoType === "native" ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full object-contain"
                />
              ) : null}
            </div>

            {/* Seção de Informações e Botão de Ação */}
            <div className="p-6 md:p-8 bg-linear-to-b from-slate-900 to-slate-950 text-white border-t border-white/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-pmc-warning bg-pmc-warning/10 rounded-full mb-3 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-pmc-warning" />
                    Assistindo
                  </span>
                  <h3
                    className="text-lg md:text-xl font-bold leading-snug tracking-tight text-white line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: title }}
                  />
                </div>

                <a
                  href={articleUrl}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-pmc-primary hover:bg-pmc-primary/95 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                >
                  <span>Confira a matéria completa</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
