"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, Youtube } from "@/components/ui/SocialIcons";
import { Container } from "../ui/Container";

import { MenuItem } from "@/lib/wordpress";

export function HeaderClient({ menuItems }: { menuItems: MenuItem[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full z-50 shadow-sm">
      <div className="bg-white py-4 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-45 md:w-60">
                  <Image
                    src={`${
                      process.env.NEXT_PUBLIC_WORDPRESS_URL || ""
                    }/wp-content/themes/2019-2/images/logo.png`}
                    alt="Prefeitura de Caxias"
                    width={240}
                    height={80}
                    style={{ width: "100%", height: "auto" }}
                    unoptimized={true}
                    priority
                  />
                </div>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form
              method="GET"
              action="/busca"
              className="hidden md:flex grow max-w-xl relative"
            >
              <input
                type="text"
                name="q"
                placeholder="O que você procura em nosso portal?"
                className="w-full pl-6 pr-14 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-pmc-warning outline-none transition-all placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-pmc-warning text-white rounded-r-lg hover:bg-pmc-warning/90 transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Social Icons - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <a
                href="#"
                className="text-pink-600 hover:scale-110 transition-transform"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-blue-600 hover:scale-110 transition-transform"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-red-600 hover:scale-110 transition-transform"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center space-x-2">
              <form method="GET" action="/busca">
                <button
                  type="submit"
                  className="p-2 text-pmc-primary"
                  aria-label="Buscar"
                >
                  <Search className="w-6 h-6" />
                </button>
              </form>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-pmc-dark"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Bar (Blue) */}
      <div className="bg-pmc-primary text-white hidden lg:block">
        <Container className="mx-auto flex justify-center px-4">
          <nav className="flex items-center whitespace-nowrap">
            <ul className="flex items-center">
              {menuItems && menuItems.length > 0 ? (
                menuItems.map((item) => <NavItem key={item.id} item={item} />)
              ) : (
                <>
                  <NavItem
                    item={{
                      title: "Caxias",
                      url: "#",
                      id: 1,
                      target: "",
                      parent: 0,
                      order: 1,
                      children: [
                        {
                          title: "História",
                          url: "#",
                          id: 11,
                          target: "",
                          parent: 1,
                          order: 1,
                        },
                      ],
                    }}
                  />
                  <NavItem
                    item={{
                      title: "Transparência",
                      url: "/transparencia",
                      id: 5,
                      target: "",
                      parent: 0,
                      order: 5,
                    }}
                  />
                  <li>
                    <Link
                      href="/noticias"
                      className="px-3 py-3 hover:bg-white/10 transition-all font-medium text-sm inline-block"
                    >
                      Notícias
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dom"
                      className="px-3 py-3 hover:bg-white/10 transition-all font-medium text-sm inline-block"
                    >
                      Diário Oficial
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </Container>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 top-21 bg-white z-60 transition-all duration-300",
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0",
        )}
      >
        <nav className="p-6 flex flex-col space-y-4">
          {menuItems && menuItems.length > 0 ? (
            menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.url || "/"}
                target={item.target || undefined}
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold border-b pb-2"
              >
                <span dangerouslySetInnerHTML={{ __html: item.title }} />
              </Link>
            ))
          ) : (
            <>
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold border-b pb-2"
              >
                Início
              </Link>
              <Link
                href="/noticias"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold border-b pb-2"
              >
                Notícias
              </Link>
              <Link
                href="/dom"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold border-b pb-2"
              >
                Diário Oficial
              </Link>
              <Link
                href="/transparencia"
                onClick={() => setIsMenuOpen(false)}
                className="text-lg font-bold border-b pb-2"
              >
                Transparência
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavItem({ item }: { item: MenuItem }) {
  const hasDropdown = item.children && item.children.length > 0;

  return (
    <li className="group relative">
      <Link
        href={item.url || "#"}
        target={item.target || undefined}
        className="px-4 py-3 hover:bg-white/10 transition-all font-medium text-sm flex items-center space-x-1 group"
      >
        <span dangerouslySetInnerHTML={{ __html: item.title }} />
        {hasDropdown && (
          <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform" />
        )}
      </Link>
      {hasDropdown && item.children && (
        <div className="absolute top-full left-0 min-w-48 bg-white text-pmc-dark shadow-xl rounded-xl overflow-hidden opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 border-t-2 border-pmc-primary z-70">
          <div className="p-2 flex flex-col gap-0.5">
            {item.children.map((child) => (
              <Link
                key={child.id}
                href={child.url}
                target={child.target || undefined}
                className="px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm"
              >
                <span dangerouslySetInnerHTML={{ __html: child.title }} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}
