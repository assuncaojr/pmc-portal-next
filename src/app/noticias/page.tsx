import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { getAllPosts } from "@/lib/wordpress";
import { PostCard } from "@/components/ui/PostCard";

export default async function NoticiasPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Header />
      <main className="grow bg-[#F8FAFC] py-12">
        <Container>
          <div className="mb-10 text-left">
            <Heading level={1} variant="page" className="mb-4">
              Notícias
            </Heading>
            <p className="text-gray-600 max-w-2xl">
              Fique por dentro de tudo o que acontece em Caxias. Informações
              oficiais, obras, eventos e ações do governo municipal.
            </p>
          </div>

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

          {posts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">
                Nenhuma notícia encontrada no momento.
              </p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
