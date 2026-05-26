import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Activity } from "lucide-react";

type Workout = { id: string, type: string, duration: string, notes: string };

export default function ExerciseTracker() {
  const today = format(new Date(), "yyyy-MM-dd");
  const [logs, setLogs] = useLocalStorage<Record<string, Workout[]>>("petal-exercise", {});
  const todayLogs = logs[today] || [];

  const [type, setType] = useState("Cardio");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const addWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration) return;
    const newWorkout: Workout = { id: Date.now().toString(), type, duration, notes };
    setLogs({ ...logs, [today]: [...todayLogs, newWorkout] });
    setDuration("");
    setNotes("");
  };

  const deleteWorkout = (id: string) => {
    setLogs({ ...logs, [today]: todayLogs.filter(w => w.id !== id) });
  };

  return (
    <Card className="bg-card hover-elevate">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-primary font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" /> Movement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={addWorkout} className="space-y-2">
          <div className="flex gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[110px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cardio">Cardio</SelectItem>
                <SelectItem value="Strength">Strength</SelectItem>
                <SelectItem value="Yoga">Yoga</SelectItem>
                <SelectItem value="Walk">Walk</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              type="number" 
              placeholder="Min" 
              value={duration} 
              onChange={e => setDuration(e.target.value)}
              className="w-16 h-8 text-xs"
            />
            <Button type="submit" size="sm" className="h-8 flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-xs">
              Log
            </Button>
          </div>
          <Input 
            placeholder="Optional notes..." 
            value={notes} 
            onChange={e => setNotes(e.target.value)}
            className="h-8 text-xs"
          />
        </form>

        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
          <AnimatePresence>
            {todayLogs.map(w => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm group"
              >
                <div>
                  <span className="font-semibold text-foreground">{w.type}</span>
                  <span className="text-muted-foreground ml-2">{w.duration} min</span>
                  {w.notes && <p className="text-xs text-muted-foreground/70">{w.notes}</p>}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteWorkout(w.id)}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          {todayLogs.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-2">No activity logged yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}