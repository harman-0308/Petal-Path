import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STREAMS = [
  { id: "lofi",  name: "Lofi Beats",   emoji: "🎵", url: "https://stream.zeno.fm/0r0xa792kwzuv" },
  { id: "rain",  name: "Rain",          emoji: "🌧️", url: "https://stream.zeno.fm/yn65f92uaaitv" },
  { id: "cafe",  name: "Café",          emoji: "☕", url: "https://stream.zeno.fm/f3wvbbqmdg8uv" },
  { id: "noise", name: "White Noise",   emoji: "🌊", url: "https://stream.zeno.fm/q3wm2pb73fhuv" },
];

export default function LofiPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    if (isPlaying) {
      audio.play().catch(() => setError(true));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentIdx]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Click outside to close expanded music options
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (playerRef.current && !playerRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    }
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

  const selectStream = useCallback((idx: number) => {
    setCurrentIdx(idx);
    setError(false);
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => setError(true));
    }
  }, [isPlaying]);

  const stream = STREAMS[currentIdx];

  return (
    <div ref={playerRef} className="relative flex items-center gap-1.5 md:gap-2">
      <audio
        ref={audioRef}
        src={stream.url}
        preload="none"
        onError={() => { setError(true); setIsPlaying(false); }}
      />

      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full h-9 w-9 shrink-0 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all press-scale flex items-center justify-center"
        onClick={() => { setError(false); setIsPlaying(p => !p); }}
      >
        {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5 ml-0.5" />}
      </Button>

      {/* Title & Stats (Hidden on small mobile screens to keep the navbar ultra compact) */}
      <div className="hidden md:flex flex-col min-w-[70px] max-w-[110px] select-none text-left">
        <div className="text-[10px] font-bold text-foreground flex items-center gap-1 leading-none">
          <span className="truncate">{stream.emoji} {stream.name}</span>
          {isPlaying && !error && (
            <div className="flex gap-0.5 items-end h-2 flex-shrink-0">
              {[0.8, 1.2, 0.9].map((dur, i) => (
                <div
                  key={i}
                  className="w-0.5 h-full bg-primary rounded-full animate-pulse"
                  style={{ animationDuration: `${dur}s` }}
                />
              ))}
            </div>
          )}
        </div>
        <span className="text-[8px] text-muted-foreground font-bold leading-none mt-0.5">
          {error ? "Unavailable" : isPlaying ? "Playing" : "Paused"}
        </span>
      </div>

      {/* Expanded Control Button */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 rounded-full transition-all press-scale flex items-center justify-center ${expanded ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"}`}
        onClick={() => setExpanded(e => !e)}
      >
        {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </Button>

      {/* Options Panel (Rendered directly above the player) */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-14 right-0 w-60 z-50"
          >
            <Card className="p-3 rounded-2xl shadow-lg flex flex-col gap-3 bg-card border border-border/50">
              {/* Stream selector */}
              <div className="grid grid-cols-2 gap-1.5">
                {STREAMS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => selectStream(i)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                      i === currentIdx
                        ? "bg-primary text-white shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{s.emoji}</span>
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </div>

              <div className="h-px bg-border/40" />

              {/* Volume Controls */}
              <div className="flex items-center gap-2 px-0.5">
                <button 
                  onClick={() => setVolume(v => Math.max(0, +(v - 0.1).toFixed(1)))} 
                  className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                >
                  <VolumeX className="h-3.5 w-3.5" />
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={e => setVolume(+e.target.value)}
                  className="flex-1 h-1 accent-primary cursor-pointer rounded-lg appearance-none bg-muted"
                />
                <button 
                  onClick={() => setVolume(v => Math.min(1, +(v + 0.1).toFixed(1)))} 
                  className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
