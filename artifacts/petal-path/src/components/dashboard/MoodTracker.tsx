import { useState } from "react";
import { format, subDays } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { WidgetSize, DEFAULT_WIDGET_SIZE } from "./widgets/registry";

const MOODS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "🌸", label: "Bloom" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😴", label: "Tired" },
  { emoji: "💖", label: "Loved" },
  { emoji: "😭", label: "Sad" },
  { emoji: "😡", label: "Angry" },
  { emoji: "☁️", label: "Cloudy" },
  { emoji: "✨", label: "Sparkle" }
];

type MoodLog = { emoji: string; intensity: number; note: string };

interface MoodTrackerProps {
  size?: WidgetSize;
}

export default function MoodTracker({ size = DEFAULT_WIDGET_SIZE }: MoodTrackerProps) {
  const today = format(new Date(), "yyyy-MM-dd");
  const [logs, setLogs] = useLocalStorage<Record<string, MoodLog>>("petal-mood", {});
  const currentLog = logs[today];

  const [selectedMood, setSelectedMood] = useState(currentLog?.emoji || "");
  const [intensity, setIntensity] = useState([currentLog?.intensity || 5]);
  const [note, setNote] = useState(currentLog?.note || "");

  const handleSave = () => {
    if (!selectedMood) return;
    setLogs({ ...logs, [today]: { emoji: selectedMood, intensity: intensity[0], note } });
  };

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    const key = format(d, "yyyy-MM-dd");
    return { key, day: format(d, "EEE"), log: logs[key] };
  });

  if (size === "small") {
    return (
      <div className="flex flex-col h-full space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary">Mood</h3>
        </div>
        
        {currentLog ? (
          <div className="flex items-center justify-center flex-1">
             <div className="text-5xl drop-shadow-sm">{currentLog.emoji}</div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1 justify-center">
            {MOODS.slice(0, 6).map(m => (
              <button
                key={m.emoji}
                onClick={() => { setSelectedMood(m.emoji); handleSave(); }}
                className={`text-xl p-1 rounded-full transition-all duration-200 hover:bg-muted opacity-80 hover:opacity-100 hover:scale-110`}
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-primary font-bold">Mood Tracker</h3>
      </div>
      
      {currentLog ? (
        <div className="bg-muted/30 p-4 rounded-xl text-center space-y-2">
          <div className="text-4xl">{currentLog.emoji}</div>
          <div className="text-sm font-medium text-foreground">Intensity: {currentLog.intensity}/10</div>
          {currentLog.note && <p className="text-xs text-muted-foreground mt-2 italic">"{currentLog.note}"</p>}
          <Button variant="ghost" size="sm" onClick={() => { const next = { ...logs }; delete next[today]; setLogs(next); }} className="text-xs h-6 mt-2 hover:bg-primary/10 hover:text-primary transition-colors">
            Edit
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {MOODS.map(m => (
              <button
                key={m.emoji}
                onClick={() => setSelectedMood(m.emoji)}
                className={`text-2xl p-2 rounded-full transition-all duration-200 ${selectedMood === m.emoji ? "bg-primary/20 scale-110 shadow-sm" : "hover:bg-muted opacity-60 hover:opacity-100 hover:scale-105"}`}
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span className="font-semibold text-foreground">Intensity: {intensity[0]}</span>
                  <span>High</span>
                </div>
                <Slider value={intensity} onValueChange={setIntensity} max={10} min={1} step={1} />
              </div>

              {size === "large" && (
                <Textarea
                  placeholder="Why are you feeling this way? (Optional)"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="text-sm resize-none border-border/50 focus-visible:ring-primary/30"
                  rows={2}
                />
              )}

              <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-white rounded-full transition-all duration-200 hover:shadow-md">
                Log Mood 🌸
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 7-day history strip */}
      <div className="pt-2 border-t border-border/30">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">This week</p>
        <div className="flex justify-between">
          {last7.map(({ key, day, log }) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-base transition-all ${
                  key === today
                    ? "ring-2 ring-primary ring-offset-1 ring-offset-card"
                    : ""
                } ${log ? "bg-primary/10" : "bg-muted/40"}`}
                title={log ? `${log.emoji} ${log.intensity}/10` : "No entry"}
              >
                {log ? log.emoji : <span className="text-muted-foreground/30 text-xs">·</span>}
              </div>
              <span className="text-[9px] text-muted-foreground font-medium">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
