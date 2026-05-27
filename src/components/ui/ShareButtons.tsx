"use client";

import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
  className?: string;
}

// Custom brand SVG components for maximum pixel-perfection
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function ShareButtons({ title, url: customUrl, className }: ShareButtonsProps) {
  const [url, setUrl] = useState(customUrl || "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!customUrl && typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, [customUrl]);

  const handleShare = async (platform: "facebook" | "whatsapp" | "twitter" | "copy") => {
    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link: ", err);
      }
      return;
    }

    let shareUrl = "";
    // Clean string by removing tags and HTML entities
    const cleanTitle = title.replace(/<[^>]*>?/gm, "");

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(cleanTitle + "\n" + url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(cleanTitle)}&url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap justify-center items-center gap-3">
        <Button
          onClick={() => handleShare("facebook")}
          className="bg-[#1877F2] text-white hover:bg-[#1877F2]/90 rounded-full px-6 py-2.5 text-sm font-bold flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
        >
          <FacebookIcon className="w-5 h-5 shrink-0" />
          <span>Facebook</span>
        </Button>

        <Button
          onClick={() => handleShare("whatsapp")}
          className="bg-[#25D366] text-white hover:bg-[#25D366]/90 rounded-full px-6 py-2.5 text-sm font-bold flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
        >
          <WhatsAppIcon className="w-5 h-5 shrink-0" />
          <span>WhatsApp</span>
        </Button>

        <Button
          onClick={() => handleShare("twitter")}
          className="bg-black text-white hover:bg-black/90 rounded-full px-6 py-2.5 text-sm font-bold flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer hover:shadow-lg transition-all duration-200"
        >
          <XIcon className="w-4 h-4 shrink-0" />
          <span>Compartilhar</span>
        </Button>

        <button
          onClick={() => handleShare("copy")}
          className={`inline-flex items-center justify-center transition-all active:scale-95 rounded-full px-6 py-2.5 text-sm font-bold gap-2 hover:-translate-y-0.5 shadow-sm duration-200 cursor-pointer ${
            copied
              ? "bg-[#33CC33] border border-[#33CC33] text-white hover:bg-[#33CC33]/90 hover:shadow-md"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white animate-scaleIn shrink-0" />
              <span>Link Copiado!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 text-gray-500 shrink-0" />
              <span>Copiar Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
