import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WidgetSize, DEFAULT_WIDGET_SIZE } from "./widgets/registry";

type Habit = { id: string, name: string, streak: number, totalDays: number };

interface HabitTrackerProps {
  size?: WidgetSize;
}

export default function HabitTracker({ size = DEFAULT_WIDGET_SIZE }: HabitTrackerProps) {
  const [habits, setHabits] = useLocalStorage<Habit[]>("petal-habits", []);
  const [dailyLogs, setDailyLogs] = useLocalStorage<Record<string, string[]>>("petal-habit-logs", {});
  
  const today = format(new Date(), "yyyy-MM-dd");
  const todayLogs = dailyLogs[today] || [];
  
  const [newHabitName, setNewHabitName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    setHabits([...habits, { id: Date.now().toString(), name: newHabitName, streak: 0, totalDays: 0 }]);
    setNewHabitName("");
    setIsDialogOpen(false);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    setDailyLogs(prev => {
      const updated = { ...prev };
      for (const date in updated) {
        updated[date] = updated[date].filter(logId => logId !== id);
      }
      return updated;
    });
  };

  const toggleHabit = (id: string) => {
    const isDone = todayLogs.includes(id);
    let newLogs = [...todayLogs];
    
    if (isDone) {
      newLogs = newLogs.filter(logId => logId !== id);
    } else {
      newLogs.push(id);
    }
    
    setDailyLogs(prev => ({ ...prev, [today]: newLogs }));
    
    // Update streak (simplified logic for demo purposes)
    setHabits(habits.map(h => {
      if (h.id === id) {
        return { 
          ...h, 
          streak: isDone ? Math.max(0, h.streak - 1) : h.streak + 1,
          totalDays: isDone ? Math.max(0, h.totalDays - 1) : h.totalDays + 1
        };
      }
      return h;
    }));
  };

  if (size === "small") {
    const displayHabits = habits.slice(0, 4);
    const remaining = habits.length - displayHabits.length;

    return (
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-primary">Habits</h3>
        </div>
        <div className="space-y-3">
          {displayHabits.length === 0 ? (
            <div className="text-center py-2 text-muted-foreground text-sm">
              No habits 🌱
            </div>
          ) : (
            displayHabits.map(habit => {
              const isDone = todayLogs.includes(habit.id);
              return (
                <div key={habit.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isDone ? "bg-primary border-primary" : "border-primary/30 bg-transparent"
                      }`}
                    >
                      {isDone && (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </motion.button>
                    <span className={`text-sm font-medium transition-colors truncate max-w-[100px] ${isDone ? "text-primary" : "text-foreground"}`}>
                      {habit.name}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    {habit.streak} 🔥
                  </div>
                </div>
              );
            })
          )}
          {remaining > 0 && (
            <div className="text-xs text-muted-foreground flex justify-end">
              + {remaining} more
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg text-primary font-bold">Habits</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" data-testid="button-add-habit-modal">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-primary font-bold">Add New Habit</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-muted-foreground">Habit Name</Label>
                <Input 
                  id="name" 
                  value={newHabitName} 
                  onChange={(e) => setNewHabitName(e.target.value)} 
                  placeholder="e.g. Read 10 pages" 
                  className="border-border/50 focus-visible:ring-primary/30"
                  data-testid="input-habit-name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addHabit} className="bg-primary hover:bg-primary/90 text-white rounded-full w-full" data-testid="button-save-habit">
                Create Habit ✿
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            Plant a new habit seed to start growing! 🌱
          </div>
        ) : (
          habits.map(habit => {
            const isDone = todayLogs.includes(habit.id);
            return (
              <div key={habit.id} className="space-y-2 group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isDone ? "bg-primary border-primary" : "border-primary/30 bg-transparent"
                      }`}
                      data-testid={`habit-check-${habit.id}`}
                    >
                      {isDone && (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }} 
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </motion.button>
                    <span className={`text-sm font-medium transition-colors ${isDone ? "text-primary" : "text-foreground"}`}>
                      {habit.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {habit.streak} 🔥
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteHabit(habit.id)}
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Progress 
                  value={Math.min(100, (habit.totalDays / 30) * 100)} 
                  className="h-1.5 bg-muted" 
                  indicatorClassName="bg-primary/60"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}