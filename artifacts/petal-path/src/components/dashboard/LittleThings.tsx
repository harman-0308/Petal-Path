import { useState } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

const PRESET_CHIPS = ["Drank coffee ☕", "Listened to music 🎵", "Went outside 🌤", "Talked to friends 💬", "Read a book 📚"];

export default function LittleThings() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [customChips, setCustomChips] = useLocalStorage<string[]>("petal-littlethings-custom", []);
  const [logs, setLogs] = useLocalStorage<Record<string, string[]>>("petal-littlethings-logs", {});
  
  const [newChip, setNewChip] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const currentLog = logs[today] || [];
  const allChips = [...PRESET_CHIPS, ...customChips];

  const toggleChip = (chip: string) => {
    const isDone = currentLog.includes(chip);
    const newLog = isDone ? currentLog.filter(c => c !== chip) : [...currentLog, chip];
    setLogs({ ...logs, [today]: newLog });
  };

  const addChip = () => {
    if (newChip.trim() && !allChips.includes(newChip.trim())) {
      setCustomChips([...customChips, newChip.trim()]);
      setNewChip("");
      setIsAdding(false);
    }
  };

  const deleteCustomChip = (chip: string) => {
    setCustomChips(customChips.filter(c => c !== chip));
    setLogs(prev => {
      const updated = { ...prev };
      for (const date in updated) {
        updated[date] = updated[date].filter(c => c !== chip);
      }
      return updated;
    });
  };

  return (
    <Card className="bg-card hover-elevate">
      <CardHeader className="pb-3 flex flex-row justify-between items-center">
        <CardTitle className="text-lg text-primary font-bold">Little Things</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsAdding(!isAdding)} className="h-6 w-6">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isAdding && (
          <div className="flex gap-2">
            <Input 
              value={newChip} 
              onChange={e => setNewChip(e.target.value)} 
              placeholder="e.g., Ate a good meal 🍲"
              className="h-8 text-sm"
              onKeyDown={e => e.key === 'Enter' && addChip()}
            />
            <Button size="sm" onClick={addChip} className="h-8 px-3">Add</Button>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {allChips.map(chip => {
            const isDone = currentLog.includes(chip);
            const isCustom = customChips.includes(chip);
            return (
              <div key={chip} className="relative group/chip">
                <button
                  onClick={() => toggleChip(chip)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all border ${
                    isDone 
                    ? "bg-secondary text-secondary-foreground border-secondary font-medium shadow-sm" 
                    : "bg-transparent text-muted-foreground border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  {chip}
                </button>
                {isCustom && (
                  <button
                    onClick={() => deleteCustomChip(chip)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center opacity-0 group-hover/chip:opacity-100 transition-opacity hover:bg-destructive hover:text-white"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
