"use client";

import { useState } from "react";
import { WordPressPost } from "@/lib/wordpress";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { VideoCard } from "@/components/ui/VideoCard";
import { Pagination } from "@/components/ui/Pagination";
import { extractVideoFromContent } from "@/lib/video";
import { VideoModal } from "@/components/ui/VideoModal";
import { Film } from "lucide-react";

interface VideoArchiveClientProps {
  posts: WordPressPost[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export function VideoArchiveClient({
  posts,
  totalPages,
  currentPage,
}: VideoArchiveClientProps) {
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    videoUrl: string;
    videoType: "youtube" | "vimeo" | "native" | "iframe";
    articleUrl: string;
  } | null>(null);

  return (
    <Container>
      {/* Cabeçalho */}
      <div className="mb-10 text-left">
        <Heading level={1} variant="page" className="mb-4">
          Vídeos
        </Heading>
      </div>

      {/* Grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => {
              let articleUrl = `/noticias/${post.slug}`;
              if (post.date) {
                const d = new Date(post.date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0");
                articleUrl = `/${year}/${month}/${post.slug}`;
              }

              const videoInfo = extractVideoFromContent(post.content.rendered);

              return (
                <div key={post.id} className="flex justify-center w-full">
                  <VideoCard
                    title={post.title.rendered}
                    slug={post.slug}
                    date={post.date}
                    image={
                      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""
                    }
                    orientation="vertical"
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
                </div>
              );
            })}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        /* Estado vazio */
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Film className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium mb-4">
            Nenhum vídeo encontrado no momento.
          </p>
        </div>
      )}

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
    </Container>
  );
}
