import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PostArchive } from "@/components/archive/PostArchive";

interface NoticiasPageProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export default async function NoticiasPage({ searchParams }: NoticiasPageProps) {
  const resolvedParams = await searchParams;

  return (
    <>
      <Header />
      <main className="grow bg-[#F8FAFC] py-12">
        <PostArchive
          basePath="noticias"
          title="Notícias"
          description="Fique por dentro de tudo o que acontece em Caxias. Informações oficiais, obras, eventos e ações do governo municipal."
          searchParams={resolvedParams}
        />
      </main>
      <Footer />
    </>
  );
}
