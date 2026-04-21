"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  // Janela de páginas visíveis: mostra no máx 5 ao redor da atual
  const delta = 2;
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  const btnBase =
    "inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold transition-all";

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-12"
      aria-label="Paginação"
    >
      {/* Anterior */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className={cn(
            btnBase,
            "bg-white border border-gray-200 text-pmc-primary hover:bg-pmc-primary hover:text-white hover:border-pmc-primary",
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span
          className={cn(
            btnBase,
            "bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100",
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {/* Números */}
      {pages.map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className={cn(btnBase, "text-gray-400 cursor-default")}
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={cn(
              btnBase,
              page === currentPage
                ? "bg-pmc-primary text-white shadow-sm pointer-events-none"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-pmc-primary hover:text-white hover:border-pmc-primary",
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ),
      )}

      {/* Próximo */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className={cn(
            btnBase,
            "bg-white border border-gray-200 text-pmc-primary hover:bg-pmc-primary hover:text-white hover:border-pmc-primary",
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span
          className={cn(
            btnBase,
            "bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100",
          )}
        >
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
