import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const STREAMS = [
  { id: "lofi",  name: "Lofi Beats",   emoji: "🎵", url: "https://stream.zeno.fm/0r0xa792kwzuv" },
  { id: "rain",  name: "Rain",          emoji: "🌧️", url: "https://stream.zeno.fm/yn65f92uaaitv" },
  { id: "cafe",  name: "Café",          emoji: "☕", url: "https://stream.zeno.fm/f3wvbbqmdg8uv" },
  { id: "noise", name: "White Noise",   emoji: "🌊", url: "https://stream.zeno.fm/q3wm2pb73fhuv" },
];

export default function LofiPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
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
    <div className="fixed bottom-6 right-6 z-50">
      <audio
        ref={audioRef}
        src={stream.url}
        preload="none"
        onError={() => { setError(true); setIsPlaying(false); }}
      />

      <motion.div layout className="bg-card/95 backdrop-blur-md border border-primary/20 shadow-lg rounded-2xl overflow-hidden">
        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pt-3 pb-2 space-y-2.5">
                {/* Stream selector */}
                <div className="grid grid-cols-2 gap-1.5">
                  {STREAMS.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => selectStream(i)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        i === currentIdx
                          ? "bg-primary text-white shadow-sm"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span>{s.emoji}</span>
                      <span>{s.name}</span>
                    </button>
                  ))}
                </div>

                {/* Volume */}
                <div className="flex items-center gap-2 px-0.5">
                  <button onClick={() => setVolume(v => Math.max(0, +(v - 0.1).toFixed(1)))} className="text-muted-foreground hover:text-primary transition-colors">
                    <VolumeX className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={e => setVolume(+e.target.value)}
                    className="flex-1 h-1 accent-pink-400 cursor-pointer"
                  />
                  <button onClick={() => setVolume(v => Math.min(1, +(v + 0.1).toFixed(1)))} className="text-muted-foreground hover:text-primary transition-colors">
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="h-px bg-border/40 mx-3" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main pill row */}
        <div className="flex items-center gap-2 p-1.5 pr-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-9 w-9 shrink-0 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
            onClick={() => { setError(false); setIsPlaying(p => !p); }}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>

          <div className="flex flex-col min-w-[88px]">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5 leading-tight">
              <span>{stream.emoji}</span>
              <span>{stream.name}</span>
              {isPlaying && !error && (
                <motion.div className="flex gap-0.5 items-end h-2.5">
                  {[0.8, 1.2, 0.9].map((dur, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ["40%", "100%", "40%"] }}
                      transition={{ repeat: Infinity, duration: dur, delay: i * 0.15 }}
                      className="w-0.5 bg-primary rounded-full"
                    />
                  ))}
                </motion.div>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground leading-tight">
              {error ? "Unavailable" : isPlaying ? "Playing..." : "Paused"}
            </div>
          </div>

          <button
            onClick={() => setExpanded(e => !e)}
            className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-lg hover:bg-muted/50"
          >
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
