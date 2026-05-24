import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PodcastList } from "@/components/ui/PodcastList";
import { Pagination } from "@/components/ui/Pagination";
import { getPodcasts } from "@/lib/wordpress";
import type { Metadata } from "next";
import { generatePMCSEO } from "@/lib/seo";

export const metadata: Metadata = generatePMCSEO({
  title: "Podcast Interno - Prefeitura de Caxias",
  description: "Ouça os episódios sobre as ações, projetos e novidades da Prefeitura de Caxias de forma contínua e interativa.",
});

interface PodcastsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function PodcastsPage({ searchParams }: PodcastsPageProps) {
  // Parse dynamic page from URL params
  const { page } = await searchParams;
  const currentPage = Number(page || "1");
  const perPage = 10; // 10 episódios por página

  // Buscamos os episódios de podcast cadastrados no WordPress CPT
  const { podcasts, totalPages } = await getPodcasts(currentPage, perPage);

  return (
    <>
      <Header />

      <main className="grow bg-[#F8FAFC]">
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-container">
            <PodcastList podcasts={podcasts} />
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
