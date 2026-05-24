import Link from "next/link";
import { Facebook, Instagram, Youtube } from "@/components/ui/SocialIcons";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-pmc-primary text-white">
      <div className="container mx-auto px-4 max-w-container pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo */}
          <div className="space-y-6">
            <Image
              src="/logo-caxias-negativo.png"
              alt="Prefeitura de Caxias"
              width={340}
              height={120}
              className="h-42 w-auto"
              unoptimized={true}
            />
          </div>

          {/* Column 2: Contato */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-white/30 rounded-full"></span>
              Contato
            </h3>
            <ul className="space-y-4 text-white/80 text-sm">
              <li>Praça Dias Carneiro, 600, Centro</li>
              <li>CEP: 65.604-090 — Caxias / MA</li>
              <li className="pt-2">(99) 2221-0011 - 2221-0012</li>
              <li>sec.comunicacao@caxias.ma.gov.br</li>
              <li className="pt-2 opacity-60">Seg a Sex: 7h30 às 13h30</li>
            </ul>
          </div>

          {/* Column 3: Links Rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-white/30 rounded-full"></span>
              Links Rápidos
            </h3>
            <ul className="space-y-3 text-white/80 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Portal da Transparência
                </Link>
              </li>
              <li>
                <Link
                  href="/dom"
                  className="hover:text-white transition-colors"
                >
                  Diário Oficial
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Licitações
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Webmail
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Ouvidoria (E-Sic)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Mapa do Site
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Redes Sociais */}
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-white/30 rounded-full"></span>
              Redes Sociais
            </h3>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Siga-nos e fique por dentro de tudo que acontece em Caxias.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: "#" },
                { Icon: Facebook, href: "#" },
                { Icon: Youtube, href: "#" },
              ].map(({ Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20 transition-all border border-white/10"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-container flex justify-center">
          <p className="text-xs text-white/40 font-medium text-center">
            © {new Date().getFullYear()} Prefeitura Municipal de Caxias — Todos
            os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
