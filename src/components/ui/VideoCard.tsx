"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn, shouldUnoptimizeImage } from "@/lib/utils";

interface VideoCardProps {
  title: string;
  slug: string;
  image: string;
  duration?: string;
  orientation?: "horizontal" | "vertical";
  date?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function VideoCard({
  title,
  slug,
  image,
  orientation = "vertical",
  date,
  onClick,
}: VideoCardProps) {
  // Construção da URL amigável (SEO)
  let videoHref = `/noticias/${slug}`;
  if (date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    videoHref = `/${year}/${month}/${slug}`;
  }

  // Fallback image
  const displayImage =
    image ||
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000";

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <motion.div
      layout
      transition={{
        layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-(--radius-pmc) bg-pmc-dark shadow-pmc transition-all duration-500 shrink-0 h-120 origin-left",
        orientation === "horizontal" ? "w-65 hover:w-160" : "w-65",
      )}
    >
      <Link
        href={videoHref}
        onClick={handleClick}
        className="block w-full h-full relative"
      >
        <Image
          src={displayImage}
          alt={title.replace(/<[^>]*>/g, "")}
          fill
          unoptimized={shouldUnoptimizeImage(displayImage)}
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
        />

        {/* Play Icon Overlay (always centered) */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-2xl group-hover:bg-pmc-primary group-hover:scale-110 transition-all duration-500">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 pt-24 bg-linear-to-t from-black via-black/60 to-transparent z-20">
          <h3
            className="text-white font-bold text-sm md:text-base leading-tight line-clamp-3 group-hover:text-pmc-warning transition-colors drop-shadow-md"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
