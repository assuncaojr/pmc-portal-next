import Link from "next/link";
import { Facebook, Instagram, Youtube } from "@/components/ui/SocialIcons";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#0048cc] text-white border-t-4 border-[#dc2626]">
      <div className="container mx-auto px-4 max-w-container pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Logo */}
          <div className="flex flex-col justify-start">
            <Image
              src="/logo-caxias-negativo.png"
              alt="Prefeitura de Caxias"
              width={340}
              height={180}
              className="w-36 h-auto opacity-95 hover:opacity-100 transition-opacity duration-200"
              unoptimized={true}
            />
            <p className="text-white/70 text-xs mt-6 leading-relaxed max-w-xs">
              Portal oficial do município de Caxias, Maranhão. Transparência, inovação e compromisso com o cidadão.
            </p>
          </div>

          {/* Column 2: Contato */}
          <div>
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 tracking-wide uppercase">
              <span className="w-1 h-5 bg-[#dc2626] rounded-full"></span>
              Contato
            </h3>
            <ul className="space-y-4 text-white/80 text-sm">
              <li className="flex items-start gap-2">
                <span>Praça Dias Carneiro, 600, Centro</span>
              </li>
              <li className="flex items-start gap-2">
                <span>CEP: 65.604-090 — Caxias / MA</span>
              </li>
              <li className="pt-2 flex items-start gap-2 text-white font-medium">
                <span>(99) 2221-0011 / 2221-0012</span>
              </li>
              <li className="text-white hover:text-red-200 hover:underline cursor-pointer transition-colors">
                sec.comunicacao@caxias.ma.gov.br
              </li>
              <li className="pt-2 opacity-60 text-xs">Seg a Sex: 7h30 às 13h30</li>
            </ul>
          </div>

          {/* Column 3: Links Rápidos */}
          <div>
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 tracking-wide uppercase">
              <span className="w-1 h-5 bg-[#dc2626] rounded-full"></span>
              Links Rápidos
            </h3>
            <ul className="space-y-3 text-white/80 text-sm">
              {[
                { label: "Portal da Transparência", href: "#" },
                { label: "Diário Oficial", href: "/dom" },
                { label: "Licitações", href: "#" },
                { label: "Webmail", href: "#" },
                { label: "Ouvidoria (E-Sic)", href: "#" },
                { label: "Mapa do Site", href: "#" },
              ].map(({ label, href }, idx) => (
                <li key={idx}>
                  <Link
                    href={href}
                    className="hover:text-white flex items-center gap-1 hover:translate-x-1 transition-all duration-200"
                  >
                    <span className="opacity-0 hover:opacity-100 transition-opacity text-[#dc2626] mr-0.5">➔</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Redes Sociais */}
          <div>
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2 tracking-wide uppercase">
              <span className="w-1 h-5 bg-[#dc2626] rounded-full"></span>
              Redes Sociais
            </h3>
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Siga-nos e fique por dentro de tudo que acontece em nossa cidade.
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
                  className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/10 rounded-lg hover:bg-[#dc2626] hover:border-[#dc2626] hover:text-white text-white/80 hover:scale-105 transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6 border-t border-white/10 bg-[#0051e5]">
        <div className="container mx-auto px-4 max-w-container flex justify-center">
          <p className="text-xs text-white/60 font-medium text-center">
            © {new Date().getFullYear()} Prefeitura Municipal de Caxias — Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
