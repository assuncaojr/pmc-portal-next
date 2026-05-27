import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getDOMBySlug } from "@/lib/dom";
import { DOMInfo } from "@/components/dom/DOMInfo";
import DOMViewerWrapper from "@/components/dom/DOMViewerWrapper";
import { ChevronLeft, Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generatePMCSEO } from "@/lib/seo";
import type { Metadata } from "next";
import { ShareIconButton } from "@/components/ui/ShareIconButton";

interface DOMSinglePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DOMSinglePageProps): Promise<Metadata> {
  const { slug } = await params;
  const dom = await getDOMBySlug(slug);

  if (!dom) return generatePMCSEO({ title: "DOM Não Encontrado" });

  return generatePMCSEO({
    title: `DOM ${dom.title.rendered}`,
    description: `Diário Oficial do Município de Caxias - Edição ${dom.title.rendered}`,
  });
}

export default async function DOMSinglePage({ params }: DOMSinglePageProps) {
  const { slug } = await params;
  const dom = await getDOMBySlug(slug);

  if (!dom) notFound();

  const formattedDate = dom.date_dom
    ? new Date(dom.date_dom + "T00:00:00").toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  return (
    <>
      <Header />

      <main className="grow bg-white py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back Button */}
          <Link
            href="/dom"
            className="inline-flex items-center space-x-2 text-pmc-primary font-bold mb-10 hover:space-x-4 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Voltar para Listagem de Diários Oficiais</span>
          </Link>

          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-pmc-primary leading-tight">
              Edição {dom.title.rendered}, de {formattedDate}
            </h1>
            <div className="h-1 w-20 bg-pmc-warning mt-4 rounded-full"></div>
          </div>

          <div className="flex items-center gap-3 justify-end border-b border-gray-100 pb-8 mb-10">
            <a
              href={dom.file_url}
              download
              className="inline-flex items-center justify-center transition-all active:scale-95 bg-pmc-primary text-white hover:bg-pmc-primary/90 shadow-pmc hover:shadow-pmc-xl px-4 py-2 text-sm rounded-lg font-bold gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download desta Edição</span>
            </a>

            <ShareIconButton
              title={`Diário Oficial de Caxias - Edição ${dom.title.rendered}`}
              className="bg-gray-100"
            />
          </div>

          {/* PDF Viewer Wrapped in Client Entry */}
          <div className="mt-12">
            <DOMViewerWrapper fileUrl={dom.file_url} />
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-8 bg-pmc-light rounded-3xl border border-blue-100 mb-12">
            <p className="text-gray-500 text-sm leading-relaxed">
              O Diário Oficial do Município (DOM) é o veículo de comunicação
              oficial da Prefeitura Municipal de Caxias, destinado à publicação
              de atos administrativos, licitações, convocações e demais
              documentos de interesse público, garantindo transparência e
              validade jurídica aos atos do governo municipal.
            </p>
          </div>

          <DOMInfo />
        </div>
      </main>

      <Footer />
    </>
  );
}
