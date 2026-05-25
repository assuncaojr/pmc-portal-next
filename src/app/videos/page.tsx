import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VideoArchiveClient } from "@/components/archive/VideoArchiveClient";
import { getPostsByTagSlug } from "@/lib/wordpress";
import { generatePMCSEO } from "@/lib/seo";
import type { Metadata } from "next";

interface VideosPageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata: Metadata = generatePMCSEO({
  title: "Vídeos - Prefeitura Municipal de Caxias",
  description: "Assista aos informativos, obras e campanhas oficiais em vídeo da Prefeitura Municipal de Caxias.",
});

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, Number(resolvedParams.page || 1));

  // Buscar os posts com a tag "video" (12 por página para o grid)
  const { posts, totalPages, total } = await getPostsByTagSlug("video", page, 12);

  return (
    <>
      <Header />
      <main className="grow bg-[#F8FAFC] py-12">
        <VideoArchiveClient
          posts={posts}
          totalPages={totalPages}
          currentPage={page}
          total={total}
        />
      </main>
      <Footer />
    </>
  );
}
