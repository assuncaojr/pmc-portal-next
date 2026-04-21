"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TriangleAlert, RefreshCw, Home } from "lucide-react";

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
      {/* Static minimal header — cannot use async Server Component Header here */}
      <header className="w-full bg-white border-b border-gray-100 py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <Link href="/" className="font-black text-pmc-dark text-xl">
            Portal PMC
          </Link>
        </div>
      </header>

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
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-pmc-primary text-white font-bold rounded-xl hover:bg-pmc-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar novamente
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-pmc-primary text-pmc-primary font-bold rounded-xl hover:bg-pmc-primary/5 transition-colors"
              >
                <Home className="w-4 h-4" />
                Ir para a home
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
