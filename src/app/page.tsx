import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InstagramFeed } from "@/components/ui/InstagramFeed";
import Link from "next/link";
import {
  ArrowRight,
  FileCheck,
  Calculator,
  Users,
  Landmark,
  BookOpen,
  FileText,
  Gavel,
  ShieldCheck,
  ScrollText,
  BadgeInfo,
} from "lucide-react";
import { cn, shouldUnoptimizeImage } from "@/lib/utils";
import { getAllPosts, getPostsByTagSlug } from "@/lib/wordpress";
import Image from "next/image";
import { PostCard } from "@/components/ui/PostCard";
import { VideoCarousel } from "@/components/ui/VideoCarousel";
import { PodcastBanner } from "@/components/ui/PodcastBanner";

export default async function Home() {
  const { posts: allPosts } = await getAllPosts(1, 13);
  const { posts: videoPosts } = await getPostsByTagSlug("video", 1, 10);

  // Pegamos o primeiro post para o destaque e os próximos 4 para o grid lateral
  const featuredPost = allPosts[0];
  const sidebarPosts = allPosts?.slice(1, 5);
  const latestNews = allPosts?.slice(5);

  return (
    <>
      <Header />

      <main className="grow bg-[#F8FAFC]">
        {/* Modern Hero Grid Section */}
        <section className="py-12 md:py-20 px-4">
          <div className="container mx-auto max-w-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Feature Post (Main) */}
              <div className="lg:col-span-7 group">
                {featuredPost ? (
                  (() => {
                    const d = new Date(featuredPost.date);
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const newsHref = `/${year}/${month}/${featuredPost.slug}`;
                    const imageUrl =
                      featuredPost._embedded?.["wp:featuredmedia"]?.[0]
                        ?.source_url ||
                      "https://placehold.co/800x600/e2e8f0/475569?text=Sem+Imagem";
                    const tag =
                      featuredPost._embedded?.["wp:term"]?.[0]?.[0]?.name ||
                      "Governo";

                    return (
                      <Link
                        href={newsHref}
                        className="block h-full bg-white rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={featuredPost.title.rendered}
                            fill
                            priority
                            unoptimized={shouldUnoptimizeImage(imageUrl)}
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-6 md:p-8">
                          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase tracking-widest mb-3">
                            {tag}
                          </span>
                          <h2
                            className="text-2xl md:text-3xl font-black text-pmc-dark leading-tight group-hover:text-pmc-primary transition-colors line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: featuredPost.title.rendered,
                            }}
                          />
                        </div>
                      </Link>
                    );
                  })()
                ) : (
                  <div className="lg:h-full bg-gray-200 rounded-4xl animate-pulse" />
                )}
              </div>

              {/* Sidebar Post Grid (2x2) */}
              <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                {sidebarPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    title={post.title.rendered}
                    slug={post.slug}
                    date={post.date}
                    image={
                      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
                    }
                    tag={post._embedded?.["wp:term"]?.[0]?.[0]?.name}
                  />
                ))}

                {/* Fallback if less than 5 posts */}
                {sidebarPosts.length < 4 &&
                  Array.from({ length: 4 - sidebarPosts.length }).map(
                    (_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="aspect-16/10 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-xs font-medium border border-dashed border-gray-300"
                      >
                        Espaço reservado
                      </div>
                    ),
                  )}
              </div>
            </div>
          </div>
        </section>

        <InstagramFeed />

        {/* Últimas Notícias & Sidebar */}
        <section className="py-12 md:py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Últimas Notícias (Left - 8 columns) */}
              <div className="lg:col-span-8">
                <div className="flex items-center space-x-3 mb-10">
                  <div className="w-1.5 h-8 bg-pmc-primary rounded-full"></div>
                  <h2 className="text-3xl font-black text-pmc-dark uppercase tracking-tight">
                    Últimas Notícias
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {latestNews.map((post) => {
                    const category =
                      post._embedded?.["wp:term"]?.[0]?.[0]?.name || "Notícia";
                    const imageUrl =
                      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                      "https://placehold.co/400x300?text=Sem+Imagem";

                    const d = new Date(post.date);
                    const formattedDate = d.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    });

                    // URL amigável
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const newsHref = `/${year}/${month}/${post.slug}`;

                    return (
                      <Link
                        key={post.id}
                        href={newsHref}
                        className="flex flex-col md:flex-row gap-6 py-8 group transition-all"
                      >
                        <div className="w-full md:w-64 h-44 shrink-0 relative overflow-hidden rounded-2xl shadow-md">
                          <Image
                            src={imageUrl}
                            alt={post.title.rendered}
                            fill
                            unoptimized={shouldUnoptimizeImage(imageUrl)}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="inline-block self-start px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase tracking-wider mb-3">
                            {category}
                          </span>
                          <h3
                            className="text-xl md:text-2xl font-black text-pmc-dark leading-tight group-hover:text-pmc-primary transition-colors mb-3 line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html: post.title.rendered,
                            }}
                          />
                          <p className="text-sm text-gray-500 font-medium">
                            {formattedDate}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-12 text-center">
                  <Link
                    href="/noticias"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 hover:bg-gray-200 text-pmc-dark font-bold rounded-2xl transition-all"
                  >
                    <span>Ver todas as notícias</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Sidebar (Right - 4 columns) */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sticky top-24">
                  {/* Banner do Podcast Interno */}
                  <div className="mb-12">
                    <PodcastBanner />
                  </div>

                  <div className="h-px bg-gray-100 my-8"></div>

                  {/* Acesso Rápido */}
                  <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-8">
                      <div className="w-1.5 h-6 bg-pmc-primary rounded-full"></div>
                      <h2 className="text-xl font-black text-pmc-dark uppercase tracking-tight">
                        Acesso Rápido
                      </h2>
                    </div>

                    <div className="space-y-1">
                      <QuickLink
                        icon={<FileCheck className="w-5 h-5" />}
                        label="Edital Concurso Público 2025"
                        href="/editais-concurso-2025"
                      />
                      <QuickLink
                        icon={<Calculator className="w-5 h-5" />}
                        label="Sistema Tributário Municipal"
                        href="https://sefaz.caxias.ma.gov.br/"
                      />
                      <QuickLink
                        icon={<ShieldCheck className="w-5 h-5" />}
                        label="Portal da Transparência"
                        href="https://transparencia.caxias.ma.gov.br/"
                      />
                      <QuickLink
                        icon={<Landmark className="w-5 h-5" />}
                        label="Diário Oficial (DOM)"
                        href="/dom"
                      />
                      <QuickLink
                        icon={<Users className="w-5 h-5" />}
                        label="Portal do Servidor"
                        href="/servidores"
                      />
                      <QuickLink
                        icon={<FileText className="w-5 h-5" />}
                        label="Contracheque Online"
                        href="/contracheque"
                      />
                      <QuickLink
                        icon={<Gavel className="w-5 h-5" />}
                        label="Licitações e Contratos"
                        href="/licitacoes"
                      />
                      <QuickLink
                        icon={<BadgeInfo className="w-5 h-5" />}
                        label="E-Sic / Ouvidoria"
                        href="/e-sic"
                      />
                      <QuickLink
                        icon={<ScrollText className="w-5 h-5" />}
                        label="NFS-e (Nota Fiscal)"
                        href="https://nfe.caxias.ma.gov.br/"
                      />
                      <QuickLink
                        icon={<Landmark className="w-5 h-5" />}
                        label="Precatórios do FUNDEF"
                        href="/fundef"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 my-8"></div>

                  {/* Leis e Códigos */}
                  <div>
                    <h3 className="text-xl font-black text-pmc-dark mb-8 uppercase tracking-tight flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-pmc-primary" />
                      <span>Leis e Códigos</span>
                    </h3>
                    <ul className="space-y-4 mb-10">
                      <LawLink label="Conselho Tutelar" />
                      <LawLink label="Lei 2.156/2014 - Concursos" highlight />
                      <LawLink label="Lei 2.113/2013 - Controle de Animais" />
                      <LawLink label="Código Tributário (download)" />
                      <LawLink label="Código de Postura (download)" />
                      <LawLink label="Código de Meio-ambiente (download)" />
                      <LawLink label="Plano Diretor (download)" />
                    </ul>

                    <Link
                      href="/legislacao"
                      className="w-full py-4 bg-pmc-primary text-white text-center font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-pmc-primary/90 transition-all shadow-lg shadow-blue-900/20"
                    >
                      <span>Ver toda legislação</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {videoPosts.length > 0 && <VideoCarousel posts={videoPosts} />}
      </main>

      <Footer />
    </>
  );
}

function QuickLink({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 py-3 group hover:translate-x-1 transition-transform border-b border-gray-50 last:border-0"
    >
      <div className="text-blue-600 bg-blue-50 p-2 rounded-lg group-hover:bg-pmc-primary group-hover:text-white transition-all">
        {icon}
      </div>
      <span className="text-sm font-bold text-gray-700 group-hover:text-pmc-primary transition-colors">
        {label}
      </span>
    </Link>
  );
}

function LawLink({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <li>
      <Link
        href="#"
        className={cn(
          "text-sm font-medium hover:text-pmc-primary transition-colors flex items-center gap-2 group",
          highlight
            ? "text-pmc-primary font-bold decoration-pmc-primary/30"
            : "text-gray-600",
        )}
      >
        <div className="w-1.5 h-1.5 bg-pmc-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className={cn(highlight && "underline underline-offset-4")}>
          {label}
        </span>
      </Link>
    </li>
  );
}
