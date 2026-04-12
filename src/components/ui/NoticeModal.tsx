"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { PMCLink } from "@/lib/links";

interface NoticeModalProps {
  notices: PMCLink[];
}

export function NoticeModal({ notices }: NoticeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<PMCLink | null>(null);

  useEffect(() => {
    if (notices.length > 0) {
      // Pequeno delay para não assustar o usuário logo no primeiro frame
      const timer = setTimeout(() => {
        setCurrentNotice(notices[0]);
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [notices]);

  if (!currentNotice) return null;

  const featuredImage = currentNotice._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-pmc-dark/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white md:text-pmc-dark md:bg-gray-100 md:hover:bg-gray-200 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content Wrapper */}
            <div className="flex flex-col">
              {/* Top Image if exists */}
              {featuredImage && (
                <div className="aspect-video relative overflow-hidden bg-pmc-primary/10">
                  <img
                    src={featuredImage}
                    alt={currentNotice.title.rendered}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Text Area */}
              <div className="p-8 md:p-12">
                <div className="flex items-center space-x-2 text-pmc-primary font-bold uppercase tracking-widest text-xs mb-4">
                  <div className="w-2 h-2 bg-pmc-primary rounded-full animate-pulse" />
                  <span>Aviso Importante</span>
                </div>
                
                <h2 
                  className="text-2xl md:text-4xl font-black text-pmc-dark mb-6 leading-tight"
                  dangerouslySetInnerHTML={{ __html: currentNotice.title.rendered }}
                />
                
                <div 
                  className="text-gray-600 space-y-4 mb-8 text-lg"
                  dangerouslySetInnerHTML={{ __html: currentNotice.content.rendered }}
                />

                {currentNotice.link_url && (
                  <a
                    href={currentNotice.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-3 w-full md:w-auto px-8 py-4 bg-pmc-primary text-white font-bold rounded-2xl hover:bg-pmc-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20"
                  >
                    <span>Saiba mais</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
