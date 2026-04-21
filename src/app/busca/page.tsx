import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { PostCard } from "@/components/ui/PostCard";
import { Pagination } from "@/components/ui/Pagination";
import { searchPosts } from "@/lib/wordpress";
import { Search } from "lucide-react";
import type { Metadata } from "next";
import { generatePMCSEO } from "@/lib/seo";

interface BuscaPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: BuscaPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return generatePMCSEO({
    title: q ? `Busca por "${q}"` : "Busca",
    description: "Busque notícias, informações e serviços do Portal da Prefeitura de Caxias.",
  });
}

export default async function BuscaPage({ searchParams }: BuscaPageProps) {
  const { q, page } = await searchParams;
  const currentPage = Math.max(1, Number(page || 1));

  const result = q
    ? await searchPosts(q, currentPage, 12)
    : { posts: [], totalPages: 0, total: 0 };

  const { posts, totalPages, total } = result;

  return (
    <>
      <Header />
      <main className="grow bg-[#F8FAFC] py-12">
        <Container>
          {/* Cabeçalho de resultados */}
          <div className="mb-10">
            <Heading level={1} variant="page" className="mb-4">
              {q ? `Resultados para "${q}"` : "Buscar no Portal"}
            </Heading>
            {q && (
              <p className="text-gray-500 text-sm">
                {total} {total === 1 ? "resultado encontrado" : "resultados encontrados"}
              </p>
            )}
          </div>

          {/* Grid de resultados */}
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    title={post.title.rendered}
                    slug={post.slug}
                    date={post.date}
                    image={post._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
                  />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
              <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">
                {q
                  ? `Nenhum resultado encontrado para "${q}".`
                  : "Digite um termo acima para buscar no portal."}
              </p>
              {q && (
                <p className="text-gray-400 text-sm mt-2">
                  Tente termos mais genéricos ou verifique a ortografia.
                </p>
              )}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
