"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { TriangleAlert, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Portal PMC] Runtime error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="grow bg-[#F8FAFC] flex items-center py-20">
        <Container size="narrow">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <TriangleAlert className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-black text-pmc-dark mb-3">
              Algo deu errado
            </h1>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Ocorreu um erro ao carregar esta página. Tente novamente — se o problema persistir, acesse a home.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-pmc-primary text-white font-bold rounded-xl hover:bg-pmc-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
