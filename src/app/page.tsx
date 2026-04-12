import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
  ArrowRight,
  FileCheck,
  Calculator,
  Users,
  Landmark,
  BookOpen,
  FileText,
  Gavel,
  ShieldCheck,
  ScrollText,
  BadgeInfo,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <>
      <Header />

      <main className="grow bg-[#F8FAFC]">
        {/* Modern Hero Grid Section */}
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-[1240px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Feature Post (Main) */}
              <div className="lg:col-span-7 group">
                <Link
                  href="#"
                  className="block relative overflow-hidden rounded-2xl aspect-[16/10] lg:aspect-auto lg:h-full bg-pmc-dark shadow-xl shadow-blue-900/10"
                >
                  <img
                    src="https://caxias.ma.gov.br/wp-content/uploads/2024/04/premiacao-sebrae.jpg"
                    alt="Premiacao"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black via-black/60 to-transparent">
                    <span className="inline-block px-3 py-1 bg-pmc-primary text-[10px] font-bold text-white rounded uppercase tracking-wider mb-4">
                      # Governo
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4 group-hover:text-pmc-warning transition-colors">
                      Prefeitura de Caxias é premiada com o 1º e 3º lugares no
                      Prêmio Prefeitura Empreendedora do Sebrae
                    </h2>
                  </div>
                </Link>
              </div>

              {/* Sidebar Post Grid (2x2) */}
              <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <PostCard
                  tag="Proteção Social"
                  title="Evento alusivo ao Dia Mundial de Conscientização do Autismo"
                  image="https://caxias.ma.gov.br/wp-content/uploads/2024/04/autismo-evento.jpg"
                />
                <PostCard
                  tag="Saúde"
                  title="Treinamentos para aplicação do anticoncepcional Implanon"
                  image="https://caxias.ma.gov.br/wp-content/uploads/2024/04/saude-treinamento.jpg"
                />
                <PostCard
                  tag="Proteção Social"
                  title="Projeto Cozinha Comunitária Itinerante é levado a famílias"
                  image="https://caxias.ma.gov.br/wp-content/uploads/2024/04/cozinha-comunitaria.jpg"
                />
                <PostCard
                  tag="Cultura"
                  title="Centro de Convivência de Idosos recebe celebração de Páscoa"
                  image="https://caxias.ma.gov.br/wp-content/uploads/2024/04/idosos-pascoa.jpg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Links Úteis & Sidebar Section */}
        <section className="py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-[1240px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Links Grid (Left) */}
              <div className="lg:col-span-8">
                <div className="flex items-center space-x-3 mb-10">
                  <div className="w-1.5 h-8 bg-pmc-primary rounded-full"></div>
                  <h2 className="text-3xl font-black text-pmc-dark uppercase tracking-tight">
                    Links Úteis
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UsefulLinkCard
                    icon={<FileCheck className="w-6 h-6" />}
                    label="Editais Concurso Público 2025"
                  />
                  <UsefulLinkCard
                    icon={<Calculator className="w-6 h-6" />}
                    label="Sistema Tributário Municipal"
                    highlight="novo"
                  />
                  <UsefulLinkCard
                    icon={<BadgeInfo className="w-6 h-6" />}
                    label="Portal da Transparência"
                  />
                  <UsefulLinkCard
                    icon={<Landmark className="w-6 h-6" />}
                    label="Diário Oficial"
                  />
                  <UsefulLinkCard
                    icon={<Users className="w-6 h-6" />}
                    label="Servidores"
                  />
                  <UsefulLinkCard
                    icon={<FileText className="w-6 h-6" />}
                    label="Contracheque"
                  />
                  <UsefulLinkCard
                    icon={<Gavel className="w-6 h-6" />}
                    label="Licitações"
                  />
                  <UsefulLinkCard
                    icon={<ShieldCheck className="w-6 h-6" />}
                    label="E-Sic"
                  />
                  <UsefulLinkCard
                    icon={<ScrollText className="w-6 h-6" />}
                    label="NFS-e"
                  />
                  <UsefulLinkCard
                    icon={<Landmark className="w-6 h-6" />}
                    label="Precatórios do FUNDEF"
                  />
                </div>
              </div>

              {/* Sidebar Law Box (Right) */}
              <div className="lg:col-span-4">
                <div className="bg-[#94A3B8]/20 rounded-2xl p-8 border border-gray-200/50">
                  <h3 className="text-2xl font-black text-pmc-dark mb-8 uppercase tracking-tight flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-pmc-primary" />
                    <span>Leis e Códigos</span>
                  </h3>
                  <ul className="space-y-4">
                    <LawLink label="Conselho Tutelar" />
                    <LawLink label="Lei 2.156/2014 - Concursos" highlight />
                    <LawLink label="Lei 2.113/2013 - Controle de Animais" />
                    <LawLink label="Código Tributário (download)" />
                    <LawLink label="Código de Postura (download)" />
                    <LawLink label="Código de Meio-ambiente (download)" />
                    <LawLink label="Plano Diretor (download)" />
                  </ul>

                  <Link
                    href="#"
                    className="mt-10 w-full py-4 bg-pmc-primary text-white text-center font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-pmc-primary/90 transition-all shadow-lg shadow-blue-900/20"
                  >
                    <span>Ver toda legislação</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function PostCard({
  tag,
  title,
  image,
}: {
  tag: string;
  title: string;
  image: string;
}) {
  return (
    <Link
      href="#"
      className="block group relative overflow-hidden rounded-2xl aspect-square shadow-lg shadow-gray-200/50"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end">
        <span className="inline-block self-start px-2 py-0.5 bg-pmc-primary text-[9px] font-bold text-white rounded mb-3 uppercase tracking-wider">
          {tag}
        </span>
        <h3 className="text-sm md:text-base font-bold text-white leading-tight group-hover:text-pmc-warning transition-colors line-clamp-3">
          {title}
        </h3>
      </div>
    </Link>
  );
}

function UsefulLinkCard({
  icon,
  label,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  highlight?: string;
}) {
  return (
    <Link
      href="#"
      className="p-6 bg-white border border-gray-100 rounded-2xl flex items-center gap-5 hover:shadow-xl hover:shadow-blue-900/5 hover:border-pmc-primary/20 transition-all group"
    >
      <div className="text-pmc-primary bg-pmc-primary/5 p-3 rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="font-bold text-pmc-dark text-sm leading-snug group-hover:text-pmc-primary transition-colors">
          {label}
          {highlight && (
            <span className="ml-2 text-[10px] bg-blue-100 text-pmc-primary px-1.5 py-0.5 rounded font-black uppercase">
              {highlight}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

function LawLink({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <li>
      <Link
        href="#"
        className={cn(
          "text-sm font-medium hover:text-pmc-primary transition-colors flex items-center gap-2 group",
          highlight
            ? "text-pmc-primary font-bold decoration-pmc-primary/30"
            : "text-gray-600",
        )}
      >
        <div className="w-1.5 h-1.5 bg-pmc-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className={cn(highlight && "underline underline-offset-4")}>
          {label}
        </span>
      </Link>
    </li>
  );
}
