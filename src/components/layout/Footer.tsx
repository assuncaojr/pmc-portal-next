import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Facebook, Instagram, Twitter, Youtube } from "@/components/ui/SocialIcons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-pmc-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* PMC Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <span className="text-pmc-primary font-bold text-xl tracking-tighter">PMC</span>
              </div>
              <span className="font-bold uppercase tracking-wide">Prefeitura de Caxias</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Trabalhando para transformar Caxias na cidade que todos nós sonhamos. Transparência, inovação e compromisso com o cidadão.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/5 hover:bg-pmc-primary rounded-full transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-pmc-primary rounded-full transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-pmc-primary rounded-full transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-pmc-primary rounded-full transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-l-4 border-pmc-primary pl-4 uppercase tracking-wider">Acesso Rápido</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/dom" className="hover:text-white transition-colors">Diário Oficial</Link></li>
              <li><Link href="/transparencia" className="hover:text-white transition-colors">Portal da Transparência</Link></li>
              <li><Link href="/servicos" className="hover:text-white transition-colors">Carta de Serviços</Link></li>
              <li><Link href="/noticias" className="hover:text-white transition-colors">Sala de Imprensa</Link></li>
              <li><Link href="/concursos" className="hover:text-white transition-colors">Concursos e Seletivos</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-l-4 border-pmc-primary pl-4 uppercase tracking-wider">Contato</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-pmc-primary shrink-0" />
                <span className="text-sm">Praça Cândido Mendes, s/n - Centro, Caxias - MA, 65600-000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-pmc-primary shrink-0" />
                <span className="text-sm">(99) 3521-3000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-pmc-primary shrink-0" />
                <span className="text-sm">contato@caxias.ma.gov.br</span>
              </li>
            </ul>
          </div>

          {/* Gov Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-l-4 border-pmc-primary pl-4 uppercase tracking-wider">Governo</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="https://www.ma.gov.br" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Governo do Maranhão</a></li>
              <li><a href="https://www.gov.br" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Governo Federal</a></li>
              <li><a href="https://www.famem.org.br" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">FAMEM</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© {currentYear} Prefeitura Municipal de Caxias - Todos os direitos reservados.</p>
          <div className="flex space-x-6">
            <Link href="/privacidade" className="hover:text-white">Políticas de Privacidade</Link>
            <Link href="/termos" className="hover:text-white">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
