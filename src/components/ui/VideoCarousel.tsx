"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoCard } from "./VideoCard";
import { WordPressPost } from "@/lib/wordpress";
import { motion } from "framer-motion";
import { extractVideoFromContent, ExtractedVideo } from "@/lib/video";
import { VideoModal } from "./VideoModal";
import Link from "next/link";

interface VideoCarouselProps {
  posts: WordPressPost[];
  title?: string;
}

export function VideoCarousel({ posts, title = "Vídeos" }: VideoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    videoUrl: string;
    videoType: ExtractedVideo["type"];
    articleUrl: string;
  } | null>(null);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener("resize", checkArrows);
    return () => window.removeEventListener("resize", checkArrows);
  }, [posts]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-12 bg-white overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4 max-w-container">
        {/* Header with Arrows */}
        <div className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-4"
          >
            <div className="w-2 h-10 bg-pmc-primary rounded-full shadow-lg shadow-blue-500/20"></div>
            <h2 className="text-3xl md:text-4xl font-black text-pmc-dark uppercase tracking-tight">
              {title}
            </h2>
          </motion.div>

          <div className="flex items-center gap-3">
            <Link
              href="/videos"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-pmc-primary bg-pmc-primary/5 hover:bg-pmc-primary hover:text-white rounded-full transition-all border border-pmc-primary/10 hover:border-pmc-primary shadow-xs hover:shadow-md cursor-pointer mr-1"
            >
              Mais vídeos
            </Link>
            <button
              onClick={() => scroll("left")}
              className={`p-3 rounded-full border border-gray-200 transition-all ${
                !showLeftArrow
                  ? "opacity-30 bg-gray-50 text-gray-400"
                  : "cursor-pointer bg-white text-pmc-dark hover:bg-pmc-primary hover:text-white hover:border-pmc-primary shadow-sm"
              }`}
              disabled={!showLeftArrow}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className={`p-3 rounded-full border border-gray-200 transition-all ${
                !showRightArrow
                  ? "opacity-30 bg-gray-50 text-gray-400"
                  : "cursor-pointer bg-white text-pmc-dark hover:bg-pmc-primary hover:text-white hover:border-pmc-primary shadow-sm"
              }`}
              disabled={!showRightArrow}
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          onScroll={checkArrows}
          className="flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {posts.map((post, index) => {
            // Lógica para detectar orientação baseada em tags
            const tags = post._embedded?.["wp:term"]?.[1] || [];
            const isHorizontal = tags.some(
              (t: any) =>
                t.slug === "horizontal" ||
                t.name.toLowerCase() === "horizontal",
            );

            let articleUrl = `/noticias/${post.slug}`;
            if (post.date) {
              const d = new Date(post.date);
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, "0");
              articleUrl = `/${year}/${month}/${post.slug}`;
            }

            const videoInfo = extractVideoFromContent(post.content.rendered);

            return (
              <motion.div
                key={post.id}
                className="snap-start"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <VideoCard
                  title={post.title.rendered}
                  slug={post.slug}
                  date={post.date}
                  image={
                    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""
                  }
                  orientation={isHorizontal ? "horizontal" : "vertical"}
                  onClick={
                    videoInfo
                      ? () =>
                          setActiveVideo({
                            title: post.title.rendered,
                            videoUrl: videoInfo.src,
                            videoType: videoInfo.type,
                            articleUrl,
                          })
                      : undefined
                  }
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {activeVideo && (
        <VideoModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          title={activeVideo.title}
          videoUrl={activeVideo.videoUrl}
          videoType={activeVideo.videoType}
          articleUrl={activeVideo.articleUrl}
        />
      )}
    </section>
  );
}
