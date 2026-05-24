"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown, Menu, X, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, Youtube } from "@/components/ui/SocialIcons";
import { MenuItem } from "@/lib/wordpress";

export function HeaderClient({ menuItems }: { menuItems: MenuItem[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSocialDropdownOpen, setIsSocialDropdownOpen] = useState(false);

  return (
    <header className="w-full z-50">
      {/* Top Bar: Logo, Search, Social */}
      <div className="bg-[#f0f4f8] py-4 md:py-6 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
            <div className="flex items-center justify-between w-full md:w-auto shrink-0">
              {/* Logo */}
              <Link href="/" className="shrink-0">
                <Image
                  src="/logo-caxias.png"
                  alt="Prefeitura de Caxias"
                  width={196}
                  height={70}
                  className="h-11 md:h-18 w-auto"
                  unoptimized={true}
                  priority
                />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-pmc-dark"
              >
                {isMenuOpen ? (
                  <X className="w-8 h-8" />
                ) : (
                  <Menu className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="grow max-w-2xl w-full min-w-0 hidden md:block">
              <form method="GET" action="/busca" className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pmc-primary transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="q"
                  placeholder="Buscar no portal..."
                  className="w-full pl-14 pr-6 py-3.5 bg-white border border-gray-200 rounded-full focus:border-pmc-primary focus:ring-4 focus:ring-pmc-primary/10 outline-none transition-all placeholder:text-gray-400 text-pmc-dark font-medium shadow-sm"
                />
              </form>
            </div>

            {/* Social Icons (Desktop & Dropdown for Medium Screens) */}
            <div className="flex items-center gap-3">
              {/* Desktop view (>= lg) */}
              <div className="hidden lg:flex items-center gap-3">
                {[
                  { Icon: Instagram, href: "#" },
                  { Icon: Facebook, href: "#" },
                  { Icon: Youtube, href: "#" },
                ].map(({ Icon, href }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm hover:border-pmc-primary hover:text-pmc-primary transition-all text-gray-500"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>

              {/* Tablet/Medium view (md to lg) */}
              <div className="hidden md:flex lg:hidden relative">
                <button
                  onClick={() => setIsSocialDropdownOpen(!isSocialDropdownOpen)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm hover:border-pmc-primary hover:text-pmc-primary transition-all text-gray-500 focus:outline-none cursor-pointer"
                  aria-label="Redes Sociais"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {isSocialDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSocialDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 flex gap-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {[
                        { Icon: Instagram, href: "#", name: "Instagram" },
                        { Icon: Facebook, href: "#", name: "Facebook" },
                        { Icon: Youtube, href: "#", name: "YouTube" },
                      ].map(({ Icon, href, name }, idx) => (
                        <a
                          key={idx}
                          href={href}
                          title={name}
                          onClick={() => setIsSocialDropdownOpen(false)}
                          className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm hover:border-pmc-primary hover:text-pmc-primary transition-all text-gray-500"
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Bar (Blue Gradient) */}
      <div className="bg-linear-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-lg hidden md:block border-b-4 border-[#dc2626]">
        <div className="container mx-auto px-4 max-w-container">
          <nav className="flex items-center justify-center">
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
                    }}
                  />
                  <NavItem
                    item={{
                      title: "Governo",
                      url: "#",
                      id: 2,
                      target: "",
                      parent: 0,
                      order: 2,
                    }}
                  />
                  <NavItem
                    item={{
                      title: "Secretarias",
                      url: "#",
                      id: 3,
                      target: "",
                      parent: 0,
                      order: 3,
                    }}
                  />
                  <NavItem
                    item={{
                      title: "Órgãos",
                      url: "#",
                      id: 4,
                      target: "",
                      parent: 0,
                      order: 4,
                    }}
                  />
                  <NavItem
                    item={{
                      title: "Transparência",
                      url: "#",
                      id: 5,
                      target: "",
                      parent: 0,
                      order: 5,
                    }}
                  />
                  <NavItem
                    item={{
                      title: "Minha Casa Minha Vida",
                      url: "#",
                      id: 6,
                      target: "",
                      parent: 0,
                      order: 6,
                    }}
                  />
                  <NavItem
                    item={{
                      title: "Noticias",
                      url: "/noticias",
                      id: 7,
                      target: "",
                      parent: 0,
                      order: 7,
                    }}
                  />
                  <NavItem
                    item={{
                      title: "Mapa do Site",
                      url: "#",
                      id: 8,
                      target: "",
                      parent: 0,
                      order: 8,
                    }}
                  />
                  <NavItem
                    item={{
                      title: "Webmail",
                      url: "#",
                      id: 9,
                      target: "",
                      parent: 0,
                      order: 9,
                    }}
                  />
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-25 bg-white z-60 transition-all duration-300 overflow-y-auto",
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none",
        )}
      >
        <nav className="p-6 flex flex-col space-y-4 min-h-[calc(100vh-6.25rem)]">
          <div className="flex flex-col space-y-4">
            {menuItems && menuItems.length > 0
              ? menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.url || "/"}
                    target={item.target || undefined}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold border-b border-gray-100 pb-2 text-pmc-dark"
                  >
                    <span dangerouslySetInnerHTML={{ __html: item.title }} />
                  </Link>
                ))
              : [
                  "Caxias",
                  "Governo",
                  "Secretarias",
                  "Transparência",
                  "Noticias",
                ].map((title, i) => (
                  <Link
                    key={i}
                    href="#"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold border-b border-gray-100 pb-2 text-pmc-dark"
                  >
                    {title}
                  </Link>
                ))}
          </div>

          {/* Social Icons inside Mobile Menu */}
          <div className="pt-6 border-t border-gray-100 flex items-center gap-3 mt-auto">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider mr-2">
              Siga-nos:
            </span>
            {[
              { Icon: Instagram, href: "#" },
              { Icon: Facebook, href: "#" },
              { Icon: Youtube, href: "#" },
            ].map(({ Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:border-pmc-primary hover:text-pmc-primary transition-all text-gray-500"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
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
        className="px-4 py-4 md:py-5 hover:bg-white/10 transition-all font-bold text-sm flex items-center space-x-1 group border-b-2 border-transparent hover:border-white"
      >
        <span dangerouslySetInnerHTML={{ __html: item.title }} />
        {hasDropdown && (
          <ChevronDown className="w-4 h-4 ml-1 opacity-70 group-hover:rotate-180 transition-transform" />
        )}
      </Link>
      {hasDropdown && (
        <div className="absolute top-full left-0 min-w-48 bg-white text-pmc-dark shadow-xl rounded-xl overflow-hidden opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 border-t-2 border-blue-600 z-70">
          <div className="p-2 flex flex-col gap-0.5">
            {item.children?.map((child) => (
              <Link
                key={child.id}
                href={child.url}
                target={child.target || undefined}
                className="px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
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
