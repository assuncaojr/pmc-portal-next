"use client";

import Link from "next/link";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, Youtube } from "@/components/ui/SocialIcons";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full z-50 shadow-sm">
      {/* Top Bar (White) */}
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-3 shrink-0">
              <div className="flex items-center gap-3">
                 <div className="w-[180px] md:w-[240px]">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_WORDPRESS_URL || ''}/wp-content/themes/2019-2/images/logo.png`}
                      alt="Prefeitura de Caxias" 
                      className="w-full h-auto"
                    />
                 </div>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex grow max-w-xl relative">
              <input 
                type="text" 
                placeholder="O que você procura em nosso portal?" 
                className="w-full pl-6 pr-14 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-pmc-warning outline-none transition-all placeholder:text-gray-400"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-pmc-warning text-white rounded-r-lg hover:bg-pmc-warning/90 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Social Icons - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <a href="#" className="text-pink-600 hover:scale-110 transition-transform"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-blue-600 hover:scale-110 transition-transform"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-red-600 hover:scale-110 transition-transform"><Youtube className="w-5 h-5" /></a>
              
              <button 
                className="lg:hidden p-2 text-pmc-dark"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center space-x-2">
               <button className="p-2 text-pmc-primary"><Search className="w-6 h-6" /></button>
               <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-pmc-dark">
                 {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Bar (Blue) */}
      <div className="bg-[#2B59B2] text-white hidden lg:block overflow-x-auto">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between whitespace-nowrap py-1">
            <ul className="flex items-center">
              <NavItem title="Caxias" hasDropdown />
              <NavItem title="Governo" hasDropdown />
              <NavItem title="Secretarias" hasDropdown />
              <NavItem title="Órgãos" hasDropdown />
              <NavItem title="Transparência" hasDropdown />
              <li><Link href="#" className="px-4 py-3 hover:bg-white/10 transition-all font-medium text-sm inline-block">Minha Casa Minha Vida</Link></li>
              <li><Link href="/noticias" className="px-4 py-3 hover:bg-white/10 transition-all font-medium text-sm inline-block">Notícias</Link></li>
              <li><Link href="#" className="px-4 py-3 hover:bg-white/10 transition-all font-medium text-sm inline-block">Mapa do Site</Link></li>
              <li><Link href="#" className="px-4 py-3 hover:bg-white/10 transition-all font-medium text-sm inline-block">Webmail</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed inset-0 top-[84px] bg-white z-[60] transition-all duration-300",
        isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}>
        <nav className="p-6 flex flex-col space-y-4">
          <Link href="/" className="text-lg font-bold border-b pb-2">Início</Link>
          <Link href="/noticias" className="text-lg font-bold border-b pb-2">Notícias</Link>
          <Link href="/dom" className="text-lg font-bold border-b pb-2">Diário Oficial</Link>
          <Link href="/transparencia" className="text-lg font-bold border-b pb-2">Transparência</Link>
          {/* Add more as needed */}
        </nav>
      </div>
    </header>
  );
}

function NavItem({ title, hasDropdown = false }: { title: string; hasDropdown?: boolean }) {
  return (
    <li className="group relative">
      <Link href="#" className="px-4 py-3 hover:bg-white/10 transition-all font-medium text-sm flex items-center space-x-1 group">
        <span>{title}</span>
        {hasDropdown && <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform" />}
      </Link>
      {hasDropdown && (
        <div className="absolute top-full left-0 w-48 bg-white text-pmc-dark shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 border-t-2 border-pmc-primary z-[70]">
          <div className="py-2 flex flex-col">
            <Link href="#" className="px-4 py-2 hover:bg-gray-50 transition-colors text-sm">Item 1</Link>
            <Link href="#" className="px-4 py-2 hover:bg-gray-50 transition-colors text-sm">Item 2</Link>
          </div>
        </div>
      )}
    </li>
  );
}
