import { useState, FormEvent } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSettings } from "@/hooks/use-settings";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Target, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

type Goal = { id: string; text: string; progress: number };

export default function MonthlyView() {
  const { settings } = useSettings();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habitLogs] = useLocalStorage<Record<string, string[]>>("petal-habit-logs", {});
  const [goals, setGoals] = useLocalStorage<Goal[]>("petal-goals", []);

  const [newGoal, setNewGoal] = useState("");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startingDayOfWeek = monthStart.getDay();
  // If Monday is start of week: Sun(0) -> 6, Mon(1) -> 0
  // If Sunday is start of week: Sun(0) -> 0, Mon(1) -> 1
  const paddingCount = settings.weekStart === "monday" 
    ? (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1)
    : startingDayOfWeek;
    
  const paddingDays = Array.from({ length: paddingCount }).map(() => null);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const addGoal = (e: FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    setGoals(prev => [...prev, { id: Date.now().toString(), text: newGoal.trim(), progress: 0 }]);
    setNewGoal("");
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, progress } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Calendar */}
        <Card className="bg-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl text-primary font-bold">
              {format(currentDate, "MMMM yyyy")}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-full border-primary/20">
                <ChevronLeft className="h-4 w-4 text-primary" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-full border-primary/20">
                <ChevronRight className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {(settings.weekStart === "monday" 
                ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
              ).map(day => (
                <div key={day} className="text-xs font-bold text-muted-foreground uppercase">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 lg:gap-2">
              {paddingDays.map((_, i) => (
                <div key={`pad-${i}`} className="h-16 lg:h-24 rounded-xl bg-transparent" />
              ))}
              {daysInMonth.map(day => {
                const dateStr = format(day, "yyyy-MM-dd");
                const logsCount = (habitLogs[dateStr] || []).length;
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toISOString()}
                    className={`h-16 lg:h-24 rounded-xl border border-border/40 p-1 flex flex-col items-center hover:bg-muted/30 transition-colors ${
                      isToday ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20' : 'bg-card'
                    }`}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-primary font-bold' : 'text-foreground/80'}`}>
                      {format(day, 'd')}
                    </span>
                    <div className="mt-auto flex flex-wrap gap-0.5 justify-center p-1">
                      {logsCount > 0 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" title={`${logsCount} habits`} />
                      )}
                      {logsCount > 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      )}
                      {logsCount > 6 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Legend */}
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Habits logged</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary/30 ring-1 ring-primary/40" />
                <span>Today</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-primary font-bold flex items-center gap-2">
              <Target className="h-5 w-5" /> Monthly Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={addGoal} className="flex gap-2">
              <Input
                value={newGoal}
                onChange={e => setNewGoal(e.target.value)}
                placeholder="Add a goal..."
                className="text-sm"
              />
              <Button type="submit" size="sm" className="bg-primary text-white shrink-0">
                Add
              </Button>
            </form>

            <div className="space-y-5 max-h-[500px] overflow-y-auto pretty-scroll pr-1">
              {goals.length === 0 && (
                <p className="text-center text-sm text-muted-foreground italic py-6">
                  🌟 What do you want to achieve this month?
                </p>
              )}
              {goals.map(goal => (
                <div key={goal.id} className="space-y-2 group">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-medium text-sm text-foreground leading-snug flex-1">{goal.text}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-muted-foreground font-bold w-8 text-right">{goal.progress}%</span>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                        title="Delete goal"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex gap-1">
                    {[0, 25, 50, 75, 100].map(val => (
                      <button
                        key={val}
                        onClick={() => updateGoalProgress(goal.id, val)}
                        className={`text-[10px] px-2 py-0.5 rounded-full flex-1 transition-colors font-medium ${
                          goal.progress === val
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {val === 100 ? '✓' : `${val}%`}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
