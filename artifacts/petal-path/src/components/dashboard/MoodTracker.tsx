import { useState } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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

export default function MoodTracker() {
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

  return (
    <Card className="bg-card hover-elevate">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary font-bold">Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentLog ? (
          <div className="bg-muted/30 p-4 rounded-xl text-center space-y-2">
            <div className="text-4xl">{currentLog.emoji}</div>
            <div className="text-sm font-medium text-foreground">Intensity: {currentLog.intensity}/10</div>
            {currentLog.note && <p className="text-xs text-muted-foreground mt-2 italic">"{currentLog.note}"</p>}
            <Button variant="ghost" size="sm" onClick={() => setLogs({ ...logs, [today]: undefined as any })} className="text-xs h-6 mt-2">
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
                  className={`text-2xl p-2 rounded-full transition-all ${selectedMood === m.emoji ? "bg-primary/20 scale-110" : "hover:bg-muted opacity-60 hover:opacity-100"}`}
                  title={m.label}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
            
            {selectedMood && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>Intensity: {intensity[0]}</span>
                    <span>High</span>
                  </div>
                  <Slider value={intensity} onValueChange={setIntensity} max={10} min={1} step={1} />
                </div>
                
                <Textarea 
                  placeholder="Why are you feeling this way? (Optional)" 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="text-sm resize-none"
                  rows={2}
                />
                
                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                  Log Mood 🌸
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
