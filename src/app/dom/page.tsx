import { DOMInfo } from "@/components/dom/DOMInfo";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Pagination } from "@/components/ui/Pagination";
import { getDOMEditions } from "@/lib/dom";
import { generatePMCSEO } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { Search, FileText, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = generatePMCSEO({
  title: "Diário Oficial do Município — DOM",
  description:
    "Consulte as edições do Diário Oficial do Município de Caxias/MA. Publicações de decretos, portarias, licitações e demais atos administrativos.",
});

interface DOMPageProps {
  searchParams: Promise<{
    page?: string;
    startDate?: string;
    endDate?: string;
    q?: string;
  }>;
}

export default async function DOMPage({ searchParams }: DOMPageProps) {
  const { page, startDate, endDate, q } = await searchParams;
  const currentPage = Math.max(1, Number(page || 1));

  const { editions, totalPages, total } = await getDOMEditions({
    page: currentPage,
    perPage: 24,
    search: q,
    startDate,
    endDate,
  });

  return (
    <>
      <Header />

      <main className="grow bg-white py-12">
        <Container>
          {/* Header Section */}
          <div className="mb-12">
            <Heading className="mb-6">
              Diário Oficial do Município — DOM
            </Heading>
            <p className="text-gray-600 max-w-5xl leading-relaxed mb-10 italic">
              O Diário Oficial de Caxias/MA (DOM), tem como objetivo dar
              publicidade a todos os atos da Administração Pública direta e
              indireta do município, seus órgãos, fundos, fundações e demais
              entidades da administração direta e indireta, bem como os atos ou
              negócios celebrados por estes e demais pessoas físicas ou
              jurídicas, de direito público ou privado, nacionais ou
              estrangeiras.
            </p>
          </div>

          {/* Search / Filter Section */}
          <Card
            hover={false}
            className="bg-pmc-warning/10 border-pmc-warning/20 p-8 mb-12"
          >
            <Heading level={3} variant="section" className="mb-6 text-pmc-dark">
              <Search className="w-5 h-5 text-pmc-primary" />
              Pesquisa no Acervo
            </Heading>

            <form method="GET" action="/dom">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end">
                {/* Data inicial */}
                <div>
                  <label className="block text-sm font-semibold text-pmc-dark mb-1.5">
                    Data inicial
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      name="startDate"
                      defaultValue={startDate}
                      className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-pmc-primary outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Data final */}
                <div>
                  <label className="block text-sm font-semibold text-pmc-dark mb-1.5">
                    Data final
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      name="endDate"
                      defaultValue={endDate}
                      className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-pmc-primary outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Busca por termo/edição */}
                <div>
                  <label className="block text-sm font-semibold text-pmc-dark mb-1.5">
                    Termo ou Edição
                  </label>
                  <input
                    type="text"
                    name="q"
                    defaultValue={q}
                    placeholder="Ex: 6250"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-pmc-primary outline-none transition-colors text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full h-11 bg-pmc-primary text-white font-bold rounded-xl hover:bg-pmc-primary/90 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  PESQUISAR
                </button>
              </div>
            </form>
          </Card>

          {/* Contagem de resultados */}
          {(q || startDate || endDate) && (
            <p className="text-sm text-gray-500 mb-6">
              {total}{" "}
              {total === 1 ? "edição encontrada" : "edições encontradas"}
              {q && (
                <>
                  {" "}
                  para <strong>&quot;{q}&quot;</strong>
                </>
              )}
            </p>
          )}

          {/* Grid de edições */}
          {editions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {editions.map((edition) => (
                  <DOMCard key={edition.id} edition={edition} />
                ))}
              </div>

              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          ) : (
            <div className="py-20 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <FileText className="w-16 h-16 mx-auto opacity-20 text-gray-400 mb-4" />
              <Heading
                level={3}
                variant="section"
                className="justify-center text-gray-500"
              >
                Nenhuma edição encontrada
              </Heading>
              <p className="text-gray-400 mt-2 text-sm">
                Tente ajustar os filtros ou verifique se há novas publicações.
              </p>
              {(q || startDate || endDate) && (
                <Link
                  href="/dom"
                  className="mt-6 inline-flex items-center gap-2 text-pmc-primary font-semibold text-sm hover:underline"
                >
                  Limpar filtros
                </Link>
              )}
            </div>
          )}

          <DOMInfo />
        </Container>
      </main>

      <Footer />
    </>
  );
}

function DOMCard({
  edition,
}: {
  edition: { date_dom: string; slug: string; title: { rendered: string } };
}) {
  const formattedDate = edition.date_dom
    ? new Date(edition.date_dom + "T00:00:00").toLocaleDateString("pt-BR")
    : "";

  return (
    <Link href={`/dom/${edition.slug}`}>
      <Card className="flex flex-col h-full bg-pmc-light/30 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-pmc-primary">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-auto">
          <Heading level={3} variant="card" className="mb-1">
            Edição {edition.title.rendered}
          </Heading>
          <p className="text-xs text-gray-500 font-medium font-mono uppercase">
            Publicado em {formattedDate}
          </p>
        </div>
      </Card>
    </Link>
  );
}
