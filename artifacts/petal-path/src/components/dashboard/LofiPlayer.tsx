import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const STREAMS = [
  { id: "lofi", name: "Lofi Beats", url: "https://stream.zeno.fm/0r0xa792kwzuv" },
  { id: "rain", name: "Rain Sounds", url: "https://stream.zeno.fm/yn65f92uaaitv" },
  { id: "cafe", name: "Café", url: "https://stream.zeno.fm/f3wvbbqmdg8uv" },
  { id: "noise", name: "White Noise", url: "https://stream.zeno.fm/q3wm2pb73fhuv" },
];

export default function LofiPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setError(true));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentStreamIndex]);

  const togglePlay = () => {
    setError(false);
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextStream = () => {
    setCurrentStreamIndex((prev) => (prev + 1) % STREAMS.length);
    setError(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio 
        ref={audioRef} 
        src={STREAMS[currentStreamIndex].url} 
        preload="none"
        onError={() => {
          setError(true);
          setIsPlaying(false);
        }}
      />
      
      <motion.div 
        layout
        className="bg-card/90 backdrop-blur-md border border-primary/20 shadow-lg rounded-full overflow-hidden flex items-center p-1.5 pr-3"
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-10 w-10 shrink-0 bg-primary/10 text-primary hover:bg-primary hover:text-white"
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-1" />}
        </Button>
        
        <div className="flex flex-col ml-3 mr-2 cursor-pointer select-none min-w-[90px]" onClick={() => setExpanded(!expanded)}>
          <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
            {STREAMS[currentStreamIndex].name}
            {isPlaying && !error && (
              <motion.div className="flex gap-0.5 items-end h-2.5">
                <motion.div animate={{ height: ["40%", "100%", "40%"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 bg-primary rounded-full" />
                <motion.div animate={{ height: ["80%", "30%", "80%"] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-0.5 bg-primary rounded-full" />
                <motion.div animate={{ height: ["50%", "90%", "50%"] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-0.5 bg-primary rounded-full" />
              </motion.div>
            )}
          </div>
          <div className="text-[10px] text-muted-foreground truncate">
            {error ? "Stream unavailable" : isPlaying ? "Playing..." : "Paused"}
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center overflow-hidden"
            >
              <div className="h-6 w-px bg-border mx-1" />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={nextStream}>
                <Music className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
