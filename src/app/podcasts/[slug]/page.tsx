import { getPodcastBySlug, getPodcasts } from "@/lib/wordpress";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePMCSEO } from "@/lib/seo";
import { Calendar, ChevronLeft, Clock, Headphones } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { PlayButtonClient } from "@/components/ui/PlayButtonClient";
import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/utils";

interface PodcastPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PodcastPageProps): Promise<Metadata> {
  const { slug } = await params;
  const podcast = await getPodcastBySlug(decodeURIComponent(slug));

  if (!podcast) return generatePMCSEO({ title: "Episódio Não Encontrado" });

  return generatePMCSEO({
    title: `${podcast.title.rendered} - Podcast Interno`,
    description: podcast.excerpt.rendered.replace(/<[^>]*>?/gm, ""),
    image: podcast._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  });
}

export default async function PodcastEpisodePage({ params }: PodcastPageProps) {
  const { slug } = await params;
  const episode = await getPodcastBySlug(decodeURIComponent(slug));

  if (!episode) notFound();

  // Carrega a lista completa para passar como playlist ativa
  const { podcasts: allPodcasts } = await getPodcasts(1, 30);

  const formattedDate = new Date(episode.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const featuredImage = episode._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <>
      <Header />

      <main className="grow bg-white pb-24">
        {/* Cabecalho do Episodio */}
        <div className="bg-[#F8FAFC] py-12 mb-10 border-b border-gray-100">
          <Container size="narrow">
            <Link
              href="/podcasts"
              className="inline-flex items-center space-x-2 text-blue-600 font-bold mb-8 hover:translate-x-1 transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Voltar para Podcasts</span>
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* Cover do Episódio */}
              <div className="relative w-36 h-36 rounded-2xl bg-blue-50 border border-slate-100 overflow-hidden flex-shrink-0">
                {featuredImage ? (
                  <Image
                    src={featuredImage}
                    alt={episode.title.rendered}
                    fill
                    className="object-cover"
                    sizes="144px"
                    priority
                    unoptimized={shouldUnoptimizeImage(featuredImage)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-500 bg-blue-50">
                    <Headphones className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Título e Metadados */}
              <div className="flex-1">
                {episode.podcast_episode_number && (
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase tracking-wider mb-3">
                    Episódio {episode.podcast_episode_number}
                  </span>
                )}
                
                <Heading
                  level={1}
                  variant="title"
                  className="mb-4 text-slate-900 leading-tight"
                  dangerouslySetInnerHTML={{ __html: episode.title.rendered }}
                />

                <div className="flex flex-wrap items-center gap-4 text-gray-400 font-semibold text-xs mt-3">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{formattedDate}</span>
                  </div>
                  {episode.podcast_duration && (
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{episode.podcast_duration} de duração</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ação: Botão Play */}
            <div className="mt-8 pt-6 border-t border-slate-150">
              <PlayButtonClient episode={episode} playlist={allPodcasts} />
            </div>

          </Container>
        </div>

        {/* Corpo do Episodio */}
        <Container size="narrow">
          <article className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-a:text-blue-600 prose-img:rounded-2xl leading-relaxed text-slate-650">
            <BlockRenderer content={episode.content.rendered} />
          </article>
        </Container>
      </main>

      <Footer />
    </>
  );
}
