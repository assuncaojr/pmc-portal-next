import { getPostBySlug } from "@/lib/wordpress";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { generatePMCSEO } from "@/lib/seo";
import { Calendar, User, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return generatePMCSEO({ title: "Não Encontrado" });

  return generatePMCSEO({
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>?/gm, ""),
    image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Header />
      
      <main className="flex-grow bg-white">
        {/* News Header */}
        <div className="bg-pmc-light py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link 
              href="/noticias" 
              className="inline-flex items-center space-x-2 text-pmc-primary font-bold mb-8 hover:space-x-4 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Voltar para Notícias</span>
            </Link>

            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black text-pmc-dark leading-tight mb-8"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            <div className="flex flex-wrap items-center gap-6 text-gray-500 font-medium border-t border-gray-200 pt-8">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-pmc-primary" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-pmc-primary" />
                <span>Portal PMC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {featuredImage && (
          <div className="container mx-auto px-4 -mt-10 md:-mt-16 mb-16 max-w-5xl">
            <div className="aspect-video relative overflow-hidden rounded-3xl shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={featuredImage} 
                alt={post.title.rendered}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <article className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <BlockRenderer content={post.content.rendered} />
          </div>

          {/* Social Share POC */}
          <div className="mt-20 py-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-xl font-bold text-pmc-dark uppercase tracking-wide">Compartilhe esta notícia</div>
            <div className="flex space-x-4">
              <button className="px-6 py-3 bg-[#1877F2] text-white rounded-full font-bold hover:opacity-90 transition-opacity">Facebook</button>
              <button className="px-6 py-3 bg-[#25D366] text-white rounded-full font-bold hover:opacity-90 transition-opacity">WhatsApp</button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
