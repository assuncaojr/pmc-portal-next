"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";

export function PodcastBanner() {
  return (
    <Link
      href="/podcasts"
      className="relative block overflow-hidden  bg-white  group transition-all duration-300 hover:-translate-y-1"
    >
      {/* Círculos decorativos de luz de fundo super sutis */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50/40 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-slate-50 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Ícone com Fundo Azul Suave */}
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100/30 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
          <Mic className="w-5 h-5 animate-pulse" />
        </div>

        {/* Textos */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-slate-900 font-extrabold text-lg leading-tight tracking-tight flex items-center gap-2">
            Podcast Interno
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase bg-emerald-500 text-white px-1.5 py-0.5 rounded-full border border-emerald-400/10 shadow-sm animate-pulse-slow">
              No Ar
            </span>
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px]">
            Ouça notícias, novidades e ações da Prefeitura de Caxias diretamente pelo portal.
          </p>
        </div>

        {/* Botão com Micro-animação Dinâmica */}
        <div className="inline-flex items-center gap-1.5 self-start text-xs font-extrabold text-blue-600 bg-blue-50/60 group-hover:bg-blue-600 group-hover:text-white border border-blue-100/30 rounded-xl px-4 py-2.5 transition-all duration-300 shadow-sm">
          <span>Ouvir Episódios</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}
