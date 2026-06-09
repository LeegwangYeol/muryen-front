"use client";

import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings2 } from "lucide-react";
import { useTheme } from "@/app/context/theme-context";

interface InteractivePlayerProps {
  url: string;
  title: string;
}

export function InteractivePlayer({ url, title }: InteractivePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
  const { theme } = useTheme();

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  
  const handleProgress = (state: { played: number }) => {
    setProgress(state.played * 100);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg border ${theme === "dark" ? "border-gray-800 bg-[#111]" : "border-gray-200 bg-white"}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="text-xs bg-[rgb(var(--accent))] text-white px-2 py-1 rounded-full">교보재</span>
      </div>
      
      <div className="relative pt-[56.25%] bg-black">
        <ReactPlayer
          ref={playerRef}
          url={url}
          className="absolute top-0 left-0"
          width="100%"
          height="100%"
          playing={isPlaying}
          playbackRate={playbackRate}
          muted={isMuted}
          onProgress={handleProgress}
          controls={false}
        />
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600">
          <div 
            className="h-full bg-[rgb(var(--accent))] transition-all duration-100" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePlayPause}
            className="p-3 rounded-full bg-[rgb(var(--accent))] text-white hover:opacity-90 transition"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button 
            onClick={() => playerRef.current?.seekTo(0)}
            className={`p-2 rounded-full transition ${theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
            title="다시 처음부터"
          >
            <RotateCcw size={18} />
          </button>
          
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-full transition ${theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Settings2 size={16} className="text-gray-500" />
          <span className="text-sm text-gray-500">배속:</span>
          {[0.5, 0.75, 1.0, 1.25].map(rate => (
            <button
              key={rate}
              onClick={() => setPlaybackRate(rate)}
              className={`text-xs px-2 py-1 rounded transition ${
                playbackRate === rate 
                  ? 'bg-[rgb(var(--accent))] text-white' 
                  : theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
