import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

// Skeleton para um PostCard
function PostCardSkeleton() {
  return (
    <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
  );
}

export default function NoticiasLoading() {
  return (
    <>
      <Header />
      <main className="grow bg-[#F8FAFC] py-12">
        <Container>
          {/* Skeleton do cabeçalho */}
          <div className="mb-10">
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-4" />
            <div className="h-4 w-80 bg-gray-100 rounded animate-pulse" />
          </div>
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
