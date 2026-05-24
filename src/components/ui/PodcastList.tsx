"use client";

import React from "react";
import { WordPressPodcast } from "@/lib/wordpress";
import { usePodcast } from "@/context/PodcastContext";
import { Headphones, Play, Calendar, Clock, Mic } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { shouldUnoptimizeImage } from "@/lib/utils";

interface PodcastListProps {
  podcasts: WordPressPodcast[];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

export function PodcastList({ podcasts }: PodcastListProps) {
  const { playEpisode } = usePodcast();

  if (!podcasts || podcasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white border border-slate-100 rounded-2xl shadow-sm">
        <Headphones className="w-12 h-12 text-slate-300 animate-pulse mb-4" />
        <h3 className="text-lg font-semibold text-slate-800">Nenhum episódio disponível</h3>
        <p className="text-sm text-slate-400 max-w-[320px] mt-1">
          Fique atento! Em breve traremos novidades e novos áudios informativos para você.
        </p>
      </div>
    );
  }

  // O primeiro episódio na lista é o mais recente ("NOVO EPISÓDIO")
  const featured = podcasts[0];
  const remaining = podcasts.slice(1);

  const featuredImage = featured._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <div className="w-full flex flex-col gap-10 pb-28">
      {/* Header Geral da Seção */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
          <Mic className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
            Podcast Interno
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Ouça os episódios sobre as ações, projetos e novidades da Prefeitura de Caxias.
          </p>
        </div>
      </div>

      {/* 1. Episódio em Destaque (Destaque Principal) */}
      <div className="bg-white border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-stretch">
        {/* Cover Destaque */}
        <div className="relative w-full md:w-[250px] h-[250px] rounded-2xl bg-blue-50/50 border border-slate-100 overflow-hidden flex-shrink-0 self-center">
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={featured.title.rendered}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 250px"
              priority
              unoptimized={shouldUnoptimizeImage(featuredImage)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-500 bg-blue-50">
              <Headphones className="w-16 h-16" />
            </div>
          )}
        </div>

        {/* Informações Destaque */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="flex flex-col gap-3">
            {/* Badges de Episódio */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Novo Episódio
              </span>
              {featured.podcast_episode_number && (
                <span className="text-xs font-semibold text-slate-400">
                  Ep. {featured.podcast_episode_number}
                </span>
              )}
              {featured.podcast_duration && (
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  • {featured.podcast_duration}
                </span>
              )}
            </div>

            {/* Título Destaque */}
            <Link
              href={`/podcasts/${featured.slug}`}
              className="group-hover:text-blue-600 transition-colors"
            >
              <h2
                className="text-xl md:text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                dangerouslySetInnerHTML={{ __html: featured.title.rendered }}
              />
            </Link>

            {/* Data */}
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-300" />
              {formatDate(featured.date)}
            </p>

            {/* Descrição Curta */}
            <div
              className="text-sm text-slate-500 leading-relaxed max-w-162.5 line-clamp-3 mt-1"
              dangerouslySetInnerHTML={{
                __html: featured.excerpt.rendered || featured.content.rendered
              }}
            />
          </div>

          {/* Botão de Ouvir Destaque */}
          <div className="mt-6 md:mt-4">
            <button
              onClick={() => playEpisode(featured, podcasts)}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 hover:scale-[1.02] active:scale-95"
            >
              <Play className="w-4 h-4 fill-current text-white" />
              Ouvir agora
            </button>
          </div>
        </div>
      </div>

      {/* 2. Episódios Disponíveis (Lista Secundária) */}
      <div className="flex flex-col gap-6 mt-2">
        <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
          <Headphones className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold">Episódios Disponíveis</h3>
        </div>

        <div className="flex flex-col gap-4">
          {remaining.map((episode) => {
            const epImage = episode._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
            return (
              <div
                key={episode.id}
                className="bg-white border border-slate-200/70 hover:border-slate-300/80 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-4 md:p-5 flex gap-4 md:gap-5 items-start group"
              >
                {/* Thumb Episódio */}
                <div className="relative w-16 h-16 rounded-xl bg-blue-50/50 border border-slate-100 overflow-hidden shrink-0">
                  {epImage ? (
                    <Image
                      src={epImage}
                      alt={episode.title.rendered}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized={shouldUnoptimizeImage(epImage)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-500 bg-blue-50">
                      <Headphones className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {/* Info Episódio */}
                <div className="flex-1 min-w-0 flex flex-col md:flex-row justify-between gap-3 items-stretch md:items-center">
                  <div className="flex-1 min-w-0 pr-4">
                    {/* Título com número do episódio */}
                    <Link href={`/podcasts/${episode.slug}`}>
                      <h4
                        className="text-sm md:text-base font-bold text-slate-800 hover:text-blue-600 transition-colors truncate"
                        dangerouslySetInnerHTML={{
                          __html: episode.podcast_episode_number
                            ? `Ep. ${episode.podcast_episode_number} — ${episode.title.rendered}`
                            : episode.title.rendered
                        }}
                      />
                    </Link>

                    {/* Metadata e Badges */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold mt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        {formatDate(episode.date)}
                      </span>
                      {episode.podcast_duration && (
                        <span className="inline-flex items-center bg-blue-50 border border-blue-100/30 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {episode.podcast_duration}
                        </span>
                      )}
                    </div>

                    {/* Breve descrição */}
                    <div
                      className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: episode.excerpt.rendered || episode.content.rendered
                      }}
                    />
                  </div>

                  {/* Ação rápida: Botão Play */}
                  <div className="shrink-0 self-center">
                    <button
                      onClick={() => playEpisode(episode, podcasts)}
                      className="w-10 h-10 rounded-full bg-slate-50 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-200/60 hover:border-blue-600 shadow-sm"
                      title="Ouvir este episódio"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
