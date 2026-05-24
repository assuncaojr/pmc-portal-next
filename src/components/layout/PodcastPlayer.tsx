"use client";

import React, { useState, useEffect } from "react";
import { usePodcast } from "@/context/PodcastContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Headphones
} from "lucide-react";
import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/utils";
import Link from "next/link";

// Helper function to format time (e.g. 125s -> "2:05")
function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function PodcastPlayer() {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    togglePlay,
    seek,
    setVolume,
    setPlaybackRate,
    nextEpisode,
    prevEpisode,
    hasPrevious,
    hasNext,
  } = usePodcast();

  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  if (!currentEpisode) return null;

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(false); // volume set to 0 handles it
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const speeds = [0.5, 1.0, 1.25, 1.5, 2.0];
  const featuredImage = currentEpisode._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  if (isMinimized) {
    return (
      <div className="fixed bottom-10 right-10 z-50 flex items-center gap-5 bg-white/75 backdrop-blur-lg border border-white/40 shadow-2xl rounded-full px-6 py-4.5 animate-bounce-subtle hover:scale-105 transition-all duration-300">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3.5 text-pmc-dark hover:text-blue-600 transition-colors"
        >
          <div className="relative w-11 h-11 rounded-full bg-blue-50/70 flex items-center justify-center text-blue-600">
            <Headphones className="w-5.5 h-5.5 animate-pulse" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-blue-500"></span>
              </span>
            )}
          </div>
          <div className="text-left max-w-[200px] pr-4 border-r border-slate-200/50">
            <p className="text-[14px] font-semibold text-slate-800 truncate">
              {currentEpisode.title.rendered}
            </p>
            <p className="text-[12px] text-slate-400 font-medium">Tocando agora</p>
          </div>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-4.5 h-4.5 fill-current text-white" />
            ) : (
              <Play className="w-4.5 h-4.5 fill-current text-white ml-0.5" />
            )}
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-slate-400 hover:text-slate-600 p-1 hover:scale-115 transition-transform"
            title="Expandir player"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-t border-white/35 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] animate-slide-up">
      {/* Container Principal */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-3 pb-4 md:py-4 flex flex-col gap-3">

        {/* Barra de Progresso superior no player */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-[11px] font-medium text-slate-500 font-mono w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-1 bg-slate-100 hover:h-1.5 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all duration-150"
              style={{
                background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
                  duration ? (currentTime / duration) * 100 : 0
                }%, #f1f5f9 ${
                  duration ? (currentTime / duration) * 100 : 0
                }%, #f1f5f9 100%)`
              }}
            />
          </div>
          <span className="text-[11px] font-medium text-slate-500 font-mono w-10 text-left">
            {formatTime(duration)}
          </span>
        </div>

        {/* Linha Inferior com Metadados, Controles e Opções */}
        <div className="flex items-center justify-between gap-4">

          {/* Lado Esquerdo: Capa e Título do Episódio */}
          <div className="flex items-center gap-3 min-w-[240px] max-w-[320px] md:max-w-[400px]">
            <Link
              href={`/podcasts/${currentEpisode.slug}`}
              className="relative w-12 h-12 rounded-lg bg-blue-50 border border-slate-100 overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
              title="Ver detalhes do episódio"
            >
              {featuredImage ? (
                <Image
                  src={featuredImage}
                  alt={currentEpisode.title.rendered}
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized={shouldUnoptimizeImage(featuredImage)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-500 bg-blue-50">
                  <Headphones className="w-5 h-5" />
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                href={`/podcasts/${currentEpisode.slug}`}
                className="hover:text-blue-600 transition-colors block text-slate-800"
                title="Ver detalhes do episódio"
              >
                <h4
                  className="text-[13px] md:text-sm font-semibold truncate"
                  dangerouslySetInnerHTML={{ __html: currentEpisode.title.rendered }}
                />
              </Link>
              <Link
                href="/podcasts"
                className="hover:text-blue-600 transition-colors block mt-0.5"
                title="Ver todos os episódios"
              >
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  Podcast Prefeitura de Caxias
                </p>
              </Link>
            </div>
          </div>

          {/* Centro: Controles de Áudio */}
          <div className="flex items-center gap-4">
            <button
              onClick={prevEpisode}
              disabled={!hasPrevious}
              className="p-2 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Episódio Anterior"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md shadow-blue-200"
              title={isPlaying ? "Pausar" : "Ouvir"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current text-white" />
              ) : (
                <Play className="w-5 h-5 fill-current text-white ml-0.5" />
              )}
            </button>

            <button
              onClick={nextEpisode}
              disabled={!hasNext}
              className="p-2 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
              title="Próximo Episódio"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Lado Direito: Volume, Velocidade e Minimizar */}
          <div className="flex items-center gap-4 min-w-[200px] justify-end">
            {/* Controle de Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={handleMuteToggle}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4.5 h-4.5" />
                ) : (
                  <Volume2 className="w-4.5 h-4.5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-20 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all group-hover/volume:h-1.5"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${
                    isMuted ? 0 : volume * 100
                  }%, #f1f5f9 ${isMuted ? 0 : volume * 100}%, #f1f5f9 100%)`
                }}
              />
            </div>

            {/* Seletor de Velocidade */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-xs font-semibold px-2 py-1 rounded bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1 font-mono"
              >
                {playbackRate.toFixed(1)}x
              </button>

              {showSpeedMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSpeedMenu(false)}
                  />
                  <div className="absolute bottom-full right-0 mb-2 z-20 bg-white border border-slate-100 rounded-lg shadow-xl py-1 min-w-[80px] text-center animate-slide-up-subtle">
                    {speeds.map((sp) => (
                      <button
                        key={sp}
                        onClick={() => {
                          setPlaybackRate(sp);
                          setShowSpeedMenu(false);
                        }}
                        className={`w-full text-xs py-1.5 px-3 hover:bg-slate-50 transition-colors block font-mono text-left ${
                          playbackRate === sp ? "text-blue-600 font-bold" : "text-slate-600"
                        }`}
                      >
                        {sp.toFixed(1)}x
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Minimizar */}
            <button
              onClick={() => setIsMinimized(true)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded hover:bg-slate-50 transition-colors"
              title="Minimizar Player"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
