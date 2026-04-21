import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="grow bg-[#F8FAFC] flex items-center py-20">
        <Container size="narrow">
          <div className="text-center">
            {/* Código visual */}
            <div className="relative inline-block mb-8">
              <span className="text-[120px] md:text-[160px] font-black text-pmc-primary/5 select-none leading-none">
                404
              </span>
              <p className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-black text-pmc-primary">
                Página não encontrada
              </p>
            </div>

            <p className="text-gray-500 text-lg max-w-md mx-auto mb-10">
              O conteúdo que você procura não existe ou foi movido para outro endereço.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-pmc-primary text-white font-bold rounded-xl hover:bg-pmc-primary/90 transition-colors"
              >
                <Home className="w-4 h-4" />
                Voltar ao início
              </Link>
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pmc-primary font-bold border-2 border-pmc-primary rounded-xl hover:bg-pmc-primary/5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Ver notícias
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
