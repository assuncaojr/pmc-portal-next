"use client";

import { useState } from "react";
import { ImageLightbox } from "./ImageLightbox";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  fullSrc: string;
}

interface WordPressGalleryProps {
  images: GalleryImage[];
  columns?: number;
}

export function WordPressGallery({ images, columns = 3 }: WordPressGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  }[columns as keyof typeof gridCols] || "grid-cols-3";

  return (
    <div className="my-12">
      <div className={cn("grid gap-4", gridCols)}>
        {images.map((image, index) => (
          <figure
            key={index}
            className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer shadow-md hover:shadow-xl transition-all hover:scale-[1.02]"
            onClick={() => setLightboxIndex(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-pmc-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-3 bg-white/40 backdrop-blur-md rounded-full text-white shadow-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
            </div>
            {image.caption && (
               <figcaption className="absolute bottom-0 inset-x-0 p-4 bg-linear-to-t from-pmc-dark/80 to-transparent text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.caption}
               </figcaption>
            )}

          </figure>
        ))}
      </div>

      <ImageLightbox
        images={images.map((img) => ({
          src: img.fullSrc,
          alt: img.alt,
          caption: img.caption,
        }))}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  );
}
