"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { WordPressPodcast } from "@/lib/wordpress";

interface PodcastContextType {
  currentEpisode: WordPressPodcast | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  episodesList: WordPressPodcast[];
  isMinimized: boolean;
  playEpisode: (episode: WordPressPodcast, list?: WordPressPodcast[]) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  setPlaybackRate: (rate: number) => void;
  setIsMinimized: (min: boolean) => void;
  nextEpisode: () => void;
  prevEpisode: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

export function PodcastProvider({ children }: { children: React.ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<WordPressPodcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [episodesList, setEpisodesList] = useState<WordPressPodcast[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync audio source when currentEpisode changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (currentEpisode && currentEpisode.podcast_audio_url) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentEpisode.podcast_audio_url;
      audioRef.current.load();
      
      if (wasPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("[Podcast Player] Play interrupted/failed on source change:", err);
          setIsPlaying(false);
        });
      }
    } else if (currentEpisode) {
      console.warn("[Podcast Player] Episode does not have a valid audio URL:", currentEpisode);
      setIsPlaying(false);
    } else {
      audioRef.current.src = "";
      setIsPlaying(false);
    }
  }, [currentEpisode]);

  // Sync playback state (Play/Pause)
  useEffect(() => {
    if (!audioRef.current || !currentEpisode || !currentEpisode.podcast_audio_url) return;
    
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("[Podcast Player] Play failed:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentEpisode]);

  // Sync volume state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Sync playback rate (Speed)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const playEpisode = (episode: WordPressPodcast, list?: WordPressPodcast[]) => {
    if (list && list.length > 0) {
      setEpisodesList(list);
    } else if (!episodesList.some((ep) => ep.id === episode.id)) {
      setEpisodesList((prev) => {
        // Mantenha o episódio adicionado no topo da lista se não houver fila definida
        const exists = prev.some((ep) => ep.id === episode.id);
        return exists ? prev : [episode, ...prev];
      });
    }
    
    // Se for o mesmo episódio e estiver pausado, apenas dê play. Se for outro, atualize.
    if (currentEpisode?.id === episode.id) {
      setIsPlaying(true);
    } else {
      setCurrentEpisode(episode);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!currentEpisode) return;
    setIsPlaying((prev) => !prev);
  };

  const seek = (time: number) => {
    if (!audioRef.current || !currentEpisode) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (vol: number) => {
    const safeVol = Math.max(0, Math.min(1, vol));
    setVolumeState(safeVol);
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
  };

  // Find index in current playlist
  const currentIndex = currentEpisode
    ? episodesList.findIndex((ep) => ep.id === currentEpisode.id)
    : -1;

  // No index list order:
  // Se os podcasts estão ordenados por número decrescente (ex: Ep 12 -> Ep 11 -> Ep 10)
  // Então o "próximo" na ordenação cronológica decrescente seria o índice + 1 (Episódio mais antigo)
  // E o "anterior" seria o índice - 1 (Episódio mais novo)
  // Para tornar intuitivo: 
  // Botão "Next" -> Toca o próximo na lista (index + 1)
  // Botão "Prev" -> Toca o anterior na lista (index - 1)
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex !== -1 && currentIndex < episodesList.length - 1;

  const nextEpisode = () => {
    if (hasNext) {
      setCurrentEpisode(episodesList[currentIndex + 1]);
      setIsPlaying(true);
    }
  };

  const prevEpisode = () => {
    if (hasPrevious) {
      setCurrentEpisode(episodesList[currentIndex - 1]);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    if (hasNext) {
      nextEpisode();
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  return (
    <PodcastContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        currentTime,
        duration,
        volume,
        playbackRate,
        episodesList,
        isMinimized,
        playEpisode,
        togglePlay,
        seek,
        setVolume,
        setPlaybackRate,
        setIsMinimized,
        nextEpisode,
        prevEpisode,
        hasPrevious,
        hasNext,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
      />
    </PodcastContext.Provider>
  );
}

export function usePodcast() {
  const context = useContext(PodcastContext);
  if (context === undefined) {
    throw new Error("usePodcast deve ser utilizado dentro de um PodcastProvider");
  }
  return context;
}
