import { DOMInfo } from "@/components/dom/DOMInfo";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { getDOMEditions } from "@/lib/dom";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { Search, FileText } from "lucide-react";

export default async function DOMPage() {
  const editions = await getDOMEditions();

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

          {/* Search Section */}
          <Card
            hover={false}
            className="bg-pmc-warning/10 border-pmc-warning/20 p-8 mb-12"
          >
            <Heading level={3} variant="section" className="mb-6 text-pmc-dark">
              <Search className="w-5 h-5 text-pmc-primary" />
              Pesquisa Avançada no Acervo
            </Heading>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-end">
              <Input label="Data inicial" type="date" />
              <Input label="Data final" type="date" />
              <Input label="Termo ou Edição" placeholder="Ex: 6250" />
              <Button variant="primary" className="w-full h-12">
                <Search className="w-5 h-5 mr-2" />
                <span>PESQUISAR</span>
              </Button>
            </div>
          </Card>

          {/* Grid Section */}
          {editions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {editions.map((edition) => (
                <DOMCard key={edition.id} edition={edition} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-gray-50 rounded-pmc border-2 border-dashed border-gray-200">
              <div className="text-gray-400 mb-4">
                <FileText className="w-16 h-16 mx-auto opacity-20" />
              </div>
              <Heading
                level={3}
                variant="section"
                className="justify-center text-gray-500"
              >
                Nenhuma edição encontrada
              </Heading>
              <p className="text-gray-400 mt-2">
                Tente ajustar seus filtros ou verifique se há novas publicações.
              </p>
            </div>
          )}

          {/* Pagination Placeholder */}
          <div className="mt-16 flex justify-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="bg-gray-100 text-gray-400"
            >
              1
            </Button>
            <Button size="sm" variant="primary">
              2
            </Button>
            <Button size="sm" variant="primary">
              Próximo »
            </Button>
          </div>

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
      <Card className="flex flex-col h-full bg-pmc-light/30">
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
