import { getPostBySlug, getPageBySlug } from "@/lib/wordpress";
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
import { Badge } from "@/components/ui/Badge";
import { ShareButtons } from "@/components/ui/ShareButtons";

interface CatchAllProps {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export async function generateMetadata({
  params,
}: CatchAllProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return generatePMCSEO({ title: "Não Encontrado" });
  }

  // 1. Metadata for Post (year/month/slug)
  if (slug.length === 3) {
    const postSlug = slug[2];
    const post = await getPostBySlug(decodeURIComponent(postSlug));
    if (!post) return generatePMCSEO({ title: "Não Encontrado" });
    return generatePMCSEO({
      title: post.title.rendered,
      description: post.excerpt?.rendered ? post.excerpt.rendered.replace(/<[^>]*>?/gm, "") : "",
      image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    });
  }

  // 2. Metadata for Page (slug)
  if (slug.length === 1) {
    const pageSlug = slug[0];
    const page = await getPageBySlug(decodeURIComponent(pageSlug));
    if (!page) return generatePMCSEO({ title: "Não Encontrado" });
    return generatePMCSEO({
      title: page.title.rendered,
      description: page.excerpt?.rendered ? page.excerpt.rendered.replace(/<[^>]*>?/gm, "") : "",
      image: page._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    });
  }

  return generatePMCSEO({ title: "Não Encontrado" });
}

export default async function CatchAllPage({ params, searchParams }: CatchAllProps) {
  const { slug } = await params;
  const sParams = await searchParams;

  if (!slug || slug.length === 0) {
    notFound();
  }

  // 1. Render Post Page if length is 3 (year/month/slug)
  if (slug.length === 3) {
    const postSlug = slug[2];
    const post = await getPostBySlug(decodeURIComponent(postSlug));
    if (!post) notFound();

    const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

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

            {/* Sharing Section */}
            <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 text-pmc-primary font-black uppercase tracking-widest text-sm mb-6">
                <Share2 className="w-4 h-4" />
                <span>Compartilhe</span>
              </div>

              <ShareButtons title={post.title.rendered} />
            </div>
          </Container>
        </main>

        <Footer />
      </>
    );
  }

  // 2. Render Page if length is 1 (slug)
  if (slug.length === 1) {
    const pageSlug = slug[0];
    
    // Build query string from searchParams to support WordPress inner query loop pagination
    const queryString = sParams && Object.keys(sParams).length > 0
      ? "?" + Object.entries(sParams)
          .map(([key, val]) => `${key}=${encodeURIComponent(String(val))}`)
          .join("&")
      : "";

    const page = await getPageBySlug(decodeURIComponent(pageSlug), queryString);
    if (!page) notFound();

    return (
      <>
        <Header />

        <main className="grow bg-white pb-20">
          {/* Page Header Section */}
          <div className="bg-[#F8FAFC] py-12 mb-10 border-b border-gray-100">
            <Container size="narrow">
              <Heading
                level={1}
                variant="title"
                className="mb-2"
                dangerouslySetInnerHTML={{ __html: page.title.rendered }}
              />
              <div className="h-1 w-20 bg-pmc-warning mt-4 rounded-full"></div>
            </Container>
          </div>

          {/* Page Body */}
          <Container size="narrow">
            <article className="prose prose-lg md:prose-xl max-w-none prose-headings:text-pmc-dark prose-headings:font-black prose-a:text-pmc-primary prose-img:rounded-2xl">
              <BlockRenderer content={page.content.rendered} />
            </article>

            {/* Sharing Section */}
            <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 text-pmc-primary font-black uppercase tracking-widest text-sm mb-6">
                <Share2 className="w-4 h-4" />
                <span>Compartilhe esta página</span>
              </div>

              <ShareButtons title={page.title.rendered} />
            </div>
          </Container>
        </main>

        <Footer />
      </>
    );
  }

  // 3. Fallback for other lengths
  notFound();
}
