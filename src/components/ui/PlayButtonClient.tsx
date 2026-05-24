"use client";

import React from "react";
import { WordPressPodcast } from "@/lib/wordpress";
import { usePodcast } from "@/context/PodcastContext";
import { Play, Pause } from "lucide-react";

interface PlayButtonClientProps {
  episode: WordPressPodcast;
  playlist?: WordPressPodcast[];
  className?: string;
}

export function PlayButtonClient({ episode, playlist, className = "" }: PlayButtonClientProps) {
  const { playEpisode, currentEpisode, isPlaying, togglePlay } = usePodcast();

  const isCurrent = currentEpisode?.id === episode.id;
  const showPause = isCurrent && isPlaying;

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playEpisode(episode, playlist);
    }
  };

  return (
    <button
      onClick={handlePlayClick}
      className={`inline-flex items-center justify-center gap-2 font-bold px-6 py-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
        showPause
          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
          : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
      } ${className}`}
    >
      {showPause ? (
        <>
          <Pause className="w-5 h-5 fill-current text-white" />
          <span>Pausar Episódio</span>
        </>
      ) : (
        <>
          <Play className="w-5 h-5 fill-current text-white ml-0.5" />
          <span>Ouvir Episódio</span>
        </>
      )}
    </button>
  );
}
