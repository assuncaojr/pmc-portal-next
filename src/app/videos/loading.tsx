import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

// Skeleton para o VideoCard
function VideoCardSkeleton() {
  return (
    <div className="w-full h-120 rounded-[--radius-pmc] bg-gray-200 animate-pulse relative overflow-hidden shrink-0" />
  );
}

export default function VideosLoading() {
  return (
    <>
      <Header />
      <main className="grow bg-[#F8FAFC] py-12">
        <Container>
          {/* Skeleton do cabeçalho */}
          <div className="mb-10 text-left">
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-4" />
            <div className="h-4 w-96 bg-gray-100 rounded animate-pulse" />
          </div>
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
