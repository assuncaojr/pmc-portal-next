import { getPostBySlug } from "@/lib/wordpress";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePMCSEO } from "@/lib/seo";
import { Calendar, ChevronLeft, Share2, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface PostPageProps {
  params: Promise<{
    year: string;
    month: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));

  if (!post) return generatePMCSEO({ title: "Não Encontrado" });

  return generatePMCSEO({
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>?/gm, ""),
    image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(decodeURIComponent(slug));

  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Extrair Tags (limitando a 5)
  const allTerms = post._embedded?.["wp:term"]?.flat() || [];
  const tags = allTerms
    .filter((term) => term.taxonomy === "post_tag")
    .slice(0, 5);

  return (
    <>
      <Header />

      <main className="grow bg-white pb-20">
        {/* News Header Section */}
        <div className="bg-[#F8FAFC] py-12 mb-10 border-b border-gray-100">
          <Container size="narrow">
            <Link
              href="/noticias"
              className="inline-flex items-center space-x-2 text-pmc-primary font-bold mb-8 hover:translate-x-1 transition-transform"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Voltar para Notícias</span>
            </Link>

            <Heading
              level={1}
              variant="title"
              className="mb-8"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            <div className="flex flex-wrap items-center gap-6 text-gray-500 font-medium">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-pmc-primary" />
                <span>{formattedDate}</span>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-pmc-primary" />
                  {/* TOD: Tags linkam mais não buscam por conteúdo real na listagem de noticias */}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link key={tag.id} href={`/noticias?tag=${tag.slug}`}>
                        <Badge
                          variant="primary"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        >
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </div>

        {/* Article Body */}
        <Container size="narrow">
          <article className="prose prose-lg md:prose-xl max-w-none prose-headings:text-pmc-dark prose-headings:font-black prose-a:text-pmc-primary prose-img:rounded-2xl">
            <BlockRenderer content={post.content.rendered} />
          </article>

          {/* Sharing Section. TODO: implmentar o compartilhamento */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-pmc-primary font-black uppercase tracking-widest text-sm mb-6">
              <Share2 className="w-4 h-4" />
              <span>Compartilhe esta notícia</span>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-[#1877F2] hover:bg-[#1877F2]/90 rounded-full px-8">
                Facebook
              </Button>
              <Button className="bg-[#25D366] hover:bg-[#25D366]/90 rounded-full px-8">
                WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
