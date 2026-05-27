"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Share2, Check } from "lucide-react";

interface ShareIconButtonProps {
  title: string;
  url?: string;
  className?: string;
}

export function ShareIconButton({ title, url: customUrl, className }: ShareIconButtonProps) {
  const [url, setUrl] = useState(customUrl || "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!customUrl && typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, [customUrl]);

  const handleShare = async () => {
    // If Web Share API is available (e.g. mobile Safari/Chrome), use it!
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: title.replace(/<[^>]*>?/gm, ""),
          url: url,
        });
        return;
      } catch (err) {
        // If user cancelled, don't fallback to clipboard copy
        if ((err as Error).name === "AbortError") {
          return;
        }
        console.warn("navigator.share failed, falling back to copy:", err);
      }
    }

    // Fallback: Copy link to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleShare}
        className={`bg-gray-150 text-gray-700 hover:bg-gray-200 transition-all duration-200 cursor-pointer ${
          copied ? "bg-green-100 text-green-700 hover:bg-green-150" : ""
        } ${className}`}
        aria-label="Compartilhar"
        title={copied ? "Link Copiado!" : "Compartilhar"}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600 animate-scaleIn" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
      </Button>

      {/* Elegant tooltip feedback */}
      {copied && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-gray-900 text-white text-[11px] font-bold rounded-lg shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-150">
          Link Copiado!
        </span>
      )}
    </div>
  );
}
